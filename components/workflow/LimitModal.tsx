'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertTriangle, Lock, Crown, LogIn } from 'lucide-react';
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
    onClose();
    // Scroll to top where AuthButton is
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpgrade = () => {
    router.push('/pricing');
  };

  const handleLogin = () => {
    onClose();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // SIGN_UP_SOFT: After 3 workflows (can close)
  if (type === 'SIGN_UP_SOFT') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="!bg-zinc-900 !border-zinc-800">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-blue-600/20 border border-blue-600/50 flex items-center justify-center">
                <Crown className="w-6 h-6 text-blue-400" />
              </div>
              <DialogTitle className="text-white text-xl">Want More Workflows?</DialogTitle>
            </div>
            <DialogDescription className="text-zinc-300 text-base">
              You have <strong className="text-white">{remaining} workflows left</strong> without an account. 
              <br /><br />
              Sign up for free to get <strong className="text-blue-400">5 workflows per month</strong>!
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3 sm:gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="!border-zinc-700 !text-zinc-300 hover:!bg-zinc-800"
            >
              Maybe Later
            </Button>
            <Button
              onClick={handleSignUp}
              className="!bg-blue-600 hover:!bg-blue-700 !text-white"
            >
              Sign Up Free
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
              <div className="w-12 h-12 rounded-full bg-amber-600/20 border border-amber-600/50 flex items-center justify-center">
                <Lock className="w-6 h-6 text-amber-400" />
              </div>
              <DialogTitle className="text-white text-xl">Workflow Limit Reached</DialogTitle>
            </div>
            <DialogDescription className="text-zinc-300 text-base">
              You've used all <strong className="text-white">5 free workflows</strong> without an account.
              <br /><br />
              <strong className="text-blue-400">Sign up for free</strong> to continue with 5 workflows per month, 
              or <strong className="text-purple-400">upgrade to Pro</strong> for unlimited access!
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-col gap-3">
            <Button
              onClick={handleSignUp}
              className="!bg-blue-600 hover:!bg-blue-700 !text-white w-full"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign Up Free (5/month)
            </Button>
            <Button
              onClick={handleUpgrade}
              className="!bg-purple-600 hover:!bg-purple-700 !text-white w-full"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Pro (Unlimited)
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
              <div className="w-12 h-12 rounded-full bg-purple-600/20 border border-purple-600/50 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-purple-400" />
              </div>
              <DialogTitle className="text-white text-xl">Monthly Limit Reached</DialogTitle>
            </div>
            <DialogDescription className="text-zinc-300 text-base">
              You've used all <strong className="text-white">5 workflows</strong> this month.
              <br /><br />
              Upgrade to <strong className="text-purple-400">Pro</strong> for unlimited workflows 
              and advanced features!
              <br /><br />
              <span className="text-sm text-zinc-400">
                Your limit resets on the 1st of next month.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-col gap-3">
            <Button
              onClick={handleUpgrade}
              className="!bg-purple-600 hover:!bg-purple-700 !text-white w-full"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Pro
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="!border-zinc-700 !text-zinc-300 hover:!bg-zinc-800 w-full"
            >
              I'll Wait
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
              <div className="w-12 h-12 rounded-full bg-blue-600/20 border border-blue-600/50 flex items-center justify-center">
                <LogIn className="w-6 h-6 text-blue-400" />
              </div>
              <DialogTitle className="text-white text-xl">Please Log In</DialogTitle>
            </div>
            <DialogDescription className="text-zinc-300 text-base">
              Please log in to continue using workflows.
              <br /><br />
              Don't have an account? Sign up for free to get 5 workflows per month!
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3 sm:gap-3">
            <Button
              onClick={handleLogin}
              className="!bg-blue-600 hover:!bg-blue-700 !text-white w-full"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Log In / Sign Up
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return null;
}

