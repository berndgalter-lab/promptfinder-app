import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ACHIEVEMENTS, getAchievementIcon } from '@/lib/achievements';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { getUserPlan, getSubscriptionDetails } from '@/lib/subscription';
import { Star, Clock, ArrowRight, Play } from 'lucide-react';

// Force dynamic rendering - no caching for subscription status
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardPage() {
  const user = await getUser();

  // Redirect if not logged in
  if (!user) {
    redirect('/');
  }

  const supabase = await createClient();

  // Fetch user subscription/plan
  const currentPlan = await getUserPlan(user.id);
  
  // Fetch detailed subscription info
  const subscriptionDetails = await getSubscriptionDetails(user.id);

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

  // Fetch favorites with workflow data
  const { data: favoritesData } = await supabase
    .from('user_favorites')
    .select(`
      id,
      workflow_id,
      created_at,
      workflows:workflow_id (
        id,
        title,
        slug,
        description,
        icon
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(6);

  // Extract favorite workflows
  const favoriteWorkflows = favoritesData?.map((fav: any) => fav.workflows).filter(Boolean) || [];

  // Fetch recent history (last 5 used workflows)
  const { data: recentHistory } = await supabase
    .from('user_usage')
    .select(`
      id,
      used_at,
      workflow_id,
      workflows:workflow_id (
        id,
        title,
        slug,
        icon
      )
    `)
    .eq('user_id', user.id)
    .order('used_at', { ascending: false })
    .limit(5);

  // Map unlocked achievements
  const unlockedCodes = new Set(unlockedAchievements?.map(a => a.achievement_code) || []);
  const unlockedCount = unlockedCodes.size;
  const totalAchievements = ACHIEVEMENTS.length;
  const achievementProgress = (unlockedCount / totalAchievements) * 100;

  const totalWorkflows = userStats?.total_workflows || 0;
  const username = user.email?.split('@')[0] || 'there';

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-12 text-white">
      <div className="mx-auto max-w-6xl space-y-8">
        
        {/* ============================================ */}
        {/* 1. HEADER */}
        {/* ============================================ */}
        <header>
          <h1 className="text-3xl font-bold md:text-4xl">Dashboard</h1>
          <p className="mt-2 text-lg text-zinc-400">
            Welcome back, {username}!
          </p>
        </header>

        {/* ============================================ */}
        {/* 2. CONTINUE WHERE YOU LEFT OFF (History) */}
        {/* ============================================ */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-zinc-400" />
              Continue Where You Left Off
            </h2>
            <Link 
              href="/history" 
              className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
            >
              View full history <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          {recentHistory && recentHistory.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {recentHistory.map((usage: any) => (
                <Link 
                  key={usage.id} 
                  href={`/workflows/${usage.workflows?.slug}`}
                  className="group"
                >
                  <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:border-zinc-600 hover:bg-zinc-900 transition-all">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xl">{usage.workflows?.icon || '📝'}</span>
                      <h3 className="font-medium text-sm text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                        {usage.workflows?.title || 'Workflow'}
                      </h3>
                    </div>
                    <p className="text-xs text-zinc-500">
                      Used {formatDistanceToNow(new Date(usage.used_at), { addSuffix: false })} ago
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-xl border border-zinc-800 bg-zinc-900/50 text-center">
              <p className="text-zinc-500 mb-4">You haven't used any workflows yet.</p>
              <Link href="/workflows">
                <Button className="!bg-blue-600 hover:!bg-blue-700 !text-white">
                  Browse workflows to get started
                </Button>
              </Link>
            </div>
          )}
        </section>

        {/* ============================================ */}
        {/* 3. YOUR FAVORITES */}
        {/* ============================================ */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              Your Favorites
            </h2>
            <Link 
              href="/favorites" 
              className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          {favoriteWorkflows.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteWorkflows.slice(0, 6).map((workflow: any) => (
                <Link 
                  key={workflow.id} 
                  href={`/workflows/${workflow.slug}`}
                  className="group"
                >
                  <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:border-zinc-600 hover:bg-zinc-900 transition-all">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{workflow.icon || '📝'}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                          {workflow.title}
                        </h3>
                        <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
                          {workflow.description}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <span className="inline-flex items-center gap-1 text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="h-3 w-3" /> Start workflow
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 text-center">
              <p className="text-zinc-500">
                No favorites yet. <Link href="/workflows" className="text-blue-400 hover:text-blue-300">Star workflows</Link> to save them here.
              </p>
            </div>
          )}
        </section>

        {/* ============================================ */}
        {/* 4. PRO SUBSCRIPTION / UPGRADE BOX (COMPACT) */}
        {/* ============================================ */}
        {currentPlan === 'free' ? (
          // Free user: Compact upgrade box
          <div className="p-4 rounded-xl bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-800/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="font-semibold text-white">Upgrade to Pro</span>
                <span className="text-sm text-zinc-400 ml-2 hidden sm:inline">
                  Unlimited workflows · Advanced features · Priority support
                </span>
                <p className="text-sm text-zinc-400 sm:hidden mt-1">
                  Unlimited workflows · Advanced features
                </p>
              </div>
              <Link href="/pricing">
                <Button className="!bg-purple-600 hover:!bg-purple-700 !text-white whitespace-nowrap">
                  Upgrade
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          // Pro user: Compact status box
          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-yellow-500">👑</span>
                <span className="font-semibold text-white">Pro Subscription</span>
                <span className="text-xs px-2 py-0.5 bg-green-900/50 text-green-400 rounded border border-green-800/50">
                  {subscriptionDetails?.status === 'active' ? 'Active' : subscriptionDetails?.status || 'Active'}
                </span>
              </div>
              <Link 
                href="/dashboard" 
                className="text-sm text-zinc-400 hover:text-white transition-colors"
                onClick={(e) => {
                  // Will be updated to /settings when that page exists
                }}
              >
                Manage →
              </Link>
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* 5. STATS & ACHIEVEMENTS (Compact, side by side) */}
        {/* ============================================ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Stats */}
          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
            <h3 className="font-semibold mb-3">Your Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-400">Workflows used</span>
                <span className="text-white font-medium">{totalWorkflows}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Last active</span>
                <span className="text-white">
                  {userStats?.last_used_at 
                    ? formatDistanceToNow(new Date(userStats.last_used_at), { addSuffix: false }) + ' ago'
                    : 'Never'
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Favorites</span>
                <span className="text-white">{favoriteWorkflows.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Current streak</span>
                <span className="text-white">
                  🔥 {userStats?.current_streak || 0} days
                </span>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Achievements</h3>
              <span className="text-sm text-zinc-400">{unlockedCount}/{totalAchievements} unlocked</span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-zinc-800 rounded-full h-2 mb-3">
              <div 
                className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${achievementProgress}%` }}
              />
            </div>

            {/* Recent unlocked (show up to 2) */}
            {unlockedCount > 0 && (
              <div className="flex items-center gap-2 mb-3">
                {unlockedAchievements?.slice(0, 3).map((ua) => (
                  <span 
                    key={ua.achievement_code} 
                    className="text-xl"
                    title={ACHIEVEMENTS.find(a => a.code === ua.achievement_code)?.title}
                  >
                    {getAchievementIcon(ua.achievement_code)}
                  </span>
                ))}
                {unlockedCount > 3 && (
                  <span className="text-xs text-zinc-500">+{unlockedCount - 3} more</span>
                )}
              </div>
            )}

            <Link 
              href="/dashboard#achievements" 
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              View all achievements →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
