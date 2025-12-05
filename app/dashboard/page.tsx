import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ACHIEVEMENTS, getAchievementIcon, type Achievement } from '@/lib/achievements';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { AccountSettings } from '@/components/dashboard/AccountSettings';
import { UpgradeToPro } from '@/components/dashboard/UpgradeToPro';
import { SubscriptionManagement } from '@/components/dashboard/SubscriptionManagement';
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

  // Fetch current month usage
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const { count: monthlyUsage } = await supabase
    .from('user_usage')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('used_at', firstDayOfMonth.toISOString());

  // Fetch favorites with workflow data (for Quick Access)
  const { data: favoritesData, count: favoritesCount } = await supabase
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
    `, { count: 'exact' })
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(6);

  // Extract favorite workflows
  const favoriteWorkflows = favoritesData?.map((fav: any) => fav.workflows).filter(Boolean) || [];

  // Fetch recent activity
  const { data: recentUsage } = await supabase
    .from('user_usage')
    .select(`
      id,
      used_at,
      workflow_id,
      workflows:workflow_id (
        title,
        slug
      )
    `)
    .eq('user_id', user.id)
    .order('used_at', { ascending: false })
    .limit(5);

  // Map unlocked achievements
  const unlockedCodes = new Set(unlockedAchievements?.map(a => a.achievement_code) || []);
  const unlockedAchievementsList = (unlockedAchievements || [])
    .map(ua => {
      const achievement = ACHIEVEMENTS.find(a => a.code === ua.achievement_code);
      return achievement ? { ...achievement, unlockedAt: ua.unlocked_at } : null;
    })
    .filter((a): a is Achievement & { unlockedAt: string } => a !== null);

  const lockedAchievements = ACHIEVEMENTS.filter(a => !unlockedCodes.has(a.code));

  const totalWorkflows = userStats?.total_workflows || 0;
  const achievementProgress = (unlockedAchievementsList.length / ACHIEVEMENTS.length) * 100;
  const FREE_USER_LIMIT = 5;

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-12 text-white">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold md:text-5xl">Dashboard</h1>
          <p className="mt-2 text-lg text-zinc-400">
            Welcome back, {user.email?.split('@')[0]}!
          </p>
        </div>

        {/* ============================================ */}
        {/* QUICK ACCESS: Favorites */}
        {/* ============================================ */}
        {favoriteWorkflows.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <h2 className="text-xl font-semibold">Your Favorites</h2>
              </div>
              <Link href="/favorites">
                <Button variant="ghost" size="sm" className="!text-zinc-400 hover:!text-white gap-1">
                  View all <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteWorkflows.slice(0, 3).map((workflow: any) => (
                <Link 
                  key={workflow.id} 
                  href={`/workflows/${workflow.slug}`}
                  className="group"
                >
                  <div className="relative p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-900 transition-all">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{workflow.icon || '📝'}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white group-hover:text-blue-400 transition-colors truncate">
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
          </div>
        )}

        {/* ============================================ */}
        {/* QUICK ACCESS: Continue Where You Left Off */}
        {/* ============================================ */}
        {recentUsage && recentUsage.length > 0 && totalWorkflows > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-zinc-400" />
                <h2 className="text-xl font-semibold">Continue Where You Left Off</h2>
              </div>
              <Link href="/history">
                <Button variant="ghost" size="sm" className="!text-zinc-400 hover:!text-white gap-1">
                  View history <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentUsage.slice(0, 3).map((usage: any) => (
                <Link 
                  key={usage.id} 
                  href={`/workflows/${usage.workflows?.slug}`}
                  className="group"
                >
                  <div className="relative p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-900 transition-all">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white group-hover:text-blue-400 transition-colors truncate">
                          {usage.workflows?.title || 'Workflow'}
                        </h3>
                        <p className="text-xs text-zinc-500 mt-1">
                          {formatDistanceToNow(new Date(usage.used_at), { addSuffix: true })}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        <Play className="h-3 w-3" /> Continue
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Show onboarding if no workflows used */}
        {totalWorkflows === 0 ? (
          <Card className="border-zinc-800 bg-zinc-900 mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">🎉 Welcome to PromptFinder!</CardTitle>
              <CardDescription>
                You haven't used any workflows yet. Start exploring now!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/workflows">
                <Button size="lg" className="!bg-blue-600 hover:!bg-blue-700 !text-white">
                  Browse Workflows
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : null}

        {/* Subscription Section */}
        <div className="mb-8">
          {currentPlan === 'free' ? (
            <UpgradeToPro currentPlan={currentPlan} monthlyUsage={monthlyUsage || 0} />
          ) : (
            <SubscriptionManagement details={subscriptionDetails} />
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Card 1: Usage Stats */}
          <Card className="border-zinc-800 bg-zinc-900">
            <CardHeader>
              <CardTitle>Your Stats</CardTitle>
              <CardDescription>Your usage statistics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Total workflows */}
              <div>
                <p className="text-sm text-zinc-400 mb-1">Total Workflows Used</p>
                <p className="text-5xl font-bold text-white">{totalWorkflows}</p>
              </div>

              {/* Current month usage */}
              <div>
                <p className="text-sm text-zinc-400 mb-2">This Month's Usage</p>
                <div className="flex items-center gap-3">
                  {/* Simple progress bar without radix */}
                  <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        currentPlan !== 'free'
                          ? 'bg-gradient-to-r from-purple-600 to-pink-500'
                          : (monthlyUsage || 0) > FREE_USER_LIMIT
                          ? 'bg-gradient-to-r from-red-600 to-orange-500'
                          : 'bg-gradient-to-r from-blue-600 to-blue-500'
                      }`}
                      style={{ 
                        width: currentPlan !== 'free' 
                          ? '100%' 
                          : `${Math.min(100, (monthlyUsage || 0) / FREE_USER_LIMIT * 100)}%` 
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {currentPlan !== 'free' ? (
                      <span className="text-purple-400 font-semibold">∞ Unlimited</span>
                    ) : (monthlyUsage || 0) > FREE_USER_LIMIT ? (
                      <span className="text-red-400 font-semibold">{monthlyUsage}/{FREE_USER_LIMIT} ⚠️</span>
                    ) : (
                      <>{monthlyUsage || 0}/{FREE_USER_LIMIT}</>
                    )}
                  </span>
                </div>
              </div>

              {/* Last used */}
              {userStats?.last_used_at && (
                <div>
                  <p className="text-sm text-zinc-400">Last Used</p>
                  <p className="text-base font-medium">
                    {formatDistanceToNow(new Date(userStats.last_used_at), { 
                      addSuffix: true
                    })}
                  </p>
                </div>
              )}

              {/* Favorites count - clickable */}
              <Link href="/favorites" className="block pt-3 border-t border-zinc-800 mt-3 group">
                <p className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors flex items-center gap-1">
                  <Star className="h-3.5 w-3.5" /> Favorites
                </p>
                <p className="text-2xl font-bold group-hover:text-blue-400 transition-colors">
                  {favoritesCount || 0}
                </p>
              </Link>

              {/* Current streak - ALWAYS show */}
              <div className="pt-3 border-t border-zinc-800 mt-3">
                <p className="text-sm text-zinc-400">Current Streak 🔥</p>
                {userStats?.current_streak && userStats.current_streak > 0 ? (
                  <p className="text-2xl font-bold text-orange-400">
                    {userStats.current_streak} {userStats.current_streak === 1 ? 'day' : 'days'}
                  </p>
                ) : (
                  <div>
                    <p className="text-2xl font-bold text-zinc-600">0 days</p>
                    <p className="text-xs text-zinc-500 mt-1">Use a workflow today to start your streak!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Achievements */}
          <Card className="border-zinc-800 bg-zinc-900">
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
              <CardDescription>
                {unlockedAchievementsList.length}/{ACHIEVEMENTS.length} unlocked 
                ({Math.round(achievementProgress)}%)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress bar */}
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-600 to-amber-500 transition-all duration-500"
                  style={{ width: `${achievementProgress}%` }}
                />
              </div>

              {/* Unlocked achievements */}
              {unlockedAchievementsList.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-zinc-300">Unlocked</p>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {unlockedAchievementsList.map((achievement) => (
                      <div 
                        key={achievement.code}
                        className="flex items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-950 p-3"
                      >
                        <span className="text-2xl">{getAchievementIcon(achievement.code)}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-white">
                            {achievement.title}
                          </p>
                          <p className="text-xs text-zinc-400">
                            {achievement.description}
                          </p>
                          <p className="text-xs text-zinc-500 mt-1">
                            {formatDistanceToNow(new Date(achievement.unlockedAt), { 
                              addSuffix: true
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Locked achievements */}
              {lockedAchievements.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-zinc-500">Locked</p>
                  <div className="space-y-2">
                    {lockedAchievements.slice(0, 3).map((achievement) => (
                      <div 
                        key={achievement.code}
                        className="flex items-start gap-3 rounded-lg border border-zinc-800/50 bg-zinc-950/50 p-3 opacity-50"
                      >
                        <span className="text-2xl grayscale">
                          {getAchievementIcon(achievement.code)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-zinc-400">
                            {achievement.title}
                          </p>
                          <p className="text-xs text-zinc-500">
                            {achievement.description}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          🔒
                        </Badge>
                      </div>
                    ))}
                  </div>
                  {lockedAchievements.length > 3 && (
                    <p className="text-xs text-zinc-500 text-center">
                      +{lockedAchievements.length - 3} more
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

        </div>

        {/* Account Settings Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
          <AccountSettings userId={user.id} userEmail={user.email || ''} />
        </div>
      </div>
    </div>
  );
}

