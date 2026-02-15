import { PrismaClient } from '@prisma/client';
import { calculateReachScore } from '../lib/utils';

const prisma = new PrismaClient();

interface TweetData {
  id: string;
  text: string;
  public_metrics: {
    impression_count: number;
    like_count: number;
    retweet_count: number;
    reply_count: number;
  };
  created_at: string;
}

interface XAPIResponse {
  data: TweetData[];
  meta?: {
    result_count: number;
  };
}

// Rate limiting helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchUserTweets(bearerToken: string, userId: string): Promise<TweetData[]> {
  const url = `https://api.twitter.com/2/users/${userId}/tweets?max_results=100&tweet.fields=created_at,public_metrics`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${bearerToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch tweets: ${response.statusText}`);
  }

  const data: XAPIResponse = await response.json();
  return data.data || [];
}

async function getTweetMetrics(bearerToken: string, tweetId: string): Promise<TweetData | null> {
  const url = `https://api.twitter.com/2/tweets/${tweetId}?tweet.fields=created_at,public_metrics`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${bearerToken}`,
    },
  });

  if (!response.ok) {
    console.error(`Failed to fetch tweet ${tweetId}: ${response.statusText}`);
    return null;
  }

  const data = await response.json();
  return data.data;
}

async function getUserId(bearerToken: string, username: string): Promise<string> {
  const url = `https://api.twitter.com/2/users/by/username/${username}`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${bearerToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user ID: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data.id;
}

async function syncX() {
  console.log('🚀 Starting X (Twitter) sync...\n');

  try {
    const bearerToken = process.env.X_BEARER_TOKEN;

    if (!bearerToken) {
      throw new Error('Missing X_BEARER_TOKEN in environment variables');
    }

    console.log('🔐 Authenticating with X API...');
    
    // Get posted drafts that have tweetIds
    const postedDrafts = await prisma.draft.findMany({
      where: {
        status: 'posted',
        tweetId: {
          not: null,
        },
      },
      include: {
        tweetMetric: true,
      },
    });

    console.log(`✅ Found ${postedDrafts.length} posted tweets to sync\n`);

    let updated = 0;
    let created = 0;

    for (const draft of postedDrafts) {
      if (!draft.tweetId) continue;

      try {
        console.log(`📊 Fetching metrics for tweet ${draft.tweetId}...`);
        
        const tweetData = await getTweetMetrics(bearerToken, draft.tweetId);

        if (!tweetData) {
          console.log(`⚠️  Could not fetch data for tweet ${draft.tweetId}`);
          continue;
        }

        const metrics = tweetData.public_metrics;
        const engagements = metrics.like_count + metrics.retweet_count + metrics.reply_count;
        const reachScore = calculateReachScore({
          impressions: metrics.impression_count,
          engagements,
          likes: metrics.like_count,
          retweets: metrics.retweet_count,
          replies: metrics.reply_count,
        });

        if (draft.tweetMetric) {
          // Update existing metric
          await prisma.tweetMetric.update({
            where: { id: draft.tweetMetric.id },
            data: {
              impressions: metrics.impression_count,
              engagements,
              likes: metrics.like_count,
              retweets: metrics.retweet_count,
              replies: metrics.reply_count,
              reachScore,
              lastSyncedAt: new Date(),
            },
          });
          updated++;
          console.log(`✅ Updated metrics for tweet ${draft.tweetId}`);
        } else {
          // Create new metric
          await prisma.tweetMetric.create({
            data: {
              draftId: draft.id,
              tweetId: draft.tweetId,
              impressions: metrics.impression_count,
              engagements,
              likes: metrics.like_count,
              retweets: metrics.retweet_count,
              replies: metrics.reply_count,
              reachScore,
              postedAt: draft.postedAt || new Date(tweetData.created_at),
            },
          });
          created++;
          console.log(`✅ Created metrics for tweet ${draft.tweetId}`);
        }

        // Rate limiting: wait 1 second between requests
        await delay(1000);
      } catch (error) {
        console.error(`❌ Error syncing tweet ${draft.tweetId}:`, error);
        continue;
      }
    }

    console.log(`\n✨ Sync complete!`);
    console.log(`📊 Metrics updated: ${updated}`);
    console.log(`🆕 New metrics created: ${created}`);
  } catch (error) {
    console.error('❌ Sync failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the sync
syncX();
