'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

interface FavoriteToggleProps {
  workflowId: string;
  initialIsFavorited: boolean;
  userId: string;
}

export function FavoriteToggle({
  workflowId,
  initialIsFavorited,
  userId,
}: FavoriteToggleProps) {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClient();

  const toggleFavorite = async () => {
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
        
        // Refresh the page to update the list
        router.refresh();
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
    <button
      onClick={toggleFavorite}
      disabled={isLoading}
      className="group relative flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-all hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50"
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
  );
}

