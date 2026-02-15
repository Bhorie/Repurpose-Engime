import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { draftId, hook, body, format, status } = await request.json();

    if (!draftId) {
      return NextResponse.json({ error: 'Missing draftId' }, { status: 400 });
    }

    const draft = await prisma.draft.update({
      where: { id: draftId },
      data: {
        hook,
        body,
        format,
        status,
      },
    });

    return NextResponse.json({ success: true, draft });
  } catch (error) {
    console.error('Error updating draft:', error);
    return NextResponse.json(
      { error: 'Failed to update draft' },
      { status: 500 }
    );
  }
}
