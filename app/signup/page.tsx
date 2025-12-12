'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Validate password strength
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    
    setIsLoading(true);
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    
    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      setSuccess(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-zinc-950 text-white">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-zinc-400 mt-2">Start using AI workflows today</p>
        </div>
        
        <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-900/30 border border-red-800 text-red-400 text-sm">
              {error}
            </div>
          )}
          
          {/* Success Message */}
          {success ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-4">✅</div>
              <h2 className="text-lg font-semibold mb-2">Check your email</h2>
              <p className="text-zinc-400 text-sm">
                We sent a confirmation link to <strong className="text-white">{email}</strong>
              </p>
              <p className="text-zinc-500 text-xs mt-2">
                Click the link in the email to activate your account.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
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
                <label className="block text-sm text-zinc-400 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 
                           text-white placeholder-zinc-500
                           focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 
                           transition-colors"
                  placeholder="••••••••"
                />
                <p className="text-xs text-zinc-500 mt-1">Minimum 8 characters</p>
              </div>
              
              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 
                           text-white placeholder-zinc-500
                           focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 
                           transition-colors"
                  placeholder="••••••••"
                />
              </div>
              
              {/* Sign Up Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-lg bg-white text-black font-medium 
                         hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>
              
              {/* Terms */}
              <p className="text-xs text-zinc-500 text-center pt-2">
                By signing up, you agree to our{' '}
                <Link href="/terms" className="text-zinc-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-zinc-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </p>
            </form>
          )}
        </div>
        
        {/* Login Link */}
        <p className="text-center mt-6 text-zinc-400 text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-white hover:text-blue-400 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

