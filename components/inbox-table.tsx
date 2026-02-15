'use client';

import { useState } from 'react';
import { RedditItem } from '@prisma/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatRelativeTime, formatNumber } from '@/lib/utils';
import { MessageSquare, TrendingUp, ExternalLink, Sparkles, Save } from 'lucide-react';

interface InboxTableProps {
  items: RedditItem[];
}

export function InboxTable({ items }: InboxTableProps) {
  const [generating, setGenerating] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  const handleGenerateDraft = async (itemId: string) => {
    setGenerating(itemId);
    try {
      const response = await fetch('/api/drafts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ redditItemId: itemId }),
      });

      if (response.ok) {
        // Redirect to queue page to see the new draft
        window.location.href = '/queue';
      } else {
        alert('Failed to generate draft. Please try again.');
      }
    } catch (error) {
      console.error('Error generating draft:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setGenerating(null);
    }
  };

  const handleSaveToQueue = async (itemId: string) => {
    setSaving(itemId);
    try {
      const response = await fetch('/api/reddit/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ redditItemId: itemId }),
      });

      if (response.ok) {
        window.location.reload();
      } else {
        alert('Failed to save item. Please try again.');
      }
    } catch (error) {
      console.error('Error saving item:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setSaving(null);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-50';
    if (score >= 70) return 'text-blue-600 bg-blue-50';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">Score</TableHead>
            <TableHead>Post</TableHead>
            <TableHead className="w-[120px]">Subreddit</TableHead>
            <TableHead className="w-[100px]">Engagement</TableHead>
            <TableHead className="w-[100px]">Posted</TableHead>
            <TableHead className="w-[240px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                No Reddit items found. Run the sync script to fetch new content.
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-lg font-bold ${getScoreColor(
                      item.repurposeScore
                    )}`}
                  >
                    {Math.round(item.repurposeScore)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium hover:underline flex items-center gap-1"
                    >
                      {item.title}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    {item.selftext && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.selftext}
                      </p>
                    )}
                    {item.saved && (
                      <Badge variant="secondary" className="mt-1">
                        <Save className="h-3 w-3 mr-1" />
                        Saved
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">r/{item.subreddit}</Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <TrendingUp className="h-3 w-3" />
                      {formatNumber(item.score)}
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MessageSquare className="h-3 w-3" />
                      {formatNumber(item.numComments)}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatRelativeTime(item.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleGenerateDraft(item.id)}
                      disabled={generating === item.id}
                    >
                      <Sparkles className="h-4 w-4 mr-1" />
                      {generating === item.id ? 'Generating...' : 'Generate Draft'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSaveToQueue(item.id)}
                      disabled={saving === item.id || item.saved}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
