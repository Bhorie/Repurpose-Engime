'use client';

import { useState } from 'react';
import { Draft, RedditItem } from '@prisma/client';
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
import { formatDate } from '@/lib/utils';
import { Edit, Copy, Trash2, CheckCircle } from 'lucide-react';
import { DraftEditorModal } from '@/components/draft-editor-modal';

interface QueueTableProps {
  drafts: (Draft & { redditItem: RedditItem | null })[];
}

export function QueueTable({ drafts }: QueueTableProps) {
  const [editingDraft, setEditingDraft] = useState<Draft | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [copying, setCopying] = useState<string | null>(null);

  const handleCopyToClipboard = async (draft: Draft) => {
    setCopying(draft.id);
    const fullText = `${draft.hook}\n\n${draft.body}`;
    
    try {
      await navigator.clipboard.writeText(fullText);
      setTimeout(() => setCopying(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      setCopying(null);
    }
  };

  const handleDelete = async (draftId: string) => {
    if (!confirm('Are you sure you want to delete this draft?')) return;

    setDeleting(draftId);
    try {
      const response = await fetch('/api/drafts/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draftId }),
      });

      if (response.ok) {
        window.location.reload();
      } else {
        alert('Failed to delete draft. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting draft:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'queued':
        return 'bg-blue-100 text-blue-800';
      case 'posted':
        return 'bg-green-100 text-green-800';
      case 'archived':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Draft</TableHead>
              <TableHead className="w-[120px]">Format</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[150px]">Created</TableHead>
              <TableHead className="w-[200px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drafts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No drafts yet. Generate drafts from the Inbox page.
                </TableCell>
              </TableRow>
            ) : (
              drafts.map((draft) => (
                <TableRow key={draft.id}>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="font-medium">{draft.hook}</div>
                      <p className="text-sm text-muted-foreground line-clamp-2 whitespace-pre-wrap">
                        {draft.body}
                      </p>
                      {draft.redditItem && (
                        <div className="text-xs text-muted-foreground">
                          From: r/{draft.redditItem.subreddit}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{draft.format}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(draft.status)}>
                      {draft.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(draft.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingDraft(draft)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopyToClipboard(draft)}
                      >
                        {copying === draft.id ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(draft.id)}
                        disabled={deleting === draft.id}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {editingDraft && (
        <DraftEditorModal
          draft={editingDraft}
          onClose={() => setEditingDraft(null)}
        />
      )}
    </>
  );
}
