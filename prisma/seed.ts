import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.insight.deleteMany();
  await prisma.tweetMetric.deleteMany();
  await prisma.draft.deleteMany();
  await prisma.redditItem.deleteMany();

  // Create sample Reddit items
  const redditItems = await Promise.all([
    prisma.redditItem.create({
      data: {
        redditId: 'abc123',
        subreddit: 'technology',
        title: 'New breakthrough in AI reasoning: Models can now explain their decision-making process',
        selftext: 'Researchers at MIT have developed a new technique that allows AI models to provide detailed explanations of their reasoning process. This could help build trust and transparency in AI systems.',
        url: 'https://reddit.com/r/technology/abc123',
        author: 'tech_enthusiast',
        score: 2840,
        numComments: 456,
        createdAt: new Date('2026-02-10T10:00:00Z'),
        repurposeScore: 89.5,
        saved: false,
        processed: false,
      },
    }),
    prisma.redditItem.create({
      data: {
        redditId: 'def456',
        subreddit: 'startups',
        title: 'Launched my SaaS to $10k MRR in 6 months - Here\'s what worked',
        selftext: 'After countless failures, I finally built something people want. The key was talking to customers every single day and iterating based on their feedback. Here are my lessons...',
        url: 'https://reddit.com/r/startups/def456',
        author: 'indie_maker',
        score: 1920,
        numComments: 234,
        createdAt: new Date('2026-02-11T14:30:00Z'),
        repurposeScore: 85.2,
        saved: false,
        processed: false,
      },
    }),
    prisma.redditItem.create({
      data: {
        redditId: 'ghi789',
        subreddit: 'programming',
        title: 'Why your tests are slow and how to fix it',
        selftext: 'Most developers write slow tests without realizing it. Here are 5 common mistakes that make test suites crawl and practical solutions for each.',
        url: 'https://reddit.com/r/programming/ghi789',
        author: 'code_wizard',
        score: 3450,
        numComments: 567,
        createdAt: new Date('2026-02-12T09:15:00Z'),
        repurposeScore: 92.8,
        saved: false,
        processed: false,
      },
    }),
    prisma.redditItem.create({
      data: {
        redditId: 'jkl012',
        subreddit: 'webdev',
        title: 'CSS Grid vs Flexbox: When to use which?',
        selftext: 'A comprehensive guide with real-world examples.',
        url: 'https://reddit.com/r/webdev/jkl012',
        author: 'frontend_dev',
        score: 890,
        numComments: 89,
        createdAt: new Date('2026-02-13T16:45:00Z'),
        repurposeScore: 68.5,
        saved: false,
        processed: false,
      },
    }),
    prisma.redditItem.create({
      data: {
        redditId: 'mno345',
        subreddit: 'productivity',
        title: 'I tracked my time for 30 days. Here\'s what I learned about focus.',
        selftext: 'Deep work is rare. I spent only 3 hours per day on meaningful work. The rest was meetings, emails, and context switching. Here\'s how I\'m fixing it...',
        url: 'https://reddit.com/r/productivity/mno345',
        author: 'time_hacker',
        score: 2100,
        numComments: 312,
        createdAt: new Date('2026-02-14T11:20:00Z'),
        repurposeScore: 87.3,
        saved: false,
        processed: false,
      },
    }),
  ]);

  console.log(`✅ Created ${redditItems.length} Reddit items`);

  // Create sample drafts
  const drafts = await Promise.all([
    prisma.draft.create({
      data: {
        redditItemId: redditItems[0].id,
        hook: '🧠 AI just got more transparent',
        body: 'MIT researchers cracked a major challenge:\n\nAI models can now explain WHY they make decisions.\n\nThis changes everything for trust in AI systems.\n\nImagine:\n→ Medical AI explaining diagnoses\n→ Self-driving cars sharing reasoning\n→ Content moderation with clear logic\n\nTransparency = Trust\n\nThe future of AI isn\'t just smart.\nIt\'s explainable.',
        format: 'thread',
        status: 'draft',
        createdAt: new Date('2026-02-14T15:00:00Z'),
      },
    }),
    prisma.draft.create({
      data: {
        redditItemId: redditItems[1].id,
        hook: '💰 $0 → $10k MRR in 6 months',
        body: 'The secret wasn\'t the product.\n\nIt was talking to customers EVERY. SINGLE. DAY.\n\nHere\'s the playbook:\n\n1. Build something small\n2. Get it in front of 10 people\n3. Listen (really listen)\n4. Iterate fast\n5. Repeat\n\nMost founders build in isolation.\nThe winners build in public with feedback loops.\n\nYour customers know what they need.\nYour job is to listen.',
        format: 'thread',
        status: 'queued',
        createdAt: new Date('2026-02-13T10:00:00Z'),
      },
    }),
    prisma.draft.create({
      data: {
        redditItemId: redditItems[2].id,
        hook: '🐌 Your tests don\'t have to be slow',
        body: '5 mistakes that kill test performance:\n\n1. Testing implementation, not behavior\n2. Not using test doubles\n3. Starting the entire app for unit tests\n4. No parallel execution\n5. Hitting real databases\n\nFix these and watch your CI time drop 80%.\n\nFast tests = faster shipping.',
        format: 'single',
        status: 'draft',
        createdAt: new Date('2026-02-14T12:00:00Z'),
      },
    }),
  ]);

  console.log(`✅ Created ${drafts.length} drafts`);

  // Create sample posted tweets with metrics
  const postedDraft = await prisma.draft.create({
    data: {
      hook: '⚡️ Controversial take:',
      body: 'Writing code is the EASY part.\n\nThe hard parts:\n→ Understanding the problem\n→ Designing the solution\n→ Making it maintainable\n→ Communicating with the team\n\nJunior devs think it\'s about code.\nSenior devs know it\'s about people.',
      format: 'single',
      status: 'posted',
      tweetId: 'tweet_123456',
      postedAt: new Date('2026-02-08T09:00:00Z'),
      createdAt: new Date('2026-02-07T14:00:00Z'),
    },
  });

  await prisma.tweetMetric.create({
    data: {
      draftId: postedDraft.id,
      tweetId: 'tweet_123456',
      impressions: 45230,
      engagements: 3840,
      likes: 2890,
      retweets: 456,
      replies: 234,
      reachScore: 78.5,
      postedAt: new Date('2026-02-08T09:00:00Z'),
    },
  });

  const postedDraft2 = await prisma.draft.create({
    data: {
      hook: '🎯 Build in public lessons:',
      body: 'Week 1: 5 followers\nWeek 4: 50 followers\nWeek 12: 500 followers\nWeek 24: 5,000 followers\n\nWhat changed?\n\nI stopped trying to go viral.\nI started helping one person at a time.\n\nGrowth is a side effect of value.',
      format: 'single',
      status: 'posted',
      tweetId: 'tweet_789012',
      postedAt: new Date('2026-02-10T14:30:00Z'),
      createdAt: new Date('2026-02-09T11:00:00Z'),
    },
  });

  await prisma.tweetMetric.create({
    data: {
      draftId: postedDraft2.id,
      tweetId: 'tweet_789012',
      impressions: 28900,
      engagements: 1920,
      likes: 1450,
      retweets: 234,
      replies: 156,
      reachScore: 65.3,
      postedAt: new Date('2026-02-10T14:30:00Z'),
    },
  });

  const postedDraft3 = await prisma.draft.create({
    data: {
      hook: '📊 Analyzed 100 viral tweets',
      body: 'Patterns I found:\n\n• 80% start with a hook (number, emoji, or bold claim)\n• 65% use line breaks for readability\n• 90% have a clear takeaway\n• 50% ask a question or prompt engagement\n\nViral tweets aren\'t luck.\nThey\'re engineered.',
      format: 'single',
      status: 'posted',
      tweetId: 'tweet_345678',
      postedAt: new Date('2026-02-12T16:45:00Z'),
      createdAt: new Date('2026-02-11T13:00:00Z'),
    },
  });

  await prisma.tweetMetric.create({
    data: {
      draftId: postedDraft3.id,
      tweetId: 'tweet_345678',
      impressions: 67500,
      engagements: 5680,
      likes: 4230,
      retweets: 789,
      replies: 445,
      reachScore: 89.2,
      postedAt: new Date('2026-02-12T16:45:00Z'),
    },
  });

  console.log(`✅ Created 3 posted tweets with metrics`);

  // Create sample weekly insight
  await prisma.insight.create({
    data: {
      weekStart: new Date('2026-02-08T00:00:00Z'),
      weekEnd: new Date('2026-02-14T23:59:59Z'),
      summary: 'Strong week! Your content about engineering practices and data-driven insights performed exceptionally well. Posts with numbers and clear hooks generated 2x more engagement than opinion pieces.',
      topPerformers: JSON.stringify(['tweet_345678', 'tweet_123456', 'tweet_789012']),
      recommendations: JSON.stringify([
        'Double down on data-driven content - your audience loves numbers and analysis',
        'Thread format is underutilized - try breaking down complex topics into threads',
        'Best posting time: 9-11am EST (your posts during this window got 40% more impressions)',
        'Controversial takes work - but back them with reasoning',
        'Consider a series on "How to analyze X" - combines your strengths',
      ]),
    },
  });

  console.log(`✅ Created weekly insight`);
  console.log('🎉 Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
