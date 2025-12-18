'use client';

import { ArrowRight, Circle, CheckCircle2, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface SuggestedNextActionsProps {
  actions: string[];
  isVisible: boolean; // Only show when SOP is complete
}

export function SuggestedNextActions({ actions, isVisible }: SuggestedNextActionsProps) {
  const [completedActions, setCompletedActions] = useState<Record<number, boolean>>({});

  if (!isVisible || !actions?.length) return null;

  const toggleAction = (index: number) => {
    setCompletedActions(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const completedCount = Object.values(completedActions).filter(Boolean).length;

  return (
    <div className="rounded-xl border border-green-800/50 bg-gradient-to-b from-green-900/20 to-zinc-950 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-green-600/20 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-green-400" />
        </div>
        <div>
          <h3 className="font-semibold text-lg text-white">What's Next?</h3>
          <p className="text-sm text-green-400">
            {completedCount > 0 
              ? `${completedCount} of ${actions.length} done`
              : 'Recommended follow-up actions'}
          </p>
        </div>
      </div>

      {/* Actions List */}
      <div className="space-y-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => toggleAction(index)}
            className="flex items-start gap-3 w-full text-left group p-3 rounded-lg hover:bg-zinc-800/50 transition-colors"
          >
            <div className="mt-0.5 flex-shrink-0">
              {completedActions[index] ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <Circle className="w-5 h-5 text-zinc-600 group-hover:text-green-400 transition-colors" />
              )}
            </div>
            <span
              className={cn(
                "text-sm",
                completedActions[index] 
                  ? "line-through text-zinc-500" 
                  : "text-zinc-300 group-hover:text-white"
              )}
            >
              {action}
            </span>
          </button>
        ))}
      </div>

      {/* Completion message */}
      {completedCount === actions.length && (
        <div className="mt-4 p-3 rounded-lg bg-green-600/10 border border-green-600/30 text-center">
          <p className="text-sm text-green-400">
            🎉 Amazing! You've completed all follow-up actions!
          </p>
        </div>
      )}
    </div>
  );
}

