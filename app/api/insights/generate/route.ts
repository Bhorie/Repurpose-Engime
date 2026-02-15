import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST() {
  try {
    // Get metrics from the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const metrics = await prisma.tweetMetric.findMany({
      where: {
        postedAt: {
          gte: sevenDaysAgo,
        },
      },
      include: {
        draft: true,
      },
      orderBy: {
        reachScore: 'desc',
      },
    });

    if (metrics.length === 0) {
      return NextResponse.json(
        { error: 'Not enough data to generate insights' },
        { status: 400 }
      );
    }

    // Prepare data for analysis
    const topPerformers = metrics.slice(0, 5);
    const avgReachScore = metrics.reduce((sum, m) => sum + m.reachScore, 0) / metrics.length;
    const totalImpressions = metrics.reduce((sum, m) => sum + m.impressions, 0);
    const totalEngagements = metrics.reduce((sum, m) => sum + m.engagements, 0);

    const analysisData = {
      totalPosts: metrics.length,
      avgReachScore: avgReachScore.toFixed(1),
      totalImpressions,
      totalEngagements,
      topPerformers: topPerformers.map(m => ({
        hook: m.draft.hook,
        body: m.draft.body.substring(0, 200),
        format: m.draft.format,
        reachScore: m.reachScore,
        impressions: m.impressions,
        engagements: m.engagements,
      })),
    };

    // Generate insights using OpenAI
    const prompt = `You are a social media analytics expert. Analyze this X (Twitter) performance data and provide actionable insights.

Data from the past 7 days:
${JSON.stringify(analysisData, null, 2)}

Provide a response in JSON format with:
{
  "summary": "2-3 sentence overview of the week's performance, highlighting key trends and patterns",
  "recommendations": [
    "5 specific, actionable recommendations for improving content performance",
    "Focus on content types, formats, topics, and posting strategies",
    "Base recommendations on what worked well and what didn't"
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');

    // Save insight
    const insight = await prisma.insight.create({
      data: {
        weekStart: sevenDaysAgo,
        weekEnd: new Date(),
        summary: result.summary,
        topPerformers: JSON.stringify(topPerformers.map(m => m.tweetId)),
        recommendations: JSON.stringify(result.recommendations),
      },
    });

    return NextResponse.json({ success: true, insight });
  } catch (error) {
    console.error('Error generating insights:', error);
    return NextResponse.json(
      { error: 'Failed to generate insights' },
      { status: 500 }
    );
  }
}
