'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertTriangle, Lock, Crown, LogIn, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export type LimitModalType = 'SIGN_UP_SOFT' | 'SIGN_UP_HARD' | 'UPGRADE_TO_PRO' | 'LOGIN_REQUIRED';

interface LimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: LimitModalType;
  remaining?: number;
}

export function LimitModal({ isOpen, onClose, type, remaining = 0 }: LimitModalProps) {
  const router = useRouter();

  const handleSignUp = () => {
    // Don't close modal - just scroll to auth button
    // User needs to actually sign up, not bypass the modal
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpgrade = () => {
    router.push('/pricing');
  };

  const handleLogin = () => {
    // Don't close modal - just scroll to auth button
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // SIGN_UP_SOFT: After 3 workflows (soft nudge, can still continue)
  if (type === 'SIGN_UP_SOFT') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent 
          className="!bg-zinc-900 !border-zinc-800"
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <DialogTitle className="text-white text-xl">You're on a Roll! 🎉</DialogTitle>
            </div>
            <DialogDescription className="text-zinc-300 text-base leading-relaxed">
              You've already completed <strong className="text-white">3 workflows</strong> — nice work!
              <br /><br />
              <span className="text-zinc-400">Only <strong className="text-blue-400">{remaining} left</strong> before you hit the limit.</span>
              <br /><br />
              💡 Create a <strong className="text-white">free account</strong> to unlock <strong className="text-emerald-400">5 workflows per month</strong> and save your progress!
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3 sm:gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="!border-zinc-700 !text-zinc-400 hover:!bg-zinc-800 hover:!text-zinc-300"
            >
              Continue Without Account
            </Button>
            <Button
              onClick={handleSignUp}
              className="!bg-gradient-to-r !from-blue-600 !to-purple-600 hover:!from-blue-700 hover:!to-purple-700 !text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Create Free Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // SIGN_UP_HARD: After 5 workflows (must sign up)
  if (type === 'SIGN_UP_HARD') {
    return (
      <Dialog open={isOpen} onOpenChange={() => {}}>
        <DialogContent className="!bg-zinc-900 !border-zinc-800" onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <DialogTitle className="text-white text-xl">You've Hit the Free Limit! 🚀</DialogTitle>
            </div>
            <DialogDescription className="text-zinc-300 text-base leading-relaxed">
              Wow! You've already used <strong className="text-white">5 workflows</strong> — you're clearly getting value from PromptFinder!
              <br /><br />
              <strong className="text-emerald-400">Good news:</strong> Creating a free account takes 10 seconds and gives you <strong className="text-blue-400">5 more workflows per month</strong>.
              <br /><br />
              Want unlimited access? <strong className="text-purple-400">Go Pro</strong> and never worry about limits again! 👑
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-col gap-3">
            <Button
              onClick={handleSignUp}
              className="!bg-gradient-to-r !from-blue-600 !to-blue-700 hover:!from-blue-700 hover:!to-blue-800 !text-white w-full !shadow-lg !shadow-blue-500/30"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Continue with Free Account (5/month)
            </Button>
            <Button
              onClick={handleUpgrade}
              className="!bg-gradient-to-r !from-purple-600 !to-pink-600 hover:!from-purple-700 hover:!to-pink-700 !text-white w-full !shadow-lg !shadow-purple-500/30"
            >
              <Crown className="w-4 h-4 mr-2" />
              Go Pro — Unlimited Access
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // UPGRADE_TO_PRO: Free user limit reached
  if (type === 'UPGRADE_TO_PRO') {
    return (
      <Dialog open={isOpen} onOpenChange={() => {}}>
        <DialogContent className="!bg-zinc-900 !border-zinc-800" onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <DialogTitle className="text-white text-xl">You're a Power User! 💪</DialogTitle>
            </div>
            <DialogDescription className="text-zinc-300 text-base leading-relaxed">
              You've maxed out your <strong className="text-white">5 free workflows</strong> this month — clearly you're getting serious value!
              <br /><br />
              <strong className="text-emerald-400">Ready to level up?</strong> Go Pro for <strong className="text-purple-400">unlimited workflows</strong>, faster processing, and priority support.
              <br /><br />
              <div className="flex items-center gap-2 mt-3 p-3 bg-zinc-800/50 rounded-lg border border-zinc-700">
                <span className="text-xs text-zinc-400">
                  ⏰ Free plan resets on the 1st of next month
                </span>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-col gap-3">
            <Button
              onClick={handleUpgrade}
              className="!bg-gradient-to-r !from-purple-600 !to-pink-600 hover:!from-purple-700 hover:!to-pink-700 !text-white w-full !shadow-lg !shadow-purple-500/30"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Pro — Unlimited Workflows
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="!border-zinc-700 !text-zinc-400 hover:!bg-zinc-800 hover:!text-zinc-300 w-full"
            >
              I'll Wait Until Next Month
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // LOGIN_REQUIRED: User tried to bypass by logging out
  if (type === 'LOGIN_REQUIRED') {
    return (
      <Dialog open={isOpen} onOpenChange={() => {}}>
        <DialogContent className="!bg-zinc-900 !border-zinc-800" onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <LogIn className="w-6 h-6 text-white" />
              </div>
              <DialogTitle className="text-white text-xl">Welcome Back! 👋</DialogTitle>
            </div>
            <DialogDescription className="text-zinc-300 text-base leading-relaxed">
              To continue using workflows, please log in to your account.
              <br /><br />
              <strong className="text-emerald-400">New here?</strong> Create a free account in seconds and get <strong className="text-blue-400">5 workflows per month</strong>!
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3 sm:gap-3">
            <Button
              onClick={handleLogin}
              className="!bg-gradient-to-r !from-blue-600 !to-cyan-600 hover:!from-blue-700 hover:!to-cyan-700 !text-white w-full !shadow-lg !shadow-blue-500/30"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Log In / Sign Up Free
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return null;
}

