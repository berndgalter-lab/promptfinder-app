'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExampleOutputSectionProps {
  exampleOutput: string;
}

const MAX_HEIGHT = 300; // px

export function ExampleOutputSection({ exampleOutput }: ExampleOutputSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsExpansion, setNeedsExpansion] = useState(false);

  // Check if content exceeds max height
  const handleContentRef = (el: HTMLPreElement | null) => {
    if (el) {
      setNeedsExpansion(el.scrollHeight > MAX_HEIGHT);
    }
  };

  return (
    <div className="mb-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <FileText className="h-4 w-4 text-blue-400" />
        <span className="font-medium text-zinc-200">📋 Example Result</span>
      </div>
      
      {/* Content Box */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-950/80 overflow-hidden">
        <div 
          className={cn(
            "relative transition-all duration-300",
            !isExpanded && needsExpansion && "max-h-[300px] overflow-hidden"
          )}
        >
          <pre 
            ref={handleContentRef}
            className="p-4 text-sm text-zinc-300 whitespace-pre-wrap font-mono leading-relaxed"
          >
            {exampleOutput}
          </pre>
          
          {/* Gradient overlay when collapsed */}
          {!isExpanded && needsExpansion && (
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none" />
          )}
        </div>
        
        {/* Show more/less button */}
        {needsExpansion && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full py-2 px-4 text-sm text-zinc-400 hover:text-zinc-200 transition-colors flex items-center justify-center gap-1 border-t border-zinc-800 bg-zinc-900/50"
          >
            {isExpanded ? (
              <>
                Show less <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                Show full example <ChevronDown className="h-4 w-4" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

