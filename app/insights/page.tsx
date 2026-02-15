import { prisma } from '@/lib/db';
import { InsightsView } from '@/components/insights-view';

export const dynamic = 'force-dynamic';

export default async function InsightsPage() {
  // Get the latest insight
  const latestInsight = await prisma.insight.findFirst({
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Get top performing tweets from the last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentMetrics = await prisma.tweetMetric.findMany({
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
    take: 5,
  });

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Insights</h1>
        <p className="text-muted-foreground">
          AI-powered analysis and recommendations for better content
        </p>
      </div>

      <InsightsView insight={latestInsight} topMetrics={recentMetrics} />
    </div>
  );
}
