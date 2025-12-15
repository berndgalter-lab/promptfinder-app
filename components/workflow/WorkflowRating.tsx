'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WorkflowRatingProps {
  workflowId: string | number;
  userId: string | null;
}

export function WorkflowRating({ workflowId, userId }: WorkflowRatingProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [ratingCount, setRatingCount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasRated, setHasRated] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  // Lade initiale Rating-Daten
  useEffect(() => {
    async function fetchRating() {
      try {
        const res = await fetch(`/api/workflows/${workflowId}/rate`);
        if (res.ok) {
          const data = await res.json();
          setAverageRating(data.average);
          setRatingCount(data.count);
          if (data.userRating) {
            setRating(data.userRating);
            setHasRated(true);
          }
        }
      } catch (error) {
        console.error('Failed to fetch rating:', error);
      }
    }
    fetchRating();
  }, [workflowId]);

  const handleRate = async (value: number) => {
    if (!userId) {
      return;
    }

    setIsSubmitting(true);
    setRating(value);

    try {
      const res = await fetch(`/api/workflows/${workflowId}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: value }),
      });

      if (res.ok) {
        setHasRated(true);
        setShowThankYou(true);
        setTimeout(() => setShowThankYou(false), 2000);

        // Refresh stats
        const statsRes = await fetch(`/api/workflows/${workflowId}/rate`);
        if (statsRes.ok) {
          const data = await statsRes.json();
          setAverageRating(data.average);
          setRatingCount(data.count);
        }
      }
    } catch (error) {
      console.error('Failed to submit rating:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayRating = hoverRating ?? rating ?? 0;

  return (
    <div className="flex flex-col items-center gap-2 py-4">
      {/* Rating Prompt */}
      {!hasRated && userId && (
        <p className="text-sm text-zinc-400 mb-1">
          How helpful was this workflow?
        </p>
      )}

      {/* Stars */}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRate(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(null)}
            disabled={isSubmitting || !userId}
            className={cn(
              'p-1 transition-all',
              userId ? 'cursor-pointer hover:scale-110' : 'cursor-default',
              isSubmitting && 'opacity-50'
            )}
            aria-label={`Rate ${star} stars`}
          >
            <Star
              className={cn(
                'h-6 w-6 transition-colors',
                star <= displayRating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-transparent text-zinc-600 hover:text-zinc-500'
              )}
            />
          </button>
        ))}
      </div>

      {/* Thank you message */}
      {showThankYou && (
        <p className="text-sm text-green-400 animate-pulse">
          Thanks for your rating!
        </p>
      )}

      {/* Stats (nur anzeigen wenn genug Ratings) */}
      {ratingCount >= 5 && (
        <p className="text-xs text-zinc-400">
          {averageRating.toFixed(1)} average · {ratingCount} ratings
        </p>
      )}

      {/* Login hint */}
      {!userId && (
        <p className="text-xs text-zinc-400">
          Sign in to rate this workflow
        </p>
      )}
    </div>
  );
}

