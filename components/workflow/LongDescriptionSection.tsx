'use client';

import { useState } from 'react';
import { ChevronDown, BookOpen } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

interface LongDescriptionSectionProps {
  longDescription: string;
}

export function LongDescriptionSection({ longDescription }: LongDescriptionSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Split by double newlines to create paragraphs
  const paragraphs = longDescription.split('\n\n').filter(p => p.trim());

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-8">
      <CollapsibleTrigger asChild>
        <button
          className={cn(
            "w-full flex items-center justify-between p-4 rounded-lg transition-all",
            "bg-zinc-900/30 border border-zinc-800/50 hover:bg-zinc-900/50 hover:border-zinc-700/50",
            isOpen && "rounded-b-none border-b-0"
          )}
        >
          <div className="flex items-center gap-2 text-left">
            <BookOpen className="h-4 w-4 text-zinc-400" />
            <span className="font-medium text-zinc-400">📖 Learn more</span>
          </div>
          <ChevronDown 
            className={cn(
              "h-5 w-5 text-zinc-500 transition-transform duration-200",
              isOpen && "rotate-180"
            )} 
          />
        </button>
      </CollapsibleTrigger>
      
      <CollapsibleContent>
        <div className={cn(
          "p-5 rounded-b-lg border border-t-0 border-zinc-800/50",
          "bg-zinc-900/20"
        )}>
          <div className="space-y-4">
            {paragraphs.map((paragraph, index) => (
              <p 
                key={index} 
                className="text-zinc-400 leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

