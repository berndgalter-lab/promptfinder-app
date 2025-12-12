'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showMagicLinkSent, setShowMagicLinkSent] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Email + Password Login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
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
      router.push('/dashboard');
      router.refresh();
    }
  };

  // Google OAuth Sign In
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    
    if (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  // Magic Link Login (secondary option)
  const handleMagicLink = async () => {
    if (!email) {
      setError('Please enter your email first');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    
    if (error) {
      setError(error.message);
    } else {
      setShowMagicLinkSent(true);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-zinc-950 text-white">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-zinc-400 mt-2">Sign in to your account</p>
        </div>
        
        <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-900/30 border border-red-800 text-red-400 text-sm">
              {error}
            </div>
          )}
          
          {/* Magic Link Sent Success */}
          {showMagicLinkSent ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-4">📧</div>
              <h2 className="text-lg font-semibold mb-2">Check your email</h2>
              <p className="text-zinc-400 text-sm">
                We sent a magic link to <strong className="text-white">{email}</strong>
              </p>
              <button
                onClick={() => setShowMagicLinkSent(false)}
                className="mt-4 text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                ← Back to login
              </button>
            </div>
          ) : (
            <>
              {/* Google Sign In */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-2.5 rounded-lg bg-white text-black font-medium 
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
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-800"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-zinc-900 text-zinc-500">or continue with email</span>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handlePasswordLogin} className="space-y-4">
                {/* Email Field */}
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 
                             text-white placeholder-zinc-500
                             focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 
                             transition-colors"
                    placeholder="you@example.com"
                  />
                </div>
                
                {/* Password Field */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-sm text-zinc-400">Password</label>
                    <Link 
                      href="/forgot-password" 
                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 
                             text-white placeholder-zinc-500
                             focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 
                             transition-colors"
                    placeholder="••••••••"
                  />
                </div>
                
                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 rounded-lg bg-white text-black font-medium 
                           hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
              
              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-800"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-zinc-900 text-zinc-500">or</span>
                </div>
              </div>
              
              {/* Magic Link Button */}
              <button
                type="button"
                onClick={handleMagicLink}
                disabled={isLoading}
                className="w-full py-2.5 rounded-lg bg-zinc-800 text-zinc-300 
                         hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2 border border-zinc-700"
              >
                <Mail className="w-4 h-4" />
                Sign in with Magic Link
              </button>
            </>
          )}
        </div>
        
        {/* Sign Up Link */}
        <p className="text-center mt-6 text-zinc-400 text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-white hover:text-blue-400 transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

