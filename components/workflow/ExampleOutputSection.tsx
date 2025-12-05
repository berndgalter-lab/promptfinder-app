'use client';

import { useState } from 'react';
import { ChevronDown, FileText } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

interface ExampleOutputSectionProps {
  exampleOutput: string;
}

export function ExampleOutputSection({ exampleOutput }: ExampleOutputSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-6">
      <CollapsibleTrigger asChild>
        <button
          className={cn(
            "w-full flex items-center justify-between p-4 rounded-lg transition-all",
            "bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-900 hover:border-zinc-700",
            isOpen && "rounded-b-none border-b-0"
          )}
        >
          <div className="flex items-center gap-2 text-left">
            <FileText className="h-4 w-4 text-blue-400" />
            <span className="font-medium text-zinc-200">📋 Beispiel-Ergebnis ansehen</span>
          </div>
          <ChevronDown 
            className={cn(
              "h-5 w-5 text-zinc-400 transition-transform duration-200",
              isOpen && "rotate-180"
            )} 
          />
        </button>
      </CollapsibleTrigger>
      
      <CollapsibleContent>
        <div className={cn(
          "p-4 rounded-b-lg border border-t-0 border-zinc-800",
          "bg-zinc-950/80"
        )}>
          <pre className={cn(
            "text-sm text-zinc-300 whitespace-pre-wrap font-mono",
            "leading-relaxed overflow-x-auto"
          )}>
            {exampleOutput}
          </pre>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

