# Quick Setup Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
cd "Repurpose Engine"
npm install
```

### Step 2: Set Up Environment Variables
Open the `.env` file and add your API credentials:

**Reddit API** (Get from https://www.reddit.com/prefs/apps):
- Create a "script" type app
- Copy Client ID and Secret

**OpenAI API** (Get from https://platform.openai.com/api-keys):
- Create a new API key

**X API** (Optional for now - Get from https://developer.twitter.com/en/portal/dashboard):
- You can test without this initially using seed data

### Step 3: Initialize Database
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

This creates a SQLite database with sample data so you can see the UI immediately.

### Step 4: Start the App
```bash
npm run dev
```

Visit **http://localhost:3000** and you'll see:
- **Inbox**: 5 sample Reddit items with repurpose scores
- **Queue**: 3 draft posts ready to edit
- **Tracker**: 3 posted tweets with performance metrics
- **Insights**: Sample weekly analysis (click "Generate New Insights" to test AI)

### Step 5: Test Features

#### Test Draft Generation (Requires OpenAI API Key):
1. Go to Inbox
2. Click "Generate Draft" on any Reddit item
3. View the AI-generated draft in Queue
4. Click edit to modify in the modal
5. Copy to clipboard and paste anywhere

#### Test Reddit Sync (Requires Reddit API):
```bash
npm run sync:reddit
```
This fetches real Reddit posts from configured subreddits.

#### Test Insights (Requires OpenAI API Key):
1. Go to Insights page
2. Click "Generate New Insights"
3. See AI analysis of your post performance

## 📁 What's Included

✅ **Complete Next.js App**
- 4 pages: Inbox, Queue, Tracker, Insights
- Modern UI with Tailwind + shadcn/ui
- Improved sidebar with descriptions

✅ **Database Schema**
- RedditItem: Stores Reddit posts with repurpose scores
- Draft: X post drafts with editing capabilities
- TweetMetric: Performance tracking
- Insight: Weekly AI analysis

✅ **API Routes**
- `/api/drafts/generate` - AI draft generation
- `/api/drafts/update` - Edit drafts
- `/api/drafts/delete` - Remove drafts
- `/api/reddit/save` - Save items
- `/api/insights/generate` - Generate insights

✅ **Sync Scripts**
- `sync-reddit.ts` - Fetch Reddit content
- `sync-x.ts` - Update tweet metrics

✅ **Seed Data**
- 5 Reddit items with various scores
- 3 draft posts in different statuses
- 3 posted tweets with metrics
- 1 weekly insight

## 🎨 UI Improvements

The sidebar has been enhanced with:
- Larger, clearer navigation items
- Icons for each section
- Descriptive subtitles
- Active state highlighting
- "Safe & Ethical" footer reminder
- Better visual hierarchy

## 🔧 Customization

### Change Subreddits
Edit `scripts/sync-reddit.ts`:
```typescript
const subreddits = [
  'technology',
  'programming',
  // Add your favorites
];
```

### Adjust AI Prompts
Edit `app/api/drafts/generate/route.ts` to change how drafts are generated.

### Modify Scoring
Edit `lib/utils.ts`:
- `calculateRepurposeScore()` - Reddit scoring
- `calculateReachScore()` - X performance scoring

## ⚠️ Important Notes

1. **OpenAI API Key Required** for:
   - Draft generation
   - Weekly insights

2. **Reddit API Required** for:
   - Syncing real Reddit content
   - Seed data works without it

3. **X API Optional** for:
   - Syncing tweet metrics
   - Not needed for testing with seed data

4. **Manual Posting**: This app does NOT auto-post to X. You copy drafts and post manually for safety.

## 🐛 Troubleshooting

**"Module not found" errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Database errors:**
```bash
rm prisma/dev.db
npm run db:push
npm run db:seed
```

**Can't see seed data:**
Make sure you ran `npm run db:seed` after `npm run db:push`

## 📚 Next Steps

1. Add your API keys to `.env`
2. Run `npm run sync:reddit` to fetch real content
3. Generate drafts from Reddit items
4. Edit and refine in Queue
5. Copy and manually post to X
6. Generate weekly insights

Enjoy building your content engine! 🚀
