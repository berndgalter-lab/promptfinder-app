import { Lightbulb } from 'lucide-react';

interface ProTipProps {
  tool?: 'chatgpt' | 'claude' | 'cursor' | 'any';
}

export function ProTip({ tool = 'chatgpt' }: ProTipProps) {
  const tips = {
    chatgpt: "After pasting in ChatGPT, just hit Enter to get your result instantly.",
    claude: "Paste in Claude and press Enter. Claude is great for nuanced, detailed responses.",
    cursor: "Use Cmd+K in Cursor, paste your prompt, and let AI write your code.",
    any: "Paste your prompt in any AI assistant and hit Enter to get your result."
  };

  return (
    <div className="mt-4 flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
      <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
      <p className="text-sm text-amber-200/80">
        <span className="font-medium text-amber-400">Pro tip:</span>{' '}
        {tips[tool]}
      </p>
    </div>
  );
}

