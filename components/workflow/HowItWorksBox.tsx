'use client';

import { useState, useEffect } from 'react';
import { X, FileText, Copy, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'pf_hide_how_it_works';

interface HowItWorksBoxProps {
  estimatedMinutes?: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  tool?: 'chatgpt' | 'claude' | 'cursor' | 'any';
}

export function HowItWorksBox({ 
  estimatedMinutes = 5, 
  difficulty = 'beginner',
  tool = 'any' 
}: HowItWorksBoxProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const hidden = localStorage.getItem(STORAGE_KEY);
    setIsVisible(hidden !== 'true');
    setHasLoaded(true);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsVisible(false);
  };

  // Difficulty Display
  const difficultyLabels = {
    beginner: 'Beginner friendly',
    intermediate: 'Some experience',
    advanced: 'Advanced'
  };

  // Tool Display
  const toolLabels = {
    chatgpt: 'ChatGPT',
    claude: 'Claude',
    cursor: 'Cursor',
    any: 'Any AI'
  };

  // Don't render on server or if hidden
  if (!hasLoaded || !isVisible) return null;

  return (
    <div className="relative mb-6 p-5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl">
      {/* Dismiss Button */}
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Header */}
      <p className="text-sm font-medium text-zinc-400 mb-4 uppercase tracking-wide">
        How this works
      </p>

      {/* 3-Step Visual Flow */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-2 mb-5">
        {/* Step 1 */}
        <div className="flex-1 text-center">
          <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-blue-500/20 flex items-center justify-center">
            <FileText className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-sm font-medium text-white">Fill in</p>
          <p className="text-xs text-zinc-500">Your details</p>
        </div>

        {/* Arrow */}
        <div className="text-zinc-600 hidden sm:block">→</div>
        <div className="text-zinc-600 block sm:hidden rotate-90">→</div>

        {/* Step 2 */}
        <div className="flex-1 text-center">
          <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-purple-500/20 flex items-center justify-center">
            <Copy className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-sm font-medium text-white">Copy</p>
          <p className="text-xs text-zinc-500">Your prompt</p>
        </div>

        {/* Arrow */}
        <div className="text-zinc-600 hidden sm:block">→</div>
        <div className="text-zinc-600 block sm:hidden rotate-90">→</div>

        {/* Step 3 */}
        <div className="flex-1 text-center">
          <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-green-500/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-sm font-medium text-white">Get result</p>
          <p className="text-xs text-zinc-500">From {toolLabels[tool]}</p>
        </div>
      </div>

      {/* Meta Info Pills */}
      <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-zinc-800">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-zinc-800/50 text-zinc-400">
          <span>⏱️</span>
          <span>~{estimatedMinutes} min</span>
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-zinc-800/50 text-zinc-400">
          <span>🎯</span>
          <span>{difficultyLabels[difficulty]}</span>
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-zinc-800/50 text-zinc-400">
          <span>🤖</span>
          <span>Works with {toolLabels[tool]}</span>
        </span>
      </div>
    </div>
  );
}

