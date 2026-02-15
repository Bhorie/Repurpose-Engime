import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { redditItemId } = await request.json();

    if (!redditItemId) {
      return NextResponse.json({ error: 'Missing redditItemId' }, { status: 400 });
    }

    // Fetch Reddit item
    const redditItem = await prisma.redditItem.findUnique({
      where: { id: redditItemId },
    });

    if (!redditItem) {
      return NextResponse.json({ error: 'Reddit item not found' }, { status: 404 });
    }

    // Generate draft using OpenAI
    const prompt = `You are a social media expert who creates engaging X (Twitter) posts.

Take this Reddit post and transform it into an engaging X post. DO NOT copy it verbatim - you must summarize, reframe, and add your own perspective.

Reddit Post:
Title: ${redditItem.title}
${redditItem.selftext ? `Content: ${redditItem.selftext.slice(0, 1000)}` : ''}
Subreddit: r/${redditItem.subreddit}

Requirements:
1. Create a compelling hook (first line) that grabs attention
2. Summarize the key insight or lesson in your own words
3. Add value with your perspective or actionable takeaways
4. Use line breaks for readability
5. Keep it concise (under 280 characters for single post, or break into thread format)
6. Use emojis sparingly and strategically

Format your response as JSON with these fields:
{
  "hook": "attention-grabbing first line",
  "body": "main content with line breaks",
  "format": "single" or "thread"
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');

    // Create draft
    const draft = await prisma.draft.create({
      data: {
        redditItemId: redditItem.id,
        hook: result.hook,
        body: result.body,
        format: result.format,
        status: 'draft',
      },
    });

    // Mark Reddit item as processed
    await prisma.redditItem.update({
      where: { id: redditItem.id },
      data: { processed: true },
    });

    return NextResponse.json({ success: true, draft });
  } catch (error) {
    console.error('Error generating draft:', error);
    return NextResponse.json(
      { error: 'Failed to generate draft' },
      { status: 500 }
    );
  }
}
