# Repurpose Engine

A Next.js web application that helps you discover high-quality Reddit content and transform it into engaging X (Twitter) posts using AI. Track performance metrics and get weekly insights to improve your content strategy.

## Features

- **Inbox**: Discover Reddit posts with high repurpose potential, scored by engagement and content quality
- **Queue**: Manage and edit AI-generated X post drafts with a modal editor
- **Tracker**: Monitor post performance with detailed metrics and reach scores
- **Insights**: Get AI-powered weekly analysis and content recommendations
- **Safety First**: All content is summarized and remixed, never copied verbatim
- **Manual Posting**: Copy drafts to clipboard for manual posting (no auto-posting)

## Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **UI**: Tailwind CSS + shadcn/ui
- **Database**: Prisma + SQLite
- **AI**: OpenAI API for content generation and insights
- **APIs**: Reddit API + X (Twitter) API

## Prerequisites

- Node.js 18+ and npm
- Reddit API credentials ([create app](https://www.reddit.com/prefs/apps))
- X (Twitter) API credentials ([developer portal](https://developer.twitter.com/en/portal/dashboard))
- OpenAI API key ([get key](https://platform.openai.com/api-keys))

## Setup Instructions

### 1. Clone and Install

```bash
cd "Repurpose Engine"
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
# Database
DATABASE_URL="file:./dev.db"

# Reddit API
REDDIT_CLIENT_ID="your_reddit_client_id"
REDDIT_CLIENT_SECRET="your_reddit_client_secret"
REDDIT_USER_AGENT="RepurposeEngine/1.0"

# X (Twitter) API
X_API_KEY="your_x_api_key"
X_API_SECRET="your_x_api_secret"
X_ACCESS_TOKEN="your_x_access_token"
X_ACCESS_SECRET="your_x_access_secret"
X_BEARER_TOKEN="your_x_bearer_token"

# OpenAI API
OPENAI_API_KEY="your_openai_api_key"
```

### 3. Initialize Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with sample data for testing
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

## Usage Guide

### Syncing Reddit Content

Run the Reddit sync script to fetch new posts:

```bash
npm run sync:reddit
```

This will:
- Fetch hot posts from configured subreddits
- Calculate repurpose scores based on engagement
- Store new posts and update existing ones
- Respect Reddit's rate limits (2-second delays)

**Customize subreddits**: Edit `scripts/sync-reddit.ts` and modify the `subreddits` array.

### Syncing X Metrics

After manually posting drafts to X, update their tweetId in the database and run:

```bash
npm run sync:x
```

This will:
- Fetch metrics for all posted tweets
- Calculate reach scores
- Update engagement data
- Respect X API rate limits (1-second delays)

### Workflow

1. **Discover**: Browse Reddit posts in the Inbox, sorted by repurpose score
2. **Generate**: Click "Generate Draft" to create an AI-powered X post
3. **Edit**: Review and refine drafts in the Queue using the modal editor
4. **Copy**: Use the copy button to copy the draft to clipboard
5. **Post**: Manually post to X (safe, no auto-posting)
6. **Track**: Add the tweet ID to your draft and run sync to fetch metrics
7. **Analyze**: Generate weekly insights for AI recommendations

## API Endpoints

- `POST /api/drafts/generate` - Generate draft from Reddit item
- `POST /api/drafts/update` - Update draft content
- `POST /api/drafts/delete` - Delete a draft
- `POST /api/reddit/save` - Save Reddit item to queue
- `POST /api/insights/generate` - Generate weekly insights

## Database Schema

### RedditItem
- Stores Reddit posts with metadata
- `repurposeScore` (0-100) based on engagement and content quality

### Draft
- X post drafts with hook, body, format, and status
- Links to source Reddit item
- Status: draft, queued, posted, archived

### TweetMetric
- Performance metrics for posted tweets
- `reachScore` calculated from impressions and engagement
- Tracks likes, retweets, replies, impressions

### Insight
- Weekly AI-generated analysis
- Top performers and recommendations

## Safety & Ethics

✅ **Safe Practices**:
- Uses official Reddit API (no scraping)
- Rate limiting to respect API guidelines
- No auto-posting to X (manual copy/paste only)
- AI summarizes and remixes content (no verbatim copying)
- Minimal personal data storage

⚠️ **Important Notes**:
- Always add value and perspective when repurposing
- Give credit to original sources when appropriate
- Follow platform guidelines and terms of service
- Use responsibly and ethically

## Project Structure

```
Repurpose Engine/
├── app/                  # Next.js app router pages
│   ├── inbox/           # Reddit items discovery
│   ├── queue/           # Draft management
│   ├── tracker/         # Performance metrics
│   ├── insights/        # AI recommendations
│   └── api/             # API routes
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   └── ...             # Feature components
├── lib/                # Utilities and database
├── prisma/             # Database schema and seed
├── scripts/            # Sync scripts
│   ├── sync-reddit.ts
│   └── sync-x.ts
└── public/             # Static assets
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed database with sample data
- `npm run sync:reddit` - Fetch Reddit posts
- `npm run sync:x` - Update X metrics

## Troubleshooting

### "Module not found" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Database issues
```bash
rm prisma/dev.db
npm run db:push
npm run db:seed
```

### API authentication errors
- Double-check credentials in `.env`
- Ensure Reddit app is set to "script" type
- Verify X API has read permissions
- Check OpenAI API key is active

## Customization

### Change Subreddits
Edit `scripts/sync-reddit.ts` and modify the `subreddits` array:

```typescript
const subreddits = [
  'technology',
  'programming',
  // Add your favorites here
];
```

### Adjust Scoring Algorithm
Edit `lib/utils.ts` functions:
- `calculateRepurposeScore()` - Reddit post scoring
- `calculateReachScore()` - X post performance scoring

### Modify Draft Format
Edit the OpenAI prompt in `app/api/drafts/generate/route.ts` to change generation style.

## License

MIT License - feel free to use this for your own projects!

## Contributing

This is a personal project, but suggestions and improvements are welcome via issues or pull requests.

---

**Note**: This tool is designed to help you create better content, not to spam or plagiarize. Always add your own perspective and value when repurposing content.
