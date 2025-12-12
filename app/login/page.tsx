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

