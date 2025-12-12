import { createAdminClient } from '@/lib/supabase/server';
import { getUserWithAdminStatus } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  UserPlus,
  Activity,
  Crown,
  Play,
  TrendingUp,
  Target,
  BarChart3,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Types
interface TopWorkflow {
  id: string;
  title: string;
  icon: string;
  count: number;
}

interface NewSignup {
  id: string;
  email: string;
  created_at: string;
}

interface ProConversion {
  id: string;
  email: string;
  plan_type: string;
  created_at: string;
}

interface EngagementTier {
  label: string;
  count: number;
  percentage: number;
  color: string;
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

function formatRelativeTime(date: string): string {
  const now = new Date();
  const then = new Date(date);
  const diffInHours = Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return '1d ago';
  if (diffInDays < 7) return `${diffInDays}d ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`;
  return `${Math.floor(diffInDays / 30)}mo ago`;
}

// MetricCard Component
interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtext: string;
  highlight?: boolean;
}

function MetricCard({ icon, label, value, subtext, highlight }: MetricCardProps) {
  return (
    <div className={`p-5 rounded-xl border ${
      highlight 
        ? 'bg-yellow-900/10 border-yellow-800/30' 
        : 'bg-zinc-900/50 border-zinc-800'
    }`}>
      <div className="flex items-center gap-2 text-zinc-400 mb-2">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <span className="text-xs text-zinc-500">{subtext}</span>
    </div>
  );
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
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  // ============================================
  // FETCH ALL DATA
  // ============================================

  // USER METRICS
  const [
    { count: totalUsers },
    { count: newUsersCount },
    { data: activeUserData },
    { count: proUsers },
  ] = await Promise.all([
    // Total Users
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    // New Users (7 days)
    supabase.from('profiles').select('*', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo.toISOString()),
    // Active Users (30 days) - users with at least 1 usage
    supabase.from('user_usage').select('user_id').gte('used_at', thirtyDaysAgo.toISOString()),
    // Pro Users
    supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active'),
  ]);

  const activeUsers = new Set(activeUserData?.map(u => u.user_id)).size;
  const proPercentage = totalUsers && totalUsers > 0 ? Math.round((proUsers || 0) / totalUsers * 100) : 0;

  // USAGE METRICS
  const [
    { count: totalRunsInPeriod },
    { data: allUsersWithUsage },
    { data: userDaysData },
  ] = await Promise.all([
    // Total Runs in period
    supabase.from('user_usage').select('*', { count: 'exact', head: true })
      .gte('used_at', periodStart.toISOString()),
    // All users with at least 1 usage (for activation rate)
    supabase.from('user_usage').select('user_id'),
    // User days data for returning users calculation
    supabase.from('user_usage').select('user_id, used_at').gte('used_at', thirtyDaysAgo.toISOString()),
  ]);

  const uniqueUsersWithUsage = new Set(allUsersWithUsage?.map(u => u.user_id)).size;
  const runsPerUser = activeUsers > 0 ? (totalRunsInPeriod || 0) / activeUsers : 0;
  const activationRate = totalUsers && totalUsers > 0 ? Math.round((uniqueUsersWithUsage / totalUsers) * 100) : 0;

  // Returning Users (users active on 2+ different days in last 30 days)
  const userDays = new Map<string, Set<string>>();
  userDaysData?.forEach(row => {
    if (!row.user_id) return;
    const day = new Date(row.used_at).toISOString().split('T')[0];
    if (!userDays.has(row.user_id)) {
      userDays.set(row.user_id, new Set());
    }
    userDays.get(row.user_id)!.add(day);
  });

  const returningUsers = Array.from(userDays.values()).filter(days => days.size >= 2).length;
  const returningPercentage = activeUsers > 0 ? Math.round((returningUsers / activeUsers) * 100) : 0;

  // USER ENGAGEMENT DISTRIBUTION
  const userRunCounts = new Map<string, number>();
  userDaysData?.forEach(row => {
    if (!row.user_id) return;
    userRunCounts.set(row.user_id, (userRunCounts.get(row.user_id) || 0) + 1);
  });

  const tiers = {
    '1 run': 0,
    '2-5 runs': 0,
    '6-10 runs': 0,
    '10+ runs': 0,
  };

  userRunCounts.forEach((count) => {
    if (count === 1) tiers['1 run']++;
    else if (count <= 5) tiers['2-5 runs']++;
    else if (count <= 10) tiers['6-10 runs']++;
    else tiers['10+ runs']++;
  });

  const totalActiveUsers = userRunCounts.size;

  const engagementDistribution: EngagementTier[] = [
    { 
      label: '1 run', 
      count: tiers['1 run'], 
      percentage: totalActiveUsers > 0 ? Math.round((tiers['1 run'] / totalActiveUsers) * 100) : 0,
      color: 'bg-zinc-500'
    },
    { 
      label: '2-5 runs', 
      count: tiers['2-5 runs'], 
      percentage: totalActiveUsers > 0 ? Math.round((tiers['2-5 runs'] / totalActiveUsers) * 100) : 0,
      color: 'bg-blue-500'
    },
    { 
      label: '6-10 runs', 
      count: tiers['6-10 runs'], 
      percentage: totalActiveUsers > 0 ? Math.round((tiers['6-10 runs'] / totalActiveUsers) * 100) : 0,
      color: 'bg-purple-500'
    },
    { 
      label: '10+ runs', 
      count: tiers['10+ runs'], 
      percentage: totalActiveUsers > 0 ? Math.round((tiers['10+ runs'] / totalActiveUsers) * 100) : 0,
      color: 'bg-yellow-500'
    },
  ];

  // DAILY USAGE (Last 14 days)
  const { data: dailyUsageRaw } = await supabase
      .from('user_usage')
      .select('used_at')
    .gte('used_at', fourteenDaysAgo.toISOString());

  // Build daily usage map
  const dailyMap: Record<string, number> = {};
  for (let i = 13; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    dailyMap[date] = 0;
  }

  dailyUsageRaw?.forEach(u => {
    const date = new Date(u.used_at).toISOString().split('T')[0];
    if (dailyMap[date] !== undefined) dailyMap[date]++;
  });

  const dailyUsage = Object.entries(dailyMap)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // TOP WORKFLOWS (30 days)
  const { data: workflowUsageRaw } = await supabase
    .from('user_usage')
    .select('workflow_id')
    .gte('used_at', thirtyDaysAgo.toISOString());

  const workflowCounts: Record<string, number> = {};
  workflowUsageRaw?.forEach(u => {
    const id = String(u.workflow_id);
    workflowCounts[id] = (workflowCounts[id] || 0) + 1;
  });

  const topWorkflowIds = Object.entries(workflowCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id]) => id);

  const { data: workflowDetails } = topWorkflowIds.length > 0
    ? await supabase.from('workflows').select('id, title, icon').in('id', topWorkflowIds)
    : { data: [] };

  const topWorkflows: TopWorkflow[] = topWorkflowIds.map(id => ({
    id,
    title: workflowDetails?.find(w => String(w.id) === id)?.title || 'Unknown',
    icon: workflowDetails?.find(w => String(w.id) === id)?.icon || '📝',
    count: workflowCounts[id] || 0,
  }));

  // NEW SIGNUPS (7 days)
  const { data: newSignupsRaw } = await supabase
    .from('profiles')
    .select('id, created_at')
    .gte('created_at', sevenDaysAgo.toISOString())
    .order('created_at', { ascending: false })
    .limit(10);

  const newSignups: NewSignup[] = (newSignupsRaw || []).map(s => ({
    id: s.id,
    email: `user-${s.id.slice(0, 8)}...`,
    created_at: s.created_at,
  }));

  // PRO CONVERSIONS (30 days)
  const { data: proConversionsRaw } = await supabase
    .from('subscriptions')
    .select('id, user_id, plan_type, created_at')
    .eq('status', 'active')
    .gte('created_at', thirtyDaysAgo.toISOString())
    .order('created_at', { ascending: false })
    .limit(10);

  const proConversions: ProConversion[] = (proConversionsRaw || []).map(s => ({
    id: s.id,
    email: `user-${s.user_id.slice(0, 8)}...`,
    plan_type: s.plan_type,
    created_at: s.created_at,
  }));

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        
        {/* ============================================ */}
        {/* HEADER */}
        {/* ============================================ */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <BarChart3 className="h-7 w-7 text-blue-500" />
              <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
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

        {/* ============================================ */}
        {/* ROW 1: USER METRICS */}
        {/* ============================================ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            icon={<Users className="w-5 h-5" />}
            label="Total Users"
            value={totalUsers || 0}
            subtext="all time"
          />
          <MetricCard
            icon={<UserPlus className="w-5 h-5 text-green-500" />}
            label="New Users"
            value={newUsersCount || 0}
            subtext="last 7 days"
          />
          <MetricCard
            icon={<Activity className="w-5 h-5 text-blue-500" />}
            label="Active Users"
            value={activeUsers}
            subtext="last 30 days"
          />
          <MetricCard
            icon={<Crown className="w-5 h-5 text-yellow-500" />}
            label="Pro Users"
            value={proUsers || 0}
            subtext={`${proPercentage}% of total`}
            highlight={true}
          />
              </div>

        {/* ============================================ */}
        {/* ROW 2: USAGE METRICS */}
        {/* ============================================ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            icon={<Play className="w-5 h-5" />}
            label="Total Runs"
            value={totalRunsInPeriod || 0}
            subtext={periodLabel.toLowerCase()}
          />
          <MetricCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="Runs per User"
            value={runsPerUser.toFixed(1)}
            subtext="avg (active users)"
          />
          <MetricCard
            icon={<RefreshCw className="w-5 h-5 text-purple-500" />}
            label="Returning Users"
            value={returningUsers}
            subtext={`${returningPercentage}% came back`}
          />
          <MetricCard
            icon={<Target className="w-5 h-5 text-orange-500" />}
            label="Activation Rate"
            value={`${activationRate}%`}
            subtext="users with 1+ run"
          />
        </div>

        {/* ============================================ */}
        {/* ROW 3: CHARTS (3 columns) */}
        {/* ============================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          
          {/* Daily Usage Chart */}
          <div className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-zinc-400" />
                Daily Usage
              <span className="text-sm text-zinc-500 font-normal">14 days</span>
            </h3>
              <div className="space-y-1">
                {dailyUsage.map((day) => {
                const maxCount = Math.max(...dailyUsage.map(d => d.count), 1);
                const percentage = (day.count / maxCount) * 100;
                  const isToday = day.date === todayStr;
                  
                  return (
                  <div key={day.date} className={`flex items-center gap-2 py-0.5 ${isToday ? 'bg-blue-950/20 -mx-2 px-2 rounded' : ''}`}>
                    <span className={`text-xs w-8 ${isToday ? 'text-blue-400 font-medium' : 'text-zinc-500'}`}>
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2)}
                      </span>
                    <div className="flex-1 h-3 bg-zinc-800 rounded overflow-hidden">
                        <div 
                          className={`h-full rounded transition-all ${isToday ? 'bg-blue-500' : 'bg-zinc-600'}`}
                          style={{ width: `${Math.max(percentage, 3)}%` }}
                        />
                      </div>
                    <span className={`text-xs w-6 text-right font-medium ${isToday ? 'text-blue-400' : 'text-zinc-400'}`}>
                      {day.count}
                      </span>
                    </div>
                  );
                })}
              </div>
              </div>

          {/* Top Workflows */}
          <div className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-500" />
                Top Workflows
              <span className="text-sm text-zinc-500 font-normal">30 days</span>
            </h3>
              {topWorkflows.length === 0 ? (
              <p className="text-sm text-zinc-500 text-center py-6">No data yet</p>
              ) : (
                <div className="space-y-2">
                {topWorkflows.map((workflow, index) => (
                  <div key={workflow.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                      <span className="text-zinc-500 text-sm w-4">{index + 1}</span>
                      <span className="text-lg">{workflow.icon}</span>
                      <span className="text-sm truncate max-w-[100px]">{workflow.title}</span>
                    </div>
                    <span className="text-sm font-medium bg-zinc-800 px-2 py-0.5 rounded ml-2">
                      {workflow.count}
                        </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User Engagement Distribution */}
          <div className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-500" />
              User Engagement
              <span className="text-sm text-zinc-500 font-normal">30 days</span>
            </h3>
            {totalActiveUsers === 0 ? (
              <p className="text-sm text-zinc-500 text-center py-6">No data yet</p>
            ) : (
              <div className="space-y-3">
                {engagementDistribution.map((tier) => (
                  <div key={tier.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-zinc-400">{tier.label}</span>
                      <span>{tier.count} ({tier.percentage}%)</span>
                      </div>
                    <div className="w-full bg-zinc-800 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${tier.color}`}
                        style={{ width: `${Math.max(tier.percentage, 2)}%` }}
                      />
                    </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        </div>

        {/* ============================================ */}
        {/* ROW 4: LISTS */}
        {/* ============================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* New Signups */}
          <div className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-green-500" />
              New Signups
              <span className="text-sm text-zinc-500 font-normal">Last 7 days</span>
            </h3>
            {newSignups.length > 0 ? (
                <div className="space-y-2">
                {newSignups.map((user) => (
                  <div key={user.id} className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0">
                    <span className="text-sm text-zinc-300 font-mono">{user.email}</span>
                    <span className="text-xs text-zinc-500">{formatRelativeTime(user.created_at)}</span>
                    </div>
                  ))}
                </div>
            ) : (
              <p className="text-sm text-zinc-500 text-center py-6">No new signups in the last 7 days</p>
            )}
                </div>

          {/* Pro Conversions */}
          <div className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Crown className="w-4 h-4 text-yellow-500" />
              Recent Pro Conversions
              <span className="text-sm text-zinc-500 font-normal">Last 30 days</span>
            </h3>
            {proConversions.length > 0 ? (
              <div className="space-y-2">
                {proConversions.map((sub) => (
                  <div key={sub.id} className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-zinc-300 font-mono">{sub.email}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        sub.plan_type === 'annual' 
                          ? 'bg-purple-900/50 text-purple-400' 
                          : 'bg-blue-900/50 text-blue-400'
                      }`}>
                        {sub.plan_type}
                  </span>
                </div>
                    <span className="text-xs text-zinc-500">{formatRelativeTime(sub.created_at)}</span>
                </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-500 text-center py-6">No conversions in the last 30 days</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
