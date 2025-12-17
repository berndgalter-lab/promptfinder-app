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
import { Check, Mail, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

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
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'options' | 'password' | 'magiclink'>('options');
  const supabase = createClient();

  // Build redirect URL
  const getRedirectUrl = () => {
    const currentUrl = window.location.pathname;
    const params = new URLSearchParams();
    params.set('next', currentUrl);
    if (action) params.set('action', action);
    if (workflowId) params.set('workflowId', workflowId);
    return `${window.location.origin}/auth/callback?${params.toString()}`;
  };

  // Google OAuth Sign In
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: getRedirectUrl(),
      },
    });
    
    if (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  // Email + Password Login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsLoading(true);
    setError('');
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      // Success - close modal and refresh
      onOpenChange(false);
      window.location.reload();
    }
  };

  // Magic Link Login
  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: getRedirectUrl(),
      },
    });

    setIsLoading(false);

    if (!error) {
      setEmailSent(true);
    } else {
      setError(error.message);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset state when closing
    setTimeout(() => {
      setEmailSent(false);
      setEmail('');
      setPassword('');
      setError('');
      setMode('options');
    }, 300);
  };

  const handleBack = () => {
    setMode('options');
    setError('');
    setPassword('');
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800 text-white">
        {emailSent ? (
          // Magic Link Sent Success
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
                onClick={() => { setEmailSent(false); setEmail(''); }}
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
        ) : mode === 'options' ? (
          // Main Options View
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">
                {action === 'favorite' ? 'Save' : 'Sign in to use'} {workflowTitle ? `"${workflowTitle}"` : 'this workflow'}
              </DialogTitle>
              <DialogDescription className="text-zinc-400">
                Choose how you'd like to sign in
              </DialogDescription>
            </DialogHeader>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-900/30 border border-red-800 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-3 pt-2">
              {/* Google Sign In */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-3 rounded-lg bg-white text-black font-medium 
                         hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-800"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-zinc-900 text-zinc-500">or</span>
                </div>
              </div>

              {/* Email + Password */}
              <button
                type="button"
                onClick={() => setMode('password')}
                disabled={isLoading}
                className="w-full py-3 rounded-lg bg-zinc-800 text-white font-medium 
                         hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2 border border-zinc-700"
              >
                Sign in with Email & Password
              </button>

              {/* Magic Link */}
              <button
                type="button"
                onClick={() => setMode('magiclink')}
                disabled={isLoading}
                className="w-full py-3 rounded-lg bg-transparent text-zinc-400 
                         hover:bg-zinc-800 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2 border border-zinc-700"
              >
                <Mail className="w-4 h-4" />
                Sign in with Magic Link
              </button>
            </div>

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

            <div className="text-center pt-2">
              <p className="text-xs text-zinc-500">
                Don't have an account?{' '}
                <Link href="/signup" className="text-blue-400 hover:text-blue-300" onClick={handleClose}>
                  Sign up free
                </Link>
              </p>
            </div>
          </>
        ) : mode === 'password' ? (
          // Email + Password Form
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">Sign in with Email</DialogTitle>
              <DialogDescription className="text-zinc-400">
                Enter your email and password
              </DialogDescription>
            </DialogHeader>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-900/30 border border-red-800 text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handlePasswordLogin} className="space-y-4 pt-2">
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="h-11 bg-zinc-950 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-blue-500"
                  autoFocus
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm text-zinc-400">Password</label>
                  <Link 
                    href="/forgot-password" 
                    className="text-xs text-blue-400 hover:text-blue-300"
                    onClick={handleClose}
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="h-11 bg-zinc-950 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-blue-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !email || !password}
                className="w-full h-11 !bg-blue-600 hover:!bg-blue-700 !text-white"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex-1 !text-zinc-400 !border-zinc-700 hover:!bg-zinc-800 hover:!text-white"
              >
                ← Back
              </Button>
            </div>

            <div className="text-center pt-2">
              <p className="text-xs text-zinc-500">
                Don't have an account?{' '}
                <Link href="/signup" className="text-blue-400 hover:text-blue-300" onClick={handleClose}>
                  Sign up free
                </Link>
              </p>
            </div>
          </>
        ) : (
          // Magic Link Form
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">Sign in with Magic Link</DialogTitle>
              <DialogDescription className="text-zinc-400">
                We'll send you a link to sign in instantly
              </DialogDescription>
            </DialogHeader>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-900/30 border border-red-800 text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleMagicLink} className="space-y-4 pt-2">
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="h-11 bg-zinc-950 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-blue-500"
                  autoFocus
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading || !email}
                className="w-full h-11 !bg-blue-600 hover:!bg-blue-700 !text-white"
              >
                <Mail className="w-4 h-4 mr-2" />
                {isLoading ? 'Sending...' : 'Send Magic Link'}
              </Button>
            </form>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex-1 !text-zinc-400 !border-zinc-700 hover:!bg-zinc-800 hover:!text-white"
              >
                ← Back
              </Button>
            </div>

            <div className="text-center pt-2">
              <p className="text-xs text-zinc-500">
                Don't have an account?{' '}
                <Link href="/signup" className="text-blue-400 hover:text-blue-300" onClick={handleClose}>
                  Sign up free
                </Link>
              </p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
