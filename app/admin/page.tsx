import { createAdminClient } from '@/lib/supabase/server';
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
  Calendar,
  Crown,
  BarChart3,
  Clock,
  RefreshCw,
} from 'lucide-react';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Types
interface DailyUsage {
  date: string;
  total: number;
  registered: number;
  anonymous: number;
}

interface TopWorkflow {
  id: string;
  title: string;
  usage_count: number;
}

interface RecentActivity {
  id: string;
  workflow_title: string;
  used_at: string;
}

// Time period config
type TimePeriod = 'today' | '7days' | '30days' | 'all';

const PERIOD_CONFIG: Record<TimePeriod, { label: string; days: number | null }> = {
  today: { label: 'Today', days: 0 },
  '7days': { label: '7 Days', days: 7 },
  '30days': { label: '30 Days', days: 30 },
  all: { label: 'All Time', days: null },
};

function getStartDate(period: TimePeriod): Date {
  const now = new Date();
  const config = PERIOD_CONFIG[period];
  
  if (config.days === null) return new Date(0);
  if (config.days === 0) return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return new Date(now.getTime() - config.days * 24 * 60 * 60 * 1000);
}

function formatTimeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

interface PageProps {
  searchParams: Promise<{ period?: string }>;
}

export default async function AdminDashboardPage({ searchParams }: PageProps) {
  const { user, isAdmin } = await getUserWithAdminStatus();
  if (!user || !isAdmin) redirect('/');

  const resolvedParams = await searchParams;
  const period = (resolvedParams.period as TimePeriod) || '30days';
  const periodStart = getStartDate(period);
  const periodLabel = PERIOD_CONFIG[period].label;

  const supabase = createAdminClient();
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  // ============================================
  // FETCH ALL DATA
  // ============================================

  // Users & Revenue
  const [
    { count: totalUsers },
    { data: proSubscribers },
    { count: totalFavorites },
  ] = await Promise.all([
    supabase.from('user_stats').select('*', { count: 'exact', head: true }),
    supabase.from('subscriptions').select('*').in('status', ['active', 'past_due']),
    supabase.from('user_favorites').select('*', { count: 'exact', head: true }),
  ]);

  const proCount = proSubscribers?.length || 0;
  const mrr = proSubscribers?.reduce((acc, sub) => {
    const monthly = sub.plan_type === 'annual' ? (sub.amount || 0) / 12 : (sub.amount || 0);
    return acc + monthly;
  }, 0) || 0;

  // Usage data for selected period (registered users)
  const { data: periodUsage } = await supabase
    .from('user_usage')
    .select('id, workflow_id, used_at')
    .gte('used_at', periodStart.toISOString())
    .order('used_at', { ascending: false });

  const registeredInPeriod = periodUsage?.length || 0;

  // Anonymous usage for selected period
  const { data: periodAnonymous } = await supabase
    .from('global_daily_stats')
    .select('total_anonymous')
    .gte('date', periodStart.toISOString().split('T')[0]);

  const anonymousInPeriod = periodAnonymous?.reduce((sum, d) => sum + (d.total_anonymous || 0), 0) || 0;
  const totalInPeriod = registeredInPeriod + anonymousInPeriod;

  // All-time totals
  const [
    { count: totalRegisteredUsage },
    { data: allAnonymous },
  ] = await Promise.all([
    supabase.from('user_usage').select('*', { count: 'exact', head: true }),
    supabase.from('global_daily_stats').select('total_anonymous'),
  ]);

  const totalAnonymousUsage = allAnonymous?.reduce((sum, d) => sum + (d.total_anonymous || 0), 0) || 0;
  const totalUsageAllTime = (totalRegisteredUsage || 0) + totalAnonymousUsage;

  // Top workflows in period (registered + anonymous)
  const workflowCounts: Record<string, { registered: number; anonymous: number }> = {};
  
  // Add registered user counts
  periodUsage?.forEach(u => {
    const id = String(u.workflow_id);
    if (!workflowCounts[id]) workflowCounts[id] = { registered: 0, anonymous: 0 };
    workflowCounts[id].registered++;
  });

  // Add anonymous counts from workflow_daily_stats
  const { data: periodWorkflowStats } = await supabase
    .from('workflow_daily_stats')
    .select('workflow_id, anonymous_count')
    .gte('date', periodStart.toISOString().split('T')[0]);

  periodWorkflowStats?.forEach(s => {
    const id = String(s.workflow_id);
    if (!workflowCounts[id]) workflowCounts[id] = { registered: 0, anonymous: 0 };
    workflowCounts[id].anonymous += s.anonymous_count || 0;
  });

  // Sort by total (registered + anonymous)
  const topWorkflowIds = Object.entries(workflowCounts)
    .map(([id, counts]) => ({ id, total: counts.registered + counts.anonymous }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)
    .map(item => item.id);

  const { data: workflowDetails } = topWorkflowIds.length > 0
    ? await supabase.from('workflows').select('id, title').in('id', topWorkflowIds)
    : { data: [] };

  const topWorkflows: TopWorkflow[] = topWorkflowIds.map(id => {
    const counts = workflowCounts[id] || { registered: 0, anonymous: 0 };
    return {
      id,
      title: workflowDetails?.find(w => String(w.id) === String(id))?.title || 'Unknown',
      usage_count: counts.registered + counts.anonymous,
    };
  });

  // Recent activity (last 10)
  const { data: recentRaw } = await supabase
    .from('user_usage')
    .select('id, used_at, workflows:workflow_id (title)')
    .order('used_at', { ascending: false })
    .limit(10);

  const recentActivity: RecentActivity[] = (recentRaw || [])
    .filter((r: any) => r.workflows)
    .map((r: any) => ({
      id: r.id,
      workflow_title: r.workflows.title,
      used_at: r.used_at,
    }));

  // Daily usage (last 14 days)
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  
  const [{ data: dailyRegistered }, { data: dailyAnonymous }] = await Promise.all([
    supabase
      .from('user_usage')
      .select('used_at')
      .gte('used_at', fourteenDaysAgo.toISOString()),
    supabase
      .from('global_daily_stats')
      .select('date, total_anonymous')
      .gte('date', fourteenDaysAgo.toISOString().split('T')[0]),
  ]);

  // Build daily usage map
  const dailyMap: Record<string, { registered: number; anonymous: number }> = {};
  for (let i = 13; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    dailyMap[date] = { registered: 0, anonymous: 0 };
  }

  dailyRegistered?.forEach(u => {
    const date = new Date(u.used_at).toISOString().split('T')[0];
    if (dailyMap[date]) dailyMap[date].registered++;
  });

  dailyAnonymous?.forEach(d => {
    if (dailyMap[d.date]) dailyMap[d.date].anonymous = d.total_anonymous || 0;
  });

  const dailyUsage: DailyUsage[] = Object.entries(dailyMap)
    .map(([date, data]) => ({
      date,
      total: data.registered + data.anonymous,
      registered: data.registered,
      anonymous: data.anonymous,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <BarChart3 className="h-7 w-7 text-blue-500" />
              <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
            </div>
            <p className="text-sm text-zinc-500">
              {now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
          </div>
          <Link href="/admin">
            <Button variant="outline" size="sm" className="gap-2 !border-zinc-700 !text-zinc-300 hover:!bg-zinc-800">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </Link>
        </div>

        {/* Period Filter */}
        <div className="flex gap-1 mb-8 p-1 bg-zinc-900 rounded-lg w-fit">
          {Object.entries(PERIOD_CONFIG).map(([key, config]) => (
            <Link
              key={key}
              href={`/admin?period=${key}`}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                period === key
                  ? 'bg-blue-600 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {config.label}
            </Link>
          ))}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
          {/* MRR */}
          <Card className="border-zinc-800 bg-zinc-900">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-zinc-500 mb-1 uppercase">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-green-400">€{(mrr / 100).toFixed(0)}</p>
                  <p className="text-xs text-zinc-600 mt-1">{proCount} Pro users</p>
                </div>
                <DollarSign className="h-5 w-5 text-zinc-700" />
              </div>
            </CardContent>
          </Card>

          {/* Workflows in Period */}
          <Card className="border-zinc-800 bg-zinc-900">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-zinc-500 mb-1 uppercase">Workflows ({periodLabel})</p>
                  <p className="text-2xl font-bold text-blue-400">{totalInPeriod}</p>
                  <p className="text-xs text-zinc-600 mt-1">
                    {registeredInPeriod} users · {anonymousInPeriod} guests
                  </p>
                </div>
                <Zap className="h-5 w-5 text-zinc-700" />
              </div>
            </CardContent>
          </Card>

          {/* Users */}
          <Card className="border-zinc-800 bg-zinc-900">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-zinc-500 mb-1 uppercase">Registered Users</p>
                  <p className="text-2xl font-bold text-purple-400">{totalUsers || 0}</p>
                  <p className="text-xs text-zinc-600 mt-1">{totalFavorites || 0} favorites saved</p>
                </div>
                <Users className="h-5 w-5 text-zinc-700" />
              </div>
            </CardContent>
          </Card>

          {/* Total Workflows */}
          <Card className="border-zinc-800 bg-zinc-900">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-zinc-500 mb-1 uppercase">Total Workflows</p>
                  <p className="text-2xl font-bold text-amber-400">{totalUsageAllTime}</p>
                  <p className="text-xs text-zinc-600 mt-1">all time</p>
                </div>
                <TrendingUp className="h-5 w-5 text-zinc-700" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Daily Usage Chart */}
          <Card className="border-zinc-800 bg-zinc-900 lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="h-4 w-4 text-blue-500" />
                Daily Usage
              </CardTitle>
              <CardDescription>Last 14 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {dailyUsage.map((day) => {
                  const maxTotal = Math.max(...dailyUsage.map(d => d.total), 1);
                  const percentage = (day.total / maxTotal) * 100;
                  const isToday = day.date === todayStr;
                  
                  return (
                    <div key={day.date} className={`flex items-center gap-3 py-1 ${isToday ? 'bg-blue-950/20 -mx-2 px-2 rounded' : ''}`}>
                      <span className={`text-xs w-12 ${isToday ? 'text-blue-400 font-medium' : 'text-zinc-500'}`}>
                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </span>
                      <div className="flex-1 h-4 bg-zinc-800 rounded overflow-hidden">
                        <div 
                          className={`h-full rounded transition-all ${isToday ? 'bg-blue-500' : 'bg-zinc-600'}`}
                          style={{ width: `${Math.max(percentage, 3)}%` }}
                        />
                      </div>
                      <span className={`text-sm w-8 text-right font-medium ${isToday ? 'text-blue-400' : 'text-zinc-400'}`}>
                        {day.total}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-4 mt-4 pt-4 border-t border-zinc-800 text-xs text-zinc-500">
                <span>Users = registered users</span>
                <span>Guests = anonymous visitors</span>
              </div>
            </CardContent>
          </Card>

          {/* Top Workflows */}
          <Card className="border-zinc-800 bg-zinc-900">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Zap className="h-4 w-4 text-yellow-500" />
                Top Workflows
              </CardTitle>
              <CardDescription>{periodLabel}</CardDescription>
            </CardHeader>
            <CardContent>
              {topWorkflows.length === 0 ? (
                <p className="text-zinc-500 text-center py-6 text-sm">No data yet</p>
              ) : (
                <div className="space-y-2">
                  {topWorkflows.map((workflow, i) => (
                    <div key={workflow.id} className="flex items-center justify-between p-2 rounded bg-zinc-950">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`text-xs font-bold w-4 ${
                          i === 0 ? 'text-yellow-500' : i === 1 ? 'text-zinc-400' : 'text-zinc-600'
                        }`}>
                          {i + 1}
                        </span>
                        <span className="text-sm truncate">{workflow.title}</span>
                      </div>
                      <Badge variant="secondary" className="bg-zinc-800 text-xs ml-2">
                        {workflow.usage_count}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Recent Activity */}
          <Card className="border-zinc-800 bg-zinc-900">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-4 w-4 text-cyan-500" />
                Recent Activity
              </CardTitle>
              <CardDescription>Registered users only (guests are anonymous)</CardDescription>
            </CardHeader>
            <CardContent>
              {recentActivity.length === 0 ? (
                <p className="text-zinc-500 text-center py-6 text-sm">No activity yet</p>
              ) : (
                <div className="space-y-2">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-2 rounded bg-zinc-950">
                      <span className="text-sm truncate">{activity.workflow_title}</span>
                      <span className="text-xs text-zinc-500 ml-2 shrink-0">
                        {formatTimeAgo(activity.used_at)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Subscriptions */}
          <Card className="border-zinc-800 bg-zinc-900">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Crown className="h-4 w-4 text-purple-500" />
                Subscriptions
              </CardTitle>
              <CardDescription>User breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded bg-purple-950/20 border border-purple-900/30">
                  <span className="text-sm">Monthly Pro</span>
                  <span className="font-bold text-purple-400">
                    {proSubscribers?.filter(s => s.plan_type === 'monthly').length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded bg-amber-950/20 border border-amber-900/30">
                  <span className="text-sm">Annual Pro</span>
                  <span className="font-bold text-amber-400">
                    {proSubscribers?.filter(s => s.plan_type === 'annual').length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded bg-zinc-800/50 border border-zinc-700/30">
                  <span className="text-sm">Free Users</span>
                  <span className="font-bold text-zinc-400">
                    {(totalUsers || 0) - proCount}
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
