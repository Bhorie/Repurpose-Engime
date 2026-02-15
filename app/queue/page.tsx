import { prisma } from '@/lib/db';
import { QueueTable } from '@/components/queue-table';

export const dynamic = 'force-dynamic';

export default async function QueuePage() {
  const drafts = await prisma.draft.findMany({
    include: {
      redditItem: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Queue</h1>
        <p className="text-muted-foreground">
          Manage and edit your X post drafts
        </p>
      </div>

      <QueueTable drafts={drafts} />
    </div>
  );
}
