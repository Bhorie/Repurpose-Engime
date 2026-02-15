'use client';

import { useState } from 'react';
import { Draft } from '@prisma/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface DraftEditorModalProps {
  draft: Draft;
  onClose: () => void;
}

export function DraftEditorModal({ draft, onClose }: DraftEditorModalProps) {
  const [hook, setHook] = useState(draft.hook);
  const [body, setBody] = useState(draft.body);
  const [format, setFormat] = useState(draft.format);
  const [status, setStatus] = useState(draft.status);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/drafts/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          draftId: draft.id,
          hook,
          body,
          format,
          status,
        }),
      });

      if (response.ok) {
        window.location.reload();
      } else {
        alert('Failed to update draft. Please try again.');
      }
    } catch (error) {
      console.error('Error updating draft:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const charCount = hook.length + body.length + 2; // +2 for line breaks

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Draft</DialogTitle>
          <DialogDescription>
            Make changes to your draft. The content will be summarized and remixed, not copied verbatim.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="hook">Hook</Label>
            <Textarea
              id="hook"
              placeholder="Attention-grabbing opening..."
              value={hook}
              onChange={(e) => setHook(e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">Body</Label>
            <Textarea
              id="body"
              placeholder="Main content..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={10}
            />
            <p className="text-xs text-muted-foreground">
              Character count: {charCount} {charCount > 280 && '(thread format recommended)'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="format">Format</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger id="format">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single Post</SelectItem>
                  <SelectItem value="thread">Thread</SelectItem>
                  <SelectItem value="question">Question</SelectItem>
                  <SelectItem value="story">Story</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="queued">Queued</SelectItem>
                  <SelectItem value="posted">Posted</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
