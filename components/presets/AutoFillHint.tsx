'use client';

import { Sparkles } from 'lucide-react';
import type { AutoFilledField } from '@/lib/types/presets';

interface AutoFillHintProps {
  fieldName: string;
  autoFilledFields: Map<string, AutoFilledField>;
}

export function AutoFillHint({ fieldName, autoFilledFields }: AutoFillHintProps) {
  const autoFill = autoFilledFields.get(fieldName);
  
  if (!autoFill) return null;
  
  return (
    <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
      <Sparkles className="h-3 w-3 text-blue-400/70" />
      <span>From {autoFill.sourceName}</span>
    </p>
  );
}

