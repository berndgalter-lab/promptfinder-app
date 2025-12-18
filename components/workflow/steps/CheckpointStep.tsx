'use client';

import { useState, useEffect, useCallback } from 'react';
import { Check, Circle, Lock, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CheckpointStep as CheckpointStepType } from '@/lib/types/workflow';

interface CheckpointStepProps {
  step: CheckpointStepType;
  onComplete: () => void;
  isCompleted: boolean;
  isSOP?: boolean;
}

export function CheckpointStepComponent({
  step,
  onComplete,
  isCompleted,
  isSOP = false,
}: CheckpointStepProps) {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const items = step.items || [];
  const blocking = step.blocking !== false; // default true

  // Calculate if all required items are checked
  const allRequiredChecked = items
    .filter(item => item.required)
    .every((item, index) => {
      const originalIndex = items.findIndex(i => i === item);
      return checkedItems[originalIndex];
    });

  const checkedCount = Object.values(checkedItems).filter(Boolean).length;

  // Memoize callback to prevent infinite re-renders
  const handleComplete = useCallback(() => {
    if (allRequiredChecked && !isCompleted) {
      onComplete();
    }
  }, [allRequiredChecked, isCompleted, onComplete]);

  // Trigger completion when all required items are checked
  useEffect(() => {
    handleComplete();
  }, [handleComplete]);

  const toggleItem = (index: number) => {
    setCheckedItems(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="space-y-6">
      {/* SOP-specific: Step Title with duration */}
      {isSOP && step.title && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white">{step.title}</h2>
          {step.description && (
            <p className="text-zinc-400 mt-1">{step.description}</p>
          )}
        </div>
      )}

      {/* Checkpoint Card */}
      <div className={cn(
        "rounded-lg border p-6",
        isCompleted 
          ? "border-green-600/50 bg-green-900/10" 
          : "border-amber-600/50 bg-amber-900/10"
      )}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            isCompleted 
              ? "bg-green-600/20 text-green-400" 
              : "bg-amber-600/20 text-amber-400"
          )}>
            {isCompleted ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <Lock className="w-5 h-5" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-white">
              {isCompleted ? 'Checkpoint Complete' : 'Checkpoint'}
            </h3>
            <p className="text-sm text-zinc-400">
              {checkedCount} of {items.length} items checked
            </p>
          </div>
        </div>

        {/* Checklist Items */}
        <div className="space-y-3 ml-2">
          {items.map((item, index) => (
            <label
              key={index}
              className="flex items-start gap-3 cursor-pointer group"
            >
              <button
                type="button"
                onClick={() => toggleItem(index)}
                className={cn(
                  "mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0",
                  checkedItems[index]
                    ? "bg-green-600 border-green-600 text-white"
                    : "border-zinc-600 group-hover:border-zinc-400"
                )}
              >
                {checkedItems[index] && <Check className="w-3 h-3" />}
              </button>
              <span className={cn(
                "text-sm",
                checkedItems[index] 
                  ? "line-through text-zinc-500" 
                  : "text-zinc-300"
              )}>
                {item.label}
                {item.required && (
                  <span className="text-red-400 ml-1">*</span>
                )}
              </span>
            </label>
          ))}
        </div>

        {/* Blocking hint */}
        {blocking && !allRequiredChecked && (
          <p className="text-xs text-amber-400 mt-4 ml-8">
            ⚠️ Complete all required items (*) to continue
          </p>
        )}

        {/* Completed message */}
        {isCompleted && (
          <p className="text-xs text-green-400 mt-4 ml-8">
            ✓ All required items completed. You can proceed!
          </p>
        )}
      </div>
    </div>
  );
}

