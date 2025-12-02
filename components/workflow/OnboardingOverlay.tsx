'use client';

import { useState, useEffect } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'pf_onboarding_complete';

interface OnboardingOverlayProps {
  workflowTitle: string;
}

export function OnboardingOverlay({ workflowTitle }: OnboardingOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Small delay to prevent flash on page load
    const timer = setTimeout(() => {
      const completed = localStorage.getItem(STORAGE_KEY);
      if (completed !== 'true') {
        setIsVisible(true);
        // Trigger animation after mount
        requestAnimationFrame(() => setIsAnimating(true));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsAnimating(false);
    setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, 'true');
      setIsVisible(false);
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${
        isAnimating ? 'bg-black/70 backdrop-blur-sm' : 'bg-transparent'
      }`}
      onClick={handleDismiss}
    >
      <div 
        className={`relative w-full max-w-lg transform transition-all duration-300 ${
          isAnimating 
            ? 'scale-100 opacity-100 translate-y-0' 
            : 'scale-95 opacity-0 translate-y-4'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Card */}
        <div className="relative overflow-hidden rounded-2xl border border-zinc-700/50 bg-zinc-900 shadow-2xl">
          
          {/* Gradient accent top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
          
          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-1.5 text-zinc-500 hover:text-white transition-colors rounded-lg hover:bg-zinc-800"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-8 pt-10">
            
            {/* Context label */}
            <p className="text-xs text-zinc-500 text-center mb-4 uppercase tracking-wider">
              New to PromptFinder workflows? Here's how they work
            </p>

            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-3">
                Welcome to PromptFinder 👋
              </h2>
              <p className="text-zinc-400 leading-relaxed">
                Reusable AI workflows: you fill in a form,<br />
                we build the prompt – ready to copy & run.
              </p>
            </div>

            {/* Current workflow context */}
            <div className="mb-8 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50 text-center">
              <p className="text-xs text-zinc-500 mb-1">You've opened:</p>
              <p className="text-sm font-medium text-white">{workflowTitle}</p>
            </div>

            {/* Steps - Visual Flow */}
            <div className="relative mb-8">
              {/* Connection line */}
              <div className="absolute top-8 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-green-500/50 hidden sm:block" />
              
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                {/* Step 1 */}
                <div className="relative text-center">
                  <div className="relative z-10 w-14 h-14 mx-auto mb-3 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                    <span className="text-xl">📝</span>
                  </div>
                  <p className="text-sm font-medium text-white">Fill in</p>
                  <p className="text-xs text-zinc-500 mt-1 leading-tight">Answer a few questions about your task</p>
                </div>

                {/* Step 2 */}
                <div className="relative text-center">
                  <div className="relative z-10 w-14 h-14 mx-auto mb-3 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
                    <span className="text-xl">⚡</span>
                  </div>
                  <p className="text-sm font-medium text-white">We build</p>
                  <p className="text-xs text-zinc-500 mt-1 leading-tight">PromptFinder creates a best-practice prompt</p>
                </div>

                {/* Step 3 */}
                <div className="relative text-center">
                  <div className="relative z-10 w-14 h-14 mx-auto mb-3 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                    <span className="text-xl">🚀</span>
                  </div>
                  <p className="text-sm font-medium text-white">Copy & run</p>
                  <p className="text-xs text-zinc-500 mt-1 leading-tight">Paste into ChatGPT & Co for instant results</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <Button 
              onClick={handleDismiss}
              size="lg"
              className="w-full !bg-gradient-to-r !from-blue-600 !to-purple-600 hover:!from-blue-500 hover:!to-purple-500 !text-white font-medium h-12 text-base"
            >
              Start this workflow
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <p className="text-center text-xs text-zinc-500 mt-4">
              No signup required. Your workflows are saved automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
