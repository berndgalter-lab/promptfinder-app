'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
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
    
    const { error } = await supabase.auth.updateUser({
      password,
    });
    
    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      setSuccess(true);
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-zinc-950 text-white">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Set new password</h1>
          <p className="text-zinc-400 mt-2">Enter your new password below</p>
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
              <div className="text-4xl mb-4">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
              </div>
              <h2 className="text-lg font-semibold mb-2">Password updated!</h2>
              <p className="text-zinc-400 text-sm">
                Your password has been successfully updated.
              </p>
              <p className="text-zinc-500 text-xs mt-2">
                Redirecting to login...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* New Password Field */}
              <div>
                <label className="block text-sm text-zinc-400 mb-1">New Password</label>
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
                <label className="block text-sm text-zinc-400 mb-1">Confirm New Password</label>
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
              
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-lg bg-white text-black font-medium 
                         hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          )}
        </div>
        
        {/* Login Link */}
        {!success && (
          <p className="text-center mt-6">
            <Link 
              href="/login" 
              className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to login
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

