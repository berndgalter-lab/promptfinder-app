import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ACHIEVEMENTS, getAchievementIcon, type Achievement } from '@/lib/achievements';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';
import Link from 'next/link';
import { AccountSettings } from '@/components/dashboard/AccountSettings';
import { UpgradeToPro } from '@/components/dashboard/UpgradeToPro';
import { getUserPlan } from '@/lib/subscription';

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

  // Fetch favorites count
  const { count: favoritesCount } = await supabase
    .from('user_favorites')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

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
            Willkommen zurück, {user.email?.split('@')[0]}!
          </p>
        </div>

        {/* Show onboarding if no workflows used */}
        {totalWorkflows === 0 ? (
          <Card className="border-zinc-800 bg-zinc-900 mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">🎉 Willkommen bei PromptFinder!</CardTitle>
              <CardDescription>
                Du hast noch keinen Workflow verwendet. Starte jetzt!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/workflows">
                <Button size="lg" className="!bg-blue-600 hover:!bg-blue-700 !text-white">
                  Workflows durchsuchen
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : null}

        {/* Upgrade to Pro Section */}
        <div className="mb-8">
          <UpgradeToPro currentPlan={currentPlan} monthlyUsage={monthlyUsage || 0} />
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Card 1: Usage Stats */}
          <Card className="border-zinc-800 bg-zinc-900">
            <CardHeader>
              <CardTitle>Deine Stats</CardTitle>
              <CardDescription>Deine Nutzungsstatistiken</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Total workflows */}
              <div>
                <p className="text-sm text-zinc-400 mb-1">Gesamt verwendete Workflows</p>
                <p className="text-5xl font-bold text-white">{totalWorkflows}</p>
              </div>

              {/* Current month usage */}
              <div>
                <p className="text-sm text-zinc-400 mb-2">Nutzung diesen Monat</p>
                <div className="flex items-center gap-3">
                  {/* Simple progress bar without radix */}
                  <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-600 to-blue-500 transition-all duration-500"
                      style={{ width: `${Math.min(100, (monthlyUsage || 0) / FREE_USER_LIMIT * 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {monthlyUsage || 0}/{FREE_USER_LIMIT}
                  </span>
                </div>
              </div>

              {/* Last used */}
              {userStats?.last_used_at && (
                <div>
                  <p className="text-sm text-zinc-400">Zuletzt verwendet</p>
                  <p className="text-base font-medium">
                    {formatDistanceToNow(new Date(userStats.last_used_at), { 
                      addSuffix: true,
                      locale: de 
                    })}
                  </p>
                </div>
              )}

              {/* Favorites count */}
              <div>
                <p className="text-sm text-zinc-400">Favoriten</p>
                <p className="text-2xl font-bold">{favoritesCount || 0}</p>
              </div>

              {/* Current streak */}
              {userStats?.current_streak && userStats.current_streak > 0 && (
                <div className="pt-2 border-t border-zinc-800">
                  <p className="text-sm text-zinc-400">Aktuelle Serie</p>
                  <p className="text-2xl font-bold">
                    🔥 {userStats.current_streak} {userStats.current_streak === 1 ? 'Tag' : 'Tage'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card 2: Achievements */}
          <Card className="border-zinc-800 bg-zinc-900">
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
              <CardDescription>
                {unlockedAchievementsList.length}/{ACHIEVEMENTS.length} freigeschaltet 
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
                  <p className="text-sm font-semibold text-zinc-300">Freigeschaltet</p>
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
                              addSuffix: true,
                              locale: de 
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
                  <p className="text-sm font-semibold text-zinc-500">Noch nicht freigeschaltet</p>
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
                      +{lockedAchievements.length - 3} weitere
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card 3: Recent Activity */}
          {recentUsage && recentUsage.length > 0 && (
            <Card className="border-zinc-800 bg-zinc-900 md:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Letzte Aktivität</CardTitle>
                  <CardDescription>Deine zuletzt verwendeten Workflows</CardDescription>
                </div>
                <Link href="/history">
                  <Button variant="outline" size="sm" className="!text-white !border-zinc-700 hover:!bg-zinc-800">
                    Alle anzeigen
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentUsage.map((usage: any) => (
                    <div 
                      key={usage.id}
                      className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950 p-3 hover:border-zinc-700 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <Link 
                          href={`/workflows/${usage.workflows?.slug}`}
                          className="font-medium text-white hover:text-blue-400 transition-colors"
                        >
                          {usage.workflows?.title || 'Workflow'}
                        </Link>
                        <p className="text-xs text-zinc-500 mt-1">
                          {formatDistanceToNow(new Date(usage.used_at), { 
                            addSuffix: true,
                            locale: de 
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
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

