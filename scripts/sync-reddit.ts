import { PrismaClient } from '@prisma/client';
import { calculateRepurposeScore } from '../lib/utils';

const prisma = new PrismaClient();

interface RedditPost {
  data: {
    id: string;
    subreddit: string;
    title: string;
    selftext: string;
    url: string;
    author: string;
    score: number;
    num_comments: number;
    created_utc: number;
  };
}

interface RedditResponse {
  data: {
    children: RedditPost[];
  };
}

// Rate limiting helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function getRedditAccessToken(): Promise<string> {
  const clientId = process.env.REDDIT_CLIENT_ID;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET;
  const userAgent = process.env.REDDIT_USER_AGENT;

  if (!clientId || !clientSecret || !userAgent) {
    throw new Error('Missing Reddit API credentials in environment variables');
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  
  const response = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': userAgent,
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error(`Failed to get Reddit access token: ${response.statusText}`);
  }

  const data = await response.json();
  return data.access_token;
}

async function fetchSubredditPosts(
  accessToken: string,
  subreddit: string,
  limit: number = 25
): Promise<RedditPost[]> {
  const userAgent = process.env.REDDIT_USER_AGENT!;
  
  const response = await fetch(
    `https://oauth.reddit.com/r/${subreddit}/hot?limit=${limit}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'User-Agent': userAgent,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch r/${subreddit}: ${response.statusText}`);
  }

  const data: RedditResponse = await response.json();
  return data.data.children;
}

async function syncReddit() {
  console.log('🚀 Starting Reddit sync...\n');

  try {
    // Get access token
    console.log('🔐 Authenticating with Reddit API...');
    const accessToken = await getRedditAccessToken();
    console.log('✅ Authenticated successfully\n');

    // Subreddits to monitor (customize these based on your interests)
    const subreddits = [
      'technology',
      'programming',
      'webdev',
      'startups',
      'entrepreneur',
      'productivity',
      'artificial',
      'machinelearning',
    ];

    let totalFetched = 0;
    let totalNew = 0;

    for (const subreddit of subreddits) {
      try {
        console.log(`📥 Fetching posts from r/${subreddit}...`);
        const posts = await fetchSubredditPosts(accessToken, subreddit);
        totalFetched += posts.length;

        for (const post of posts) {
          const postData = post.data;

          // Check if post already exists
          const existing = await prisma.redditItem.findUnique({
            where: { redditId: postData.id },
          });

          if (existing) {
            // Update score and comment count for existing posts
            await prisma.redditItem.update({
              where: { redditId: postData.id },
              data: {
                score: postData.score,
                numComments: postData.num_comments,
                repurposeScore: calculateRepurposeScore({
                  score: postData.score,
                  numComments: postData.num_comments,
                  title: postData.title,
                  selftext: postData.selftext,
                }),
              },
            });
          } else {
            // Create new post
            await prisma.redditItem.create({
              data: {
                redditId: postData.id,
                subreddit: postData.subreddit,
                title: postData.title,
                selftext: postData.selftext || null,
                url: postData.url,
                author: postData.author,
                score: postData.score,
                numComments: postData.num_comments,
                createdAt: new Date(postData.created_utc * 1000),
                repurposeScore: calculateRepurposeScore({
                  score: postData.score,
                  numComments: postData.num_comments,
                  title: postData.title,
                  selftext: postData.selftext,
                }),
              },
            });
            totalNew++;
          }
        }

        console.log(`✅ Processed ${posts.length} posts from r/${subreddit}`);
        
        // Rate limiting: wait 2 seconds between subreddit requests
        await delay(2000);
      } catch (error) {
        console.error(`❌ Error fetching r/${subreddit}:`, error);
        continue;
      }
    }

    console.log(`\n✨ Sync complete!`);
    console.log(`📊 Total posts fetched: ${totalFetched}`);
    console.log(`🆕 New posts added: ${totalNew}`);
    console.log(`🔄 Updated posts: ${totalFetched - totalNew}`);
  } catch (error) {
    console.error('❌ Sync failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the sync
syncReddit();
