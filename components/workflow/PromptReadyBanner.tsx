import { Sparkles } from 'lucide-react';

interface PromptReadyBannerProps {
  isReady: boolean;
}

export function PromptReadyBanner({ isReady }: PromptReadyBannerProps) {
  if (!isReady) {
    return (
      <div className="flex items-center gap-2 mb-3 text-zinc-500">
        <span className="text-sm">👆 Fill in the fields above to generate your prompt</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 mb-3 text-green-400">
      <Sparkles className="w-4 h-4" />
      <span className="text-sm font-medium">Your personalized prompt is ready!</span>
    </div>
  );
}

