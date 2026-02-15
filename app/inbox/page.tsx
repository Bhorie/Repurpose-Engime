import { prisma } from '@/lib/db';
import { InboxTable } from '@/components/inbox-table';

export const dynamic = 'force-dynamic';

export default async function InboxPage() {
  const redditItems = await prisma.redditItem.findMany({
    orderBy: {
      repurposeScore: 'desc',
    },
    take: 50,
  });

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Inbox</h1>
        <p className="text-muted-foreground">
          Discover high-quality Reddit content to repurpose into X posts
        </p>
      </div>

      <InboxTable items={redditItems} />
    </div>
  );
}
