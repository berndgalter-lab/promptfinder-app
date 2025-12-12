import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getUserPlan } from '@/lib/subscription';
import { User, CreditCard, ExternalLink, Lock } from 'lucide-react';
import { AccountSettings } from '@/components/dashboard/AccountSettings';
import { SecuritySettings } from '@/components/settings/SecuritySettings';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Lemon Squeezy Customer Portal URL
const CUSTOMER_PORTAL_URL = 'https://promptfinder.lemonsqueezy.com/billing';

export default async function SettingsPage() {
  const user = await getUser();

  // Redirect if not logged in
  if (!user) {
    redirect('/');
  }

  // Get subscription status
  const currentPlan = await getUserPlan(user.id);
  const isPro = currentPlan !== 'free';

  // Format member since date
  const memberSince = new Date(user.created_at || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-zinc-400 mb-8">Manage your account settings and preferences.</p>

        <div className="space-y-6">
          
          {/* ============================================ */}
          {/* SECTION 1: PROFILE */}
          {/* ============================================ */}
          <section className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-zinc-400" />
              Profile
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-zinc-400 block mb-1">Email</label>
                <div className="px-4 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-zinc-300">
                  {user.email}
                </div>
                <p className="text-xs text-zinc-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="text-sm text-zinc-400 block mb-1">Member since</label>
                <div className="text-zinc-300">
                  {memberSince}
                </div>
              </div>
            </div>
          </section>

          {/* ============================================ */}
          {/* SECTION 2: SUBSCRIPTION */}
          {/* ============================================ */}
          <section className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-zinc-400" />
              Subscription
            </h2>

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2">
                  {isPro ? (
                    <>
                      <span className="text-yellow-500">👑</span>
                      <span className="font-medium">Pro Plan</span>
                      <span className="text-xs px-2 py-0.5 bg-green-900/50 text-green-400 rounded-full">
                        Active
                      </span>
                    </>
                  ) : (
                    <span className="font-medium">Free Plan</span>
                  )}
                </div>
                <p className="text-sm text-zinc-400 mt-1">
                  {isPro
                    ? 'Unlimited workflows and advanced features'
                    : 'Upgrade to unlock all workflows'}
                </p>
              </div>

              {isPro ? (
                <a
                  href={CUSTOMER_PORTAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-sm bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors flex items-center gap-2"
                >
                  Manage Subscription
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <Link
                  href="/pricing"
                  className="px-4 py-2 text-sm bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                >
                  Upgrade to Pro
                </Link>
              )}
            </div>
          </section>

          {/* ============================================ */}
          {/* SECTION 3: SECURITY */}
          {/* ============================================ */}
          <section className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-zinc-400" />
              Security
            </h2>
            <p className="text-sm text-zinc-400 mb-4">
              Manage your password and security settings.
            </p>
            <SecuritySettings />
          </section>

          {/* ============================================ */}
          {/* SECTION 4: DATA & PRIVACY */}
          {/* ============================================ */}
          <section className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800">
            <h2 className="text-lg font-semibold mb-4">Data & Privacy</h2>
            <p className="text-sm text-zinc-400 mb-4">
              Export your data or delete your account.
            </p>
            
            {/* Reuse existing AccountSettings component */}
            <AccountSettings userId={user.id} userEmail={user.email || ''} />
          </section>

        </div>
      </div>
    </div>
  );
}

