'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

interface Workflow {
  id: string;
  title: string;
  slug: string;
  tier: 'essential' | 'advanced';
}

interface HistoryItemProps {
  historyId: string;
  workflow: Workflow;
  inputValues: Record<string, any>;
  usedAt: string;
  userId: string;
}

export function HistoryItem({
  historyId,
  workflow,
  inputValues,
  usedAt,
  userId,
}: HistoryItemProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showInputs, setShowInputs] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClient();

  const relativeTime = formatDistanceToNow(new Date(usedAt), { addSuffix: true });

  // Format input values for display
  const formatInputValues = () => {
    if (!inputValues || Object.keys(inputValues).length === 0) {
      return 'No inputs saved';
    }

    const entries: string[] = [];
    Object.entries(inputValues).forEach(([stepKey, stepValues]) => {
      if (typeof stepValues === 'object' && stepValues !== null) {
        Object.entries(stepValues).forEach(([fieldName, fieldValue]) => {
          if (fieldValue) {
            // Make field name more readable
            const readableName = fieldName
              .replace(/_/g, ' ')
              .replace(/\b\w/g, (c) => c.toUpperCase());
            entries.push(`${readableName}: ${fieldValue}`);
          }
        });
      }
    });

    return entries.length > 0 ? entries.join(', ') : 'No inputs saved';
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const { error } = await supabase
        .from('user_usage')
        .delete()
        .eq('id', historyId)
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: 'Deleted from history',
        description: 'The workflow has been removed from your history.',
      });

      setShowDeleteDialog(false);
      router.refresh();
    } catch (error) {
      console.error('Error deleting history:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete from history. Please try again.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const inputSummary = formatInputValues();
  const hasInputs = inputValues && Object.keys(inputValues).length > 0;

  return (
    <>
      <Card className="border-zinc-800 bg-zinc-900">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2">
                <CardTitle className="text-xl">{workflow.title}</CardTitle>
                <Badge variant={workflow.tier === 'essential' ? 'success' : 'default'}>
                  {workflow.tier === 'essential' ? 'Essential' : 'Advanced'}
                </Badge>
              </div>
              <p className="text-sm text-zinc-500">Used {relativeTime}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Input Values */}
          {hasInputs && (
            <div>
              <button
                onClick={() => setShowInputs(!showInputs)}
                className="mb-2 text-sm font-medium text-zinc-400 hover:text-zinc-300"
              >
                {showInputs ? '▼' : '▶'} Saved inputs
              </button>
              {showInputs && (
                <div className="rounded-md bg-zinc-950 p-3 text-sm text-zinc-400">
                  {inputSummary}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={() => {
                // Navigate with input values as state
                const params = new URLSearchParams();
                params.set('prefill', JSON.stringify(inputValues));
                router.push(`/workflows/${workflow.slug}?${params.toString()}`);
              }}
              className="flex-1 !bg-blue-600 hover:!bg-blue-700 !text-white"
              size="sm"
            >
              Use Again
            </Button>
            <Button
              onClick={() => setShowDeleteDialog(true)}
              variant="ghost"
              size="sm"
              className="!text-red-400 hover:!bg-red-950"
            >
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle>Delete from history?</DialogTitle>
            <DialogDescription className="text-zinc-400">
              This will permanently remove this workflow from your history. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
              className="!text-white hover:!bg-zinc-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              className="!bg-red-600 hover:!bg-red-700 !text-white"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

