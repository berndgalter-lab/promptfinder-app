import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ACHIEVEMENTS, getAchievementIcon } from '@/lib/achievements';
import Link from 'next/link';
import { getUserPlan } from '@/lib/subscription';
import { Star, Clock, BarChart3, Trophy, Tag, User, Building2 } from 'lucide-react';

// Force dynamic rendering - no caching for subscription status
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Helper function for relative time
function formatRelativeTime(date: string): string {
  const now = new Date();
  const then = new Date(date);
  const diffInDays = Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  return `${Math.floor(diffInDays / 30)} months ago`;
}

export default async function DashboardPage() {
  const user = await getUser();

  // Redirect if not logged in
  if (!user) {
    redirect('/');
  }

  const supabase = await createClient();

  // Fetch user subscription/plan
  const currentPlan = await getUserPlan(user.id);

  // Fetch user stats
  const { data: userStats } = await supabase
    .from('user_stats')
    .select('total_workflows, last_used_at, current_streak')
    .eq('user_id', user.id)
    .single();

  // Fetch unlocked achievements
  const { data: unlockedAchievements } = await supabase
    .from('user_achievements')
    .select('achievement_code, unlocked_at')
    .eq('user_id', user.id)
    .order('unlocked_at', { ascending: false });

  // Fetch recent history (last 5 used workflows)
  const { data: recentWorkflows } = await supabase
    .from('user_usage')
    .select(`
      used_at,
      workflow:workflows(id, slug, title, icon)
    `)
    .eq('user_id', user.id)
    .order('used_at', { ascending: false })
    .limit(5);

  // Fetch favorites with workflow data
  const { data: favoritesData, count: favoritesCount } = await supabase
    .from('user_favorites')
    .select(`
      id,
      workflow:workflows(
        id,
        title,
        slug,
        icon,
        category:categories(name)
      )
    `, { count: 'exact' })
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(6);

  // Process data
  const username = user.email?.split('@')[0] || 'there';
  const totalWorkflows = userStats?.total_workflows || 0;
  const unlockedCodes = new Set(unlockedAchievements?.map(a => a.achievement_code) || []);
  const unlockedCount = unlockedCodes.size;
  const totalAchievements = ACHIEVEMENTS.length;
  const lockedCount = totalAchievements - unlockedCount;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-8">

          {/* ============================================ */}
          {/* 1. HEADER */}
          {/* ============================================ */}
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-zinc-400 mt-1">Welcome back, {username}!</p>
        </div>

        {/* ============================================ */}
          {/* 2. CONTINUE WHERE YOU LEFT OFF */}
        {/* ============================================ */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-zinc-400" />
                Continue Where You Left Off
              </h2>
              <Link 
                href="/history" 
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                View full history →
              </Link>
            </div>
            
            {recentWorkflows && recentWorkflows.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {recentWorkflows.map((item: any) => (
                <Link 
                    key={item.workflow?.id || item.used_at} 
                    href={`/workflows/${item.workflow?.slug}`}
                    className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-zinc-600 hover:-translate-y-0.5 transition-all"
                  >
                    <div className="text-2xl mb-2">{item.workflow?.icon || '📝'}</div>
                    <div className="font-medium text-sm line-clamp-2">{item.workflow?.title || 'Workflow'}</div>
                    <div className="text-xs text-zinc-500 mt-1">
                      {formatRelativeTime(item.used_at)}
                  </div>
                </Link>
              ))}
            </div>
            ) : (
              <div className="p-6 rounded-xl bg-zinc-900/30 border border-zinc-800 text-center">
                <p className="text-zinc-400 mb-3">You haven&apos;t used any workflows yet.</p>
                <Link href="/workflows">
                  <Button variant="secondary" size="sm">Browse Workflows</Button>
                </Link>
          </div>
        )}
          </section>

        {/* ============================================ */}
          {/* 3. YOUR FAVORITES */}
        {/* ============================================ */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Your Favorites
              </h2>
              <Link 
                href="/favorites" 
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                View all →
              </Link>
            </div>
            
            {favoritesData && favoritesData.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {favoritesData.slice(0, 6).map((fav: any) => (
                <Link 
                    key={fav.workflow?.id || fav.id}
                    href={`/workflows/${fav.workflow?.slug}`}
                    className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-zinc-600 hover:-translate-y-0.5 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{fav.workflow?.icon || '📝'}</span>
                      <div className="min-w-0">
                        <div className="font-medium line-clamp-1">{fav.workflow?.title}</div>
                        <div className="text-xs text-zinc-500">
                          {fav.workflow?.category?.name || 'Workflow'}
                        </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            ) : (
              <div className="p-6 rounded-xl bg-zinc-900/30 border border-zinc-800 text-center">
                <p className="text-zinc-400">No favorites yet. Star workflows to save them here.</p>
          </div>
        )}
          </section>

          {/* ============================================ */}
          {/* 4. BRAND PRESETS */}
          {/* ============================================ */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Tag className="w-5 h-5 text-purple-400" />
                Brand Presets
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link 
                href="/dashboard/brand-presets/profile"
                className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-blue-600/50 hover:bg-blue-900/10 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center group-hover:bg-blue-600/30 transition-colors">
                    <User className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium group-hover:text-blue-400 transition-colors">My Profile</div>
                    <div className="text-xs text-zinc-500">Your personal brand data</div>
                  </div>
                </div>
              </Link>
              
              <Link 
                href="/dashboard/brand-presets/clients"
                className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-purple-600/50 hover:bg-purple-900/10 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center group-hover:bg-purple-600/30 transition-colors">
                    <Building2 className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="font-medium group-hover:text-purple-400 transition-colors">Clients</div>
                    <div className="text-xs text-zinc-500">Saved client presets</div>
                  </div>
                </div>
              </Link>
            </div>
            
            <p className="text-xs text-zinc-500 mt-3">
              Save your brand data once, auto-fill workflows forever.
            </p>
          </section>

          {/* ============================================ */}
          {/* 5. PRO / UPGRADE BOX (COMPACT) */}
          {/* ============================================ */}
          {currentPlan === 'free' ? (
            // Free user: Upgrade box
            <div className="p-4 rounded-xl bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-800/30">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💎</span>
                  <div>
                    <span className="font-semibold">Upgrade to Pro</span>
                    <span className="text-sm text-zinc-400 ml-2 hidden sm:inline">
                      Unlimited workflows · Advanced features · Priority support
                    </span>
                  </div>
                </div>
                <Link href="/pricing">
                  <Button size="sm" className="!bg-purple-600 hover:!bg-purple-700 !text-white">
                    Upgrade
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            // Pro user: Status box
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">👑</span>
                  <span className="font-semibold">Pro Subscription</span>
                  <span className="text-xs px-2 py-0.5 bg-green-900/50 text-green-400 rounded-full">
                    Active
                  </span>
                </div>
                <Link 
                  href="/pricing" 
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Manage subscription →
                </Link>
              </div>
                </div>
              )}

          {/* ============================================ */}
          {/* 6. STATS & ACHIEVEMENTS (2-column grid) */}
          {/* ============================================ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Stats - Left Column */}
            <div className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-zinc-400" />
                Your Stats
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Workflows used</span>
                  <span className="font-medium">{totalWorkflows}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Last active</span>
                  <span className="font-medium">
                    {userStats?.last_used_at 
                      ? formatRelativeTime(userStats.last_used_at)
                      : 'Never'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Favorites</span>
                  <span className="font-medium">{favoritesCount || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Current streak</span>
                  <span className="font-medium">🔥 {userStats?.current_streak || 0} days</span>
                </div>
              </div>
                  </div>

            {/* Achievements - Right Column */}
            <div className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  Achievements
                </h3>
                <span className="text-sm text-zinc-400">{unlockedCount}/{totalAchievements}</span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-zinc-800 rounded-full h-2 mb-4">
                <div 
                  className="bg-yellow-500 h-2 rounded-full transition-all" 
                  style={{ width: `${(unlockedCount / totalAchievements) * 100}%` }}
                />
              </div>

              {/* Recent Unlocked - Show up to 3 icons */}
              <div className="flex items-center gap-2 mb-3">
                {unlockedAchievements?.slice(0, 3).map((ua) => (
                      <div 
                    key={ua.achievement_code}
                    className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-sm"
                    title={ACHIEVEMENTS.find(a => a.code === ua.achievement_code)?.title}
                  >
                    {getAchievementIcon(ua.achievement_code)}
                      </div>
                    ))}
                {lockedCount > 0 && (
                  <div className="w-8 h-8 rounded-full bg-zinc-800/50 flex items-center justify-center text-xs text-zinc-500">
                    +{lockedCount}
                  </div>
                  )}
                </div>
              
              <Link 
                href="/achievements" 
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                View all achievements →
              </Link>
            </div>
        </div>

        </div>
      </div>
    </div>
  );
}
