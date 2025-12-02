'use client';

import { useState, useEffect } from 'react';
import { X, Sparkles, ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'pf_onboarding_complete';

export function OnboardingOverlay() {
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
            
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30">
                <Sparkles className="w-8 h-8 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Welcome to PromptFinder! 👋
              </h2>
              <p className="text-zinc-400">
                Create amazing AI content in seconds – no prompt engineering needed.
              </p>
            </div>

            {/* Steps - Visual Flow */}
            <div className="relative mb-8">
              {/* Connection line */}
              <div className="absolute top-8 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-green-500/50 hidden sm:block" />
              
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                {/* Step 1 */}
                <div className="relative text-center">
                  <div className="relative z-10 w-16 h-16 mx-auto mb-3 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                    <span className="text-2xl">📝</span>
                  </div>
                  <p className="text-sm font-medium text-white">Fill in</p>
                  <p className="text-xs text-zinc-500 mt-0.5">a few fields</p>
                </div>

                {/* Step 2 */}
                <div className="relative text-center">
                  <div className="relative z-10 w-16 h-16 mx-auto mb-3 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
                    <span className="text-2xl">🤖</span>
                  </div>
                  <p className="text-sm font-medium text-white">We build</p>
                  <p className="text-xs text-zinc-500 mt-0.5">the perfect prompt</p>
                </div>

                {/* Step 3 */}
                <div className="relative text-center">
                  <div className="relative z-10 w-16 h-16 mx-auto mb-3 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                    <span className="text-2xl">✨</span>
                  </div>
                  <p className="text-sm font-medium text-white">Get results</p>
                  <p className="text-xs text-zinc-500 mt-0.5">from ChatGPT & Co</p>
                </div>
              </div>
            </div>

            {/* Value Props */}
            <div className="flex flex-wrap justify-center gap-3 mb-8 text-sm">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800/80 text-zinc-300">
                <Zap className="w-3.5 h-3.5 text-yellow-400" />
                Takes 2-3 minutes
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800/80 text-zinc-300">
                <span className="text-green-400">✓</span>
                No AI expertise needed
              </span>
            </div>

            {/* CTA */}
            <Button 
              onClick={handleDismiss}
              size="lg"
              className="w-full !bg-gradient-to-r !from-blue-600 !to-purple-600 hover:!from-blue-500 hover:!to-purple-500 !text-white font-medium h-12 text-base"
            >
              Let's try it!
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <p className="text-center text-xs text-zinc-500 mt-4">
              You can always revisit workflows – they're saved automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

