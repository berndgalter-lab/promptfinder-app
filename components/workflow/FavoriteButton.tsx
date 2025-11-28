'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { SignInModal } from '@/components/auth/SignInModal';

interface FavoriteButtonProps {
  workflowId: string;
  initialIsFavorited: boolean;
  userId: string | null;
  workflowTitle?: string;
}

export function FavoriteButton({
  workflowId,
  initialIsFavorited,
  userId,
  workflowTitle,
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [isLoading, setIsLoading] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();

  const toggleFavorite = async () => {
    // Check if user is logged in
    if (!userId) {
      setShowSignInModal(true);
      return;
    }

    // Optimistic update
    const previousState = isFavorited;
    setIsFavorited(!isFavorited);
    setIsLoading(true);

    try {
      if (previousState) {
        // Remove from favorites
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', userId)
          .eq('workflow_id', workflowId);

        if (error) throw error;

        toast({
          title: 'Removed from favorites',
          description: 'Workflow removed from your favorites',
        });
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('user_favorites')
          .insert({
            user_id: userId,
            workflow_id: workflowId,
          });

        if (error) throw error;

        toast({
          title: 'Added to favorites',
          description: 'Workflow added to your favorites',
        });
      }
    } catch (error) {
      // Revert optimistic update on error
      setIsFavorited(previousState);
      
      console.error('Error toggling favorite:', error);
      toast({
        title: 'Error',
        description: 'Failed to update favorites. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={toggleFavorite}
        disabled={isLoading}
        className="group relative flex h-10 w-10 items-center justify-center rounded-md border border-zinc-700 bg-zinc-900 transition-all hover:scale-110 hover:border-zinc-500 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Star
          className={`h-5 w-5 transition-colors ${
            isFavorited
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-zinc-400 group-hover:text-zinc-300'
          }`}
        />
      </button>

      <SignInModal
        open={showSignInModal}
        onOpenChange={setShowSignInModal}
        workflowId={workflowId}
        workflowTitle={workflowTitle}
        action="favorite"
      />
    </>
  );
}

