import { Lightbulb, MessageSquare } from 'lucide-react';
import type { ChatInstruction } from '@/lib/types/workflow';

interface ProTipProps {
  tool?: 'chatgpt' | 'claude' | 'cursor' | 'any';
  chatInstruction?: ChatInstruction;
  isFirstPromptStep?: boolean;
}

export function ProTip({ tool = 'chatgpt', chatInstruction, isFirstPromptStep = true }: ProTipProps) {
  // Show "Continue in same chat" hint if:
  // - chatInstruction is 'same_chat' AND it's not the first prompt step
  const showSameChatHint = chatInstruction === 'same_chat' && !isFirstPromptStep;

  if (showSameChatHint) {
    return (
      <div className="mt-4 flex items-start gap-3 p-4 bg-amber-500/20 border border-amber-500/40 rounded-lg">
        <MessageSquare className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-300">
            Continue in the same chat
          </p>
          <p className="text-sm text-amber-200/70 mt-0.5">
            Paste this in the same conversation as the previous step to keep context.
          </p>
        </div>
      </div>
    );
  }

  // Default "Pro tip" for new chat or first prompt step
  const tips = {
    chatgpt: "After pasting in ChatGPT, just hit Enter to get your result instantly.",
    claude: "Paste in Claude and press Enter. Claude is great for nuanced, detailed responses.",
    cursor: "Use Cmd+K in Cursor, paste your prompt, and let AI write your code.",
    any: "Paste your prompt in any AI assistant and hit Enter to get your result."
  };

  return (
    <div className="mt-4 flex items-start gap-2 p-3 bg-zinc-800/50 border border-zinc-700/50 rounded-lg">
      <Lightbulb className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
      <p className="text-sm text-zinc-400">
        <span className="font-medium text-zinc-300">Pro tip:</span>{' '}
        {tips[tool]}
      </p>
    </div>
  );
}

