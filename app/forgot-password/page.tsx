'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-zinc-950 text-white">
      <div className="w-full max-w-md">
        {/* Back Link */}
        <Link 
          href="/login" 
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </Link>
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Reset your password</h1>
          <p className="text-zinc-400 mt-2">We&apos;ll send you a link to reset it</p>
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
              <div className="text-4xl mb-4">📧</div>
              <h2 className="text-lg font-semibold mb-2">Check your email</h2>
              <p className="text-zinc-400 text-sm">
                We sent a password reset link to <strong className="text-white">{email}</strong>
              </p>
              <p className="text-zinc-500 text-xs mt-2">
                The link will expire in 1 hour.
              </p>
              <Link 
                href="/login"
                className="mt-6 inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
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
              
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-lg bg-white text-black font-medium 
                         hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

