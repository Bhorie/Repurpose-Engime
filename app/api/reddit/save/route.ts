import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { redditItemId } = await request.json();

    if (!redditItemId) {
      return NextResponse.json({ error: 'Missing redditItemId' }, { status: 400 });
    }

    const redditItem = await prisma.redditItem.update({
      where: { id: redditItemId },
      data: { saved: true },
    });

    return NextResponse.json({ success: true, redditItem });
  } catch (error) {
    console.error('Error saving Reddit item:', error);
    return NextResponse.json(
      { error: 'Failed to save Reddit item' },
      { status: 500 }
    );
  }
}
