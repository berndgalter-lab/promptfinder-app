'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import type { User } from '@supabase/supabase-js';

export function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    // Get initial user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const signInWithMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;
    
    setIsSubmitting(true);
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setIsSubmitting(false);

    if (!error) {
      setEmailSent(true);
    } else {
      alert('Error sending magic link. Please try again.');
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setEmailSent(false);
    setEmail('');
  };

  if (loading) {
    return (
      <Button variant="ghost" disabled className="text-zinc-400">
        Loading...
      </Button>
    );
  }

  if (!user) {
    if (emailSent) {
      return (
        <div className="flex flex-col gap-2 text-right">
          <span className="text-sm text-green-400">
            Check your email! 📧
          </span>
          <button
            onClick={() => setEmailSent(false)}
            className="text-xs text-zinc-500 hover:text-zinc-400"
          >
            Try another email
          </button>
        </div>
      );
    }

    return (
      <form onSubmit={signInWithMagicLink} className="flex items-center gap-2">
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="h-9 rounded-md border border-zinc-700 bg-zinc-900 px-3 text-sm text-white placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
        />
        <Button 
          type="submit" 
          disabled={isSubmitting || !email}
          size="sm"
        >
          {isSubmitting ? 'Sending...' : 'Sign In'}
        </Button>
      </form>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-zinc-400">
        {user.email}
      </span>
      <Button onClick={signOut} variant="outline" size="sm">
        Sign Out
      </Button>
    </div>
  );
}

