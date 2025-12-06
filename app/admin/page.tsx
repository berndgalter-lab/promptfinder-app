import { createClient, createAdminClient } from '@/lib/supabase/server';
import { getUserWithAdminStatus } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Zap, 
  TrendingUp, 
  DollarSign, 
  Star, 
  Activity,
  Calendar,
  Crown,
  UserCheck,
  BarChart3,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Eye
} from 'lucide-react';

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Types
interface DailyUsage {
  date: string;
  workflows: number;
  unique_users: number;
  anonymous: number;
  logged_in: number;
}

interface TopWorkflow {
  id: string;
  title: string;
  slug: string;
  usage_count: number;
}

interface RecentActivity {
  id: string;
  workflow_title: string;
  workflow_slug: string;
  used_at: string;
  user_id: string;
}

interface ActiveUser {
  user_id: string;
  workflow_count: number;
  last_active: string;
}

// Time period helpers
type TimePeriod = 'today' | '7days' | '30days' | 'all';

function getDateRange(period: TimePeriod): { start: Date; label: string } {
  const now = new Date();
  switch (period) {
    case 'today':
      return { 
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate()), 
        label: 'Heute' 
      };
    case '7days':
      return { 
        start: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), 
        label: '7 Tage' 
      };
    case '30days':
      return { 
        start: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), 
        label: '30 Tage' 
      };
    case 'all':
    default:
      return { 
        start: new Date(0), 
        label: 'Gesamt' 
      };
  }
}

interface PageProps {
  searchParams: Promise<{ period?: string }>;
}

