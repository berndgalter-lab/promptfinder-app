'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Mail } from 'lucide-react';

interface SignInModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workflowId?: string;
  workflowTitle?: string;
  action?: 'favorite' | 'use';
}

export function SignInModal({ 
  open, 
  onOpenChange, 
  workflowId, 
  workflowTitle,
  action = 'favorite'
}: SignInModalProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;
    
    setIsSubmitting(true);

    // Build redirect URL with action and workflowId
    const currentUrl = window.location.pathname;
    const params = new URLSearchParams();
    params.set('next', currentUrl);
    if (action) params.set('action', action);
    if (workflowId) params.set('workflowId', workflowId);
    
    const redirectUrl = `${window.location.origin}/auth/callback?${params.toString()}`;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    setIsSubmitting(false);

    if (!error) {
      setEmailSent(true);
    } else {
      console.error('Error sending magic link:', error);
      alert('Error sending magic link. Please try again.');
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset state when closing
    setTimeout(() => {
      setEmailSent(false);
      setEmail('');
    }, 300);
  };

  const handleTryAgain = () => {
    setEmailSent(false);
    setEmail('');
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800 text-white">
        {!emailSent ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-2xl">
                ⭐ {action === 'favorite' ? 'Save' : 'Use'} {workflowTitle ? `"${workflowTitle}"` : 'this workflow'}
              </DialogTitle>
              <DialogDescription className="text-zinc-400">
                Sign in to {action === 'favorite' ? 'save this workflow to your favorites' : 'use this workflow'}.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 bg-zinc-950 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-blue-500"
                  autoFocus
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || !email}
                className="w-full h-11 !bg-blue-600 hover:!bg-blue-700 !text-white"
                size="lg"
              >
                {isSubmitting ? 'Sending...' : 'Send Magic Link'}
              </Button>
            </form>

            {/* Benefits */}
            <div className="pt-4 space-y-2 border-t border-zinc-800">
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Check className="w-4 h-4 text-green-500" />
                <span>Free forever</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Check className="w-4 h-4 text-green-500" />
                <span>5 workflows per month</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Check className="w-4 h-4 text-green-500" />
                <span>Save unlimited favorites</span>
              </div>
            </div>

            <div className="text-center">
              <Button
                variant="ghost"
                onClick={handleClose}
                className="text-zinc-500 hover:text-zinc-400 h-auto p-2"
              >
                Maybe Later
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-2xl">
                <Mail className="w-6 h-6 text-blue-500" />
                Check your email!
              </DialogTitle>
              <DialogDescription className="text-zinc-400">
                We sent a magic link to:
              </DialogDescription>
            </DialogHeader>

            <div className="py-6 space-y-4">
              <div className="text-center">
                <p className="text-lg font-medium text-white mb-4">
                  {email}
                </p>
                <p className="text-sm text-zinc-400">
                  Click the link in your email to sign in and {action === 'favorite' ? 'save this workflow' : 'continue'}.
                </p>
              </div>

              <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-4">
                <p className="text-sm text-blue-300">
                  💡 Tip: Check your spam folder if you don't see the email within a minute.
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleTryAgain}
                className="flex-1 !text-white !border-zinc-700 hover:!bg-zinc-800"
              >
                Try Another Email
              </Button>
              <Button
                onClick={handleClose}
                className="flex-1 !bg-zinc-800 hover:!bg-zinc-700 !text-white"
              >
                Close
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

