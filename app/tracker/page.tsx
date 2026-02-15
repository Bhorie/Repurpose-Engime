import { prisma } from '@/lib/db';
import { TrackerTable } from '@/components/tracker-table';

export const dynamic = 'force-dynamic';

export default async function TrackerPage({
  searchParams,
}: {
  searchParams: { days?: string };
}) {
  const days = parseInt(searchParams.days || '7');
  const dateFrom = new Date();
  dateFrom.setDate(dateFrom.getDate() - days);

  const metrics = await prisma.tweetMetric.findMany({
    where: {
      postedAt: {
        gte: dateFrom,
      },
    },
    include: {
      draft: true,
    },
    orderBy: {
      reachScore: 'desc',
    },
  });

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Tracker</h1>
        <p className="text-muted-foreground">
          Monitor your X post performance and reach metrics
        </p>
      </div>

      <TrackerTable metrics={metrics} currentDays={days} />
    </div>
  );
}