export default async function AdminDashboardPage({ searchParams }: PageProps) {
  const { user, isAdmin } = await getUserWithAdminStatus();

  if (!user || !isAdmin) {
    redirect('/');
  }

  const resolvedParams = await searchParams;
  const period = (resolvedParams.period as TimePeriod) || '30days';
  const { start: periodStart, label: periodLabel } = getDateRange(period);

  // Use admin client to bypass RLS and see all user data
  const supabase = createAdminClient();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  // ============================================
  // GLOBAL METRICS (unabhängig vom Zeitraum)
  // ============================================

  // Total registered users (all time)
  const { count: totalUsers } = await supabase
    .from('user_stats')
    .select('*', { count: 'exact', head: true });

  // Pro subscribers
  const { data: proSubscribers, count: proCount } = await supabase
    .from('subscriptions')
    .select('*', { count: 'exact' })
    .in('status', ['active', 'past_due']);

  // MRR
  const monthlyRevenue = proSubscribers?.reduce((acc, sub) => {
    if (sub.status === 'active' || sub.status === 'past_due') {
      const monthlyAmount = sub.plan_type === 'annual' 
        ? (sub.amount || 0) / 12 
        : (sub.amount || 0);
      return acc + monthlyAmount;
    }
    return acc;
  }, 0) || 0;

  // Total workflows all time (logged-in users only)
  const { count: totalWorkflowsAllTime } = await supabase
    .from('user_usage')
    .select('*', { count: 'exact', head: true });

  // ============================================
  // ANONYMOUS AGGREGATED STATS (DSGVO-konform)
  // ============================================
  
  // Global anonymous stats (all time)
  const { data: globalAnonymousStats } = await supabase
    .from('global_daily_stats')
    .select('total_anonymous, total_logged_in');
  
  const totalAnonymousAllTime = globalAnonymousStats?.reduce((acc, s) => acc + (s.total_anonymous || 0), 0) || 0;
  
  // Anonymous stats for today
  const todayStr = today.toISOString().split('T')[0];
  const { data: todayAnonymousData } = await supabase
    .from('global_daily_stats')
    .select('total_anonymous')
    .eq('date', todayStr)
    .single();
  
  const anonymousToday = todayAnonymousData?.total_anonymous || 0;
  
  // Anonymous stats for this week
  const { data: weekAnonymousData } = await supabase
    .from('global_daily_stats')
    .select('total_anonymous, date')
    .gte('date', weekStart.toISOString().split('T')[0]);
  
  const anonymousThisWeek = weekAnonymousData?.reduce((acc, s) => acc + (s.total_anonymous || 0), 0) || 0;
  
  // Anonymous stats for selected period
  const { data: periodAnonymousData } = await supabase
    .from('global_daily_stats')
    .select('total_anonymous, date')
    .gte('date', periodStart.toISOString().split('T')[0]);
  
  const anonymousInPeriod = periodAnonymousData?.reduce((acc, s) => acc + (s.total_anonymous || 0), 0) || 0;

  // ============================================
  // PERIOD-SPECIFIC METRICS
  // ============================================

  // Workflows in selected period
  const { data: periodUsageData } = await supabase
    .from('user_usage')
    .select('id, user_id, workflow_id, used_at')
    .gte('used_at', periodStart.toISOString())
    .order('used_at', { ascending: false });

  const workflowsInPeriod = periodUsageData?.length || 0;
  const uniqueUsersInPeriod = new Set(periodUsageData?.map(d => d.user_id)).size;

  // Today's stats (always show)
  const { data: todayUsageData } = await supabase
    .from('user_usage')
    .select('id, user_id')
    .gte('used_at', today.toISOString());

  const workflowsToday = todayUsageData?.length || 0;
  const uniqueUsersToday = new Set(todayUsageData?.map(d => d.user_id)).size;

  // This week stats
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const { data: weekUsageData } = await supabase
    .from('user_usage')
    .select('id, user_id')
    .gte('used_at', weekStart.toISOString());

  const workflowsThisWeek = weekUsageData?.length || 0;
  const uniqueUsersThisWeek = new Set(weekUsageData?.map(d => d.user_id)).size;

  // ============================================
  // TOP WORKFLOWS (in selected period)
  // ============================================

  const workflowCounts: Record<string, number> = {};
  periodUsageData?.forEach(u => {
    workflowCounts[u.workflow_id] = (workflowCounts[u.workflow_id] || 0) + 1;
  });

  const topWorkflowIds = Object.entries(workflowCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([id]) => id);

  const { data: workflowDetails } = await supabase
    .from('workflows')
    .select('id, title, slug')
    .in('id', topWorkflowIds.length > 0 ? topWorkflowIds : ['none']);

  const topWorkflows: TopWorkflow[] = topWorkflowIds.map(id => {
    const workflow = workflowDetails?.find(w => w.id === id);
    return {
      id,
      title: workflow?.title || 'Unknown',
      slug: workflow?.slug || '',
      usage_count: workflowCounts[id] || 0
    };
  });

  // ============================================
  // RECENT ACTIVITIES (last 20)
  // ============================================

  const { data: recentUsageRaw } = await supabase
    .from('user_usage')
    .select(`
      id,
      user_id,
      used_at,
      workflow_id,
      workflows:workflow_id (title, slug)
    `)
    .order('used_at', { ascending: false })
    .limit(20);

  const recentActivities: RecentActivity[] = (recentUsageRaw || [])
    .filter((r: any) => r.workflows)
    .map((r: any) => ({
      id: r.id,
      workflow_title: r.workflows.title,
      workflow_slug: r.workflows.slug,
      used_at: r.used_at,
      user_id: r.user_id
    }));

  // ============================================
  // ACTIVE USERS (in selected period)
  // ============================================

  const userActivityMap: Record<string, { count: number; lastActive: string }> = {};
  periodUsageData?.forEach(u => {
    if (!userActivityMap[u.user_id]) {
      userActivityMap[u.user_id] = { count: 0, lastActive: u.used_at };
    }
    userActivityMap[u.user_id].count++;
    if (new Date(u.used_at) > new Date(userActivityMap[u.user_id].lastActive)) {
      userActivityMap[u.user_id].lastActive = u.used_at;
    }
  });

  const activeUsers: ActiveUser[] = Object.entries(userActivityMap)
    .map(([user_id, data]) => ({
      user_id,
      workflow_count: data.count,
      last_active: data.lastActive
    }))
    .sort((a, b) => b.workflow_count - a.workflow_count)
    .slice(0, 10);

  // ============================================
  // DAILY CHART DATA (last 14 days) - inkl. anonym
  // ============================================

  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgoStr = fourteenDaysAgo.toISOString().split('T')[0];
  
  // Logged-in user data
  const { data: dailyUsageRaw } = await supabase
    .from('user_usage')
    .select('used_at, user_id')
    .gte('used_at', fourteenDaysAgo.toISOString())
    .order('used_at', { ascending: true });

  // Anonymous aggregated data (DSGVO-konform)
  const { data: dailyAnonymousRaw } = await supabase
    .from('global_daily_stats')
    .select('date, total_anonymous, total_logged_in')
    .gte('date', fourteenDaysAgoStr)
    .order('date', { ascending: true });

  const dailyUsageMap: Record<string, { workflows: number; users: Set<string>; anonymous: number; logged_in: number }> = {};
  
  // Initialize all 14 days
  for (let i = 13; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];
    dailyUsageMap[dateStr] = { workflows: 0, users: new Set(), anonymous: 0, logged_in: 0 };
  }
  
  // Add logged-in user data
  dailyUsageRaw?.forEach(u => {
    const date = new Date(u.used_at).toISOString().split('T')[0];
    if (dailyUsageMap[date]) {
      dailyUsageMap[date].workflows++;
      dailyUsageMap[date].users.add(u.user_id);
      dailyUsageMap[date].logged_in++;
    }
  });

  // Add anonymous data from aggregated stats
  dailyAnonymousRaw?.forEach(d => {
    if (dailyUsageMap[d.date]) {
      dailyUsageMap[d.date].anonymous = d.total_anonymous || 0;
    }
  });

  const dailyUsage: DailyUsage[] = Object.entries(dailyUsageMap)
    .map(([date, data]) => ({
      date,
      workflows: data.logged_in + data.anonymous, // Total = logged-in + anonymous
      unique_users: data.users.size,
      anonymous: data.anonymous,
      logged_in: data.logged_in
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // ============================================
  // COMPARISON STATS
  // ============================================

  const { count: workflowsLastMonth } = await supabase
    .from('user_usage')
    .select('*', { count: 'exact', head: true })
    .gte('used_at', firstDayOfLastMonth.toISOString())
    .lt('used_at', firstDayOfMonth.toISOString());

  const { count: workflowsThisMonth } = await supabase
    .from('user_usage')
    .select('*', { count: 'exact', head: true })
    .gte('used_at', firstDayOfMonth.toISOString());

  const monthGrowth = workflowsLastMonth && workflowsLastMonth > 0
    ? Math.round(((workflowsThisMonth || 0) - workflowsLastMonth) / workflowsLastMonth * 100)
    : 0;

  const conversionRate = totalUsers && totalUsers > 0
    ? ((proCount || 0) / totalUsers * 100).toFixed(1)
    : '0';

  // Total favorites
  const { count: totalFavorites } = await supabase
    .from('user_favorites')
    .select('*', { count: 'exact', head: true });

  // Time formatting helper
  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'gerade eben';
    if (seconds < 3600) return `vor ${Math.floor(seconds / 60)} Min`;
    if (seconds < 86400) return `vor ${Math.floor(seconds / 3600)} Std`;
    return `vor ${Math.floor(seconds / 86400)} Tagen`;
  };

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="h-8 w-8 text-blue-500" />
              <h1 className="text-3xl md:text-4xl font-bold">Admin Dashboard</h1>
            </div>
            <p className="text-zinc-400">
              {now.toLocaleDateString('de-DE', { 
                weekday: 'long', 
                day: 'numeric',
                month: 'long', 
                year: 'numeric' 
              })} • {now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <Link href="/admin">
            <Button variant="outline" size="sm" className="gap-2 !border-zinc-700 !text-zinc-300 hover:!bg-zinc-800">
              <RefreshCw className="h-4 w-4" />
              Aktualisieren
            </Button>
          </Link>
        </div>

        {/* Period Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 p-1 bg-zinc-900 rounded-lg w-fit">
          {[
            { key: 'today', label: 'Heute' },
            { key: '7days', label: '7 Tage' },
            { key: '30days', label: '30 Tage' },
            { key: 'all', label: 'Gesamt' },
          ].map((tab) => (
            <Link
              key={tab.key}
              href={`/admin?period=${tab.key}`}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                period === tab.key
                  ? 'bg-blue-600 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
          <div className="text-center">
            <p className="text-2xl md:text-3xl font-bold text-blue-400">{workflowsToday + anonymousToday}</p>
            <p className="text-xs text-zinc-500">Workflows heute</p>
            <p className="text-xs text-zinc-600">{workflowsToday} 👤 + {anonymousToday} 👻</p>
          </div>
          <div className="text-center">
            <p className="text-2xl md:text-3xl font-bold text-cyan-400">{uniqueUsersToday}</p>
            <p className="text-xs text-zinc-500">Eingeloggte User</p>
          </div>
          <div className="text-center">
            <p className="text-2xl md:text-3xl font-bold text-purple-400">{workflowsThisWeek + anonymousThisWeek}</p>
            <p className="text-xs text-zinc-500">Workflows diese Woche</p>
            <p className="text-xs text-zinc-600">{workflowsThisWeek} 👤 + {anonymousThisWeek} 👻</p>
          </div>
          <div className="text-center">
            <p className="text-2xl md:text-3xl font-bold text-green-400">{uniqueUsersThisWeek}</p>
            <p className="text-xs text-zinc-500">Eingeloggte User</p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* MRR */}
          <Card className="border-zinc-800 bg-gradient-to-br from-green-950/50 to-zinc-900">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-zinc-400 mb-1 uppercase tracking-wide">MRR</p>
                  <p className="text-2xl md:text-3xl font-bold text-green-400">
                    €{(monthlyRevenue / 100).toFixed(0)}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">{proCount || 0} Pro User</p>
                </div>
                <DollarSign className="h-6 w-6 text-green-500/40" />
              </div>
            </CardContent>
          </Card>

          {/* Workflows im Zeitraum */}
          <Card className="border-zinc-800 bg-gradient-to-br from-blue-950/50 to-zinc-900">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-zinc-400 mb-1 uppercase tracking-wide">Workflows ({periodLabel})</p>
                  <p className="text-2xl md:text-3xl font-bold text-blue-400">{workflowsInPeriod + anonymousInPeriod}</p>
                  <p className="text-xs text-zinc-500 mt-1">{workflowsInPeriod} 👤 + {anonymousInPeriod} 👻</p>
                </div>
                <Zap className="h-6 w-6 text-blue-500/40" />
              </div>
            </CardContent>
          </Card>

          {/* Registrierte User */}
          <Card className="border-zinc-800 bg-gradient-to-br from-purple-950/50 to-zinc-900">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-zinc-400 mb-1 uppercase tracking-wide">Registrierte User</p>
                  <p className="text-2xl md:text-3xl font-bold text-purple-400">{totalUsers || 0}</p>
                  <p className="text-xs text-zinc-500 mt-1">{conversionRate}% Pro</p>
                </div>
                <Users className="h-6 w-6 text-purple-500/40" />
              </div>
            </CardContent>
          </Card>

          {/* Total Workflows */}
          <Card className="border-zinc-800 bg-gradient-to-br from-amber-950/50 to-zinc-900">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-zinc-400 mb-1 uppercase tracking-wide">Total Workflows</p>
                  <p className="text-2xl md:text-3xl font-bold text-amber-400">{(totalWorkflowsAllTime || 0) + totalAnonymousAllTime}</p>
                  <p className="text-xs text-zinc-500 mt-1">{totalWorkflowsAllTime || 0} 👤 + {totalAnonymousAllTime} 👻</p>
                </div>
                <TrendingUp className="h-6 w-6 text-amber-500/40" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Top Workflows */}
          <Card className="border-zinc-800 bg-zinc-900 lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Zap className="h-5 w-5 text-yellow-500" />
                Top Workflows
              </CardTitle>
              <CardDescription>Meistgenutzt ({periodLabel})</CardDescription>
            </CardHeader>
            <CardContent>
              {topWorkflows.length === 0 ? (
                <p className="text-zinc-500 text-center py-8">Keine Daten im Zeitraum</p>
              ) : (
                <div className="space-y-2">
                  {topWorkflows.slice(0, 8).map((workflow, index) => (
                    <div 
                      key={workflow.id}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`text-sm font-bold w-5 ${
                          index === 0 ? 'text-yellow-500' : 
                          index === 1 ? 'text-zinc-400' : 
                          index === 2 ? 'text-amber-700' : 'text-zinc-600'
                        }`}>
                          {index + 1}
                        </span>
                        <span className="text-sm truncate">{workflow.title}</span>
                      </div>
                      <Badge variant="secondary" className="bg-zinc-800 text-xs shrink-0 ml-2">
                        {workflow.usage_count}×
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Daily Chart */}
          <Card className="border-zinc-800 bg-zinc-900 lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-blue-500" />
                Tägliche Nutzung
              </CardTitle>
              <CardDescription className="flex items-center gap-4">
                <span>Letzte 14 Tage</span>
                <span className="text-xs">👤 = Eingeloggt | 👻 = Anonym (DSGVO-konform)</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1.5">
                {dailyUsage.map((day) => {
                  const maxWorkflows = Math.max(...dailyUsage.map(d => d.workflows), 1);
                  const percentage = (day.workflows / maxWorkflows) * 100;
                  const isToday = day.date === today.toISOString().split('T')[0];
                  return (
                    <div key={day.date} className={`flex items-center gap-2 p-1.5 rounded ${isToday ? 'bg-blue-950/30' : ''}`}>
                      <span className={`text-xs w-16 ${isToday ? 'text-blue-400 font-medium' : 'text-zinc-500'}`}>
                        {new Date(day.date).toLocaleDateString('de-DE', { 
                          weekday: 'short', 
                          day: 'numeric',
                          month: 'short'
                        })}
                      </span>
                      <div className="flex-1 h-5 bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            isToday 
                              ? 'bg-gradient-to-r from-blue-500 to-cyan-400' 
                              : 'bg-gradient-to-r from-zinc-600 to-zinc-500'
                          }`}
                          style={{ width: `${Math.max(percentage, 2)}%` }}
                        />
                      </div>
                      <span className={`text-sm font-medium w-8 text-right ${isToday ? 'text-blue-400' : ''}`}>
                        {day.workflows}
                      </span>
                      <span className="text-xs text-zinc-500 w-20 text-right" title="👤 Eingeloggt + 👻 Anonym">
                        {day.logged_in}👤 {day.anonymous}👻
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Recent Activity */}
          <Card className="border-zinc-800 bg-zinc-900">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-cyan-500" />
                Letzte Aktivitäten
              </CardTitle>
              <CardDescription>Live Feed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {recentActivities.length === 0 ? (
                  <p className="text-zinc-500 text-center py-8">Keine Aktivitäten</p>
                ) : (
                  recentActivities.map((activity) => (
                    <div 
                      key={activity.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-zinc-950 border border-zinc-800"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-xs font-bold shrink-0">
                          {activity.user_id.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{activity.workflow_title}</p>
                          <p className="text-xs text-zinc-500">
                            User: {activity.user_id.slice(0, 8)}...
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-zinc-500 shrink-0 ml-2">
                        {formatTimeAgo(activity.used_at)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Active Users */}
          <Card className="border-zinc-800 bg-zinc-900">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <UserCheck className="h-5 w-5 text-green-500" />
                Aktivste User
              </CardTitle>
              <CardDescription>Top 10 ({periodLabel})</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {activeUsers.length === 0 ? (
                  <p className="text-zinc-500 text-center py-8">Keine Daten im Zeitraum</p>
                ) : (
                  activeUsers.map((user, index) => (
                    <div 
                      key={user.user_id}
                      className="flex items-center justify-between p-3 rounded-lg bg-zinc-950 border border-zinc-800"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-bold w-5 ${
                          index === 0 ? 'text-yellow-500' : 
                          index === 1 ? 'text-zinc-400' : 
                          index === 2 ? 'text-amber-700' : 'text-zinc-600'
                        }`}>
                          {index + 1}
                        </span>
                        <div>
                          <p className="text-sm font-mono">{user.user_id.slice(0, 12)}...</p>
                          <p className="text-xs text-zinc-500">
                            Zuletzt: {formatTimeAgo(user.last_active)}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-green-600/20 text-green-400 border-green-600/30">
                        {user.workflow_count} Workflows
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Subscription Breakdown */}
          <Card className="border-zinc-800 bg-zinc-900">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Crown className="h-5 w-5 text-purple-500" />
                Subscriptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-purple-950/30 border border-purple-900/50">
                  <span className="text-sm">Monthly Pro</span>
                  <span className="font-bold text-purple-400">
                    {proSubscribers?.filter(s => s.plan_type === 'monthly').length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-amber-950/30 border border-amber-900/50">
                  <span className="text-sm">Annual Pro</span>
                  <span className="font-bold text-amber-400">
                    {proSubscribers?.filter(s => s.plan_type === 'annual').length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                  <span className="text-sm">Free User</span>
                  <span className="font-bold text-zinc-400">
                    {(totalUsers || 0) - (proCount || 0)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border-zinc-800 bg-zinc-900">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Star className="h-5 w-5 text-yellow-500" />
                Weitere Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-400">Favoriten gesamt</span>
                  <span className="font-bold">{totalFavorites || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-400">Ø Workflows/User</span>
                  <span className="font-bold">
                    {uniqueUsersInPeriod > 0 
                      ? (workflowsInPeriod / uniqueUsersInPeriod).toFixed(1) 
                      : '0'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-400">Conversion Rate</span>
                  <span className="font-bold text-green-400">{conversionRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-400">DAU/MAU Ratio</span>
                  <span className="font-bold">
                    {uniqueUsersThisWeek > 0 
                      ? ((uniqueUsersToday / uniqueUsersThisWeek) * 100).toFixed(0) 
                      : '0'}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="border-zinc-800 bg-zinc-900">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="h-5 w-5 text-green-500" />
                System
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-400">Status</span>
                  <Badge className="bg-green-600">Online</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-400">Admin</span>
                  <span className="text-xs text-zinc-500 truncate max-w-[140px]">
                    {user.email}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-400">Zeitraum</span>
                  <Badge variant="outline" className="text-xs">{periodLabel}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-400">Stand</span>
                  <span className="text-xs text-zinc-500">
                    {now.toLocaleTimeString('de-DE')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
