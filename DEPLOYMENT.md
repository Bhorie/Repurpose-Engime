# Vercel Deployment Guide

## Option 1: Deploy via Vercel Dashboard (Easiest)

### Step 1: Push to GitHub

1. Create a new repository on [GitHub](https://github.com/new)
2. Name it `repurpose-engine` (or any name you like)
3. Don't initialize with README (we already have files)
4. Run these commands:

```bash
cd "/Users/wikiwoo/Downloads/Repurpose Engine"
git add .
git commit -m "Initial commit: Repurpose Engine"
git remote add origin https://github.com/YOUR_USERNAME/repurpose-engine.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"**
3. Import your `repurpose-engine` repository
4. Configure:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./`
   - **Build Command**: `prisma generate && next build` (auto-set)
   - **Install Command**: `npm install` (auto-set)

5. Add Environment Variables (click "Environment Variables"):

```
DATABASE_URL=file:./dev.db
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret
REDDIT_USER_AGENT=RepurposeEngine/1.0
X_API_KEY=your_x_api_key
X_API_SECRET=your_x_api_secret
X_ACCESS_TOKEN=your_x_access_token
X_ACCESS_SECRET=your_x_access_secret
X_BEARER_TOKEN=your_x_bearer_token
OPENAI_API_KEY=your_openai_api_key
```

6. Click **"Deploy"**

### Step 3: Initialize Database

After deployment, you need to set up the database:

1. Go to your project settings in Vercel
2. Go to the **Storage** tab
3. Create a new **Postgres** database (recommended) OR use SQLite
4. Update `DATABASE_URL` in environment variables
5. Redeploy the project

⚠️ **Important**: SQLite doesn't work well on Vercel serverless. For production, use:
- **Vercel Postgres** (recommended, free tier available)
- **PlanetScale** (MySQL)
- **Supabase** (PostgreSQL)

### For Vercel Postgres:

After creating Postgres storage:
1. Copy the `DATABASE_URL` from Vercel
2. Update environment variable
3. Redeploy
4. Your database will auto-migrate on build

---

## Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd "/Users/wikiwoo/Downloads/Repurpose Engine"
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name? repurpose-engine
# - Directory? ./
# - Override settings? No

# Add environment variables
vercel env add OPENAI_API_KEY
vercel env add REDDIT_CLIENT_ID
# ... add all other env vars

# Deploy to production
vercel --prod
```

---

## Database Options for Production

### Option A: Vercel Postgres (Recommended)

```bash
# In Vercel Dashboard:
# 1. Go to Storage tab
# 2. Create Postgres database
# 3. Copy DATABASE_URL
# 4. Update in Environment Variables
# 5. Update prisma/schema.prisma:

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

# Then redeploy
```

### Option B: PlanetScale (Free MySQL)

1. Sign up at [planetscale.com](https://planetscale.com)
2. Create database
3. Get connection string
4. Update schema:

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
  relationMode = "prisma"
}
```

### Option C: Supabase (Free PostgreSQL)

1. Sign up at [supabase.com](https://supabase.com)
2. Create project
3. Get connection string from Settings → Database
4. Use PostgreSQL schema (same as Vercel Postgres)

---

## After Deployment

Your app will be live at:
**https://repurpose-engine-XXXX.vercel.app**

### Initialize with Seed Data

You can't run seed scripts on Vercel directly. Instead:

1. Use the app to manually create some drafts
2. Or connect to your production database and seed it:

```bash
# Set production DATABASE_URL locally
DATABASE_URL="your_production_url" npm run db:seed
```

### Running Sync Scripts

Vercel is serverless, so cron jobs need special setup:

**Option 1**: Use Vercel Cron Jobs
- Add `vercel.json` with cron configuration
- Create API routes for syncing

**Option 2**: Use external service
- [cron-job.org](https://cron-job.org) (free)
- Set up to call your sync API endpoints

**Option 3**: Run locally
- Keep running scripts on your computer
- They'll update the production database

---

## Quick Deploy Checklist

- [ ] Create GitHub repository
- [ ] Push code to GitHub
- [ ] Sign in to Vercel with GitHub
- [ ] Import repository
- [ ] Add all environment variables
- [ ] Choose database solution (Vercel Postgres recommended)
- [ ] Deploy
- [ ] Update DATABASE_URL if using external DB
- [ ] Verify app loads
- [ ] Test features

---

## Troubleshooting

**Build fails with Prisma error:**
```bash
# Make sure postinstall script runs
# Check package.json has: "postinstall": "prisma generate"
```

**Database connection error:**
```bash
# Verify DATABASE_URL is set correctly
# For Postgres, it should start with: postgresql://
```

**Environment variables not working:**
```bash
# Make sure to redeploy after adding env vars
# Click "Redeploy" in Vercel dashboard
```

Need help? Check the [Vercel docs](https://vercel.com/docs) or let me know!
