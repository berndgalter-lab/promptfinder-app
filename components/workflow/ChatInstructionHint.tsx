'use client';

import { MessageSquarePlus, MessageSquare, ClipboardPaste } from 'lucide-react';
import type { ChatInstruction } from '@/lib/types/workflow';

interface ChatInstructionHintProps {
  stepNumber: number;
  chatInstruction?: ChatInstruction;
  isSOP: boolean;
}

export function ChatInstructionHint({ stepNumber, chatInstruction, isSOP }: ChatInstructionHintProps) {
  // Nur für SOPs anzeigen
  if (!isSOP) return null;
  
  // Bestimme die Instruction (automatisch oder explizit aus DB)
  const instruction: ChatInstruction = chatInstruction || (stepNumber === 1 ? 'new_chat' : 'same_chat');
  
  if (instruction === 'new_chat') {
    return (
      <div className="mb-4 p-3 rounded-lg border bg-blue-500/10 border-blue-500/20">
        <div className="flex items-start gap-3">
          <MessageSquarePlus className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-blue-400">Start a new chat</p>
            <p className="text-sm text-zinc-400 mt-0.5">
              Open a new conversation in ChatGPT, Claude, or your preferred AI tool.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  if (instruction === 'same_chat') {
    return (
      <div className="mb-4 p-3 rounded-lg border bg-green-500/10 border-green-500/20">
        <div className="flex items-start gap-3">
          <MessageSquare className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-green-400">Continue in the same chat</p>
            <p className="text-sm text-zinc-400 mt-0.5">
              Use the same conversation from Step 1. The AI remembers the context.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  if (instruction === 'paste_previous') {
    return (
      <div className="mb-4 p-3 rounded-lg border bg-amber-500/10 border-amber-500/20">
        <div className="flex items-start gap-3">
          <ClipboardPaste className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-400">Paste your previous output first</p>
            <p className="text-sm text-zinc-400 mt-0.5">
              Copy the result from the previous step and paste it before using this prompt.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return null;
}

