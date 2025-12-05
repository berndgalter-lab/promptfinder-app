import { createClient } from '@/lib/supabase/server';
import { getUserWithAdminStatus } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  BarChart3
} from 'lucide-react';

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Types for our metrics
interface DailyUsage {
  date: string;
  workflows: number;
  unique_users: number;
}

interface TopWorkflow {
  title: string;
  slug: string;
  usage_count: number;
}

interface PowerUser {
  user_id: string;
  email: string;
  total_uses: number;
  last_active: string;
}

interface RecentSubscription {
  user_id: string;
  email: string;
  status: string;
  plan_type: string;
  amount: number;
  created_at: string;
}

export default async function AdminDashboardPage() {
  const { user, isAdmin } = await getUserWithAdminStatus();

  // Redirect if not logged in or not admin
  if (!user || !isAdmin) {
    redirect('/');
  }

  const supabase = await createClient();
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

  // ============================================
  // FETCH ALL METRICS
  // ============================================

  // 1. Total registered users
  const { count: totalUsers } = await supabase
    .from('user_stats')
    .select('*', { count: 'exact', head: true });

  // 2. Pro subscribers (active)
  const { data: proSubscribers, count: proCount } = await supabase
    .from('subscriptions')
    .select('*', { count: 'exact' })
    .in('status', ['active', 'past_due']);

  // 3. MRR Calculation
  const monthlyRevenue = proSubscribers?.reduce((acc, sub) => {
    if (sub.status === 'active' || sub.status === 'past_due') {
      // Convert annual to monthly equivalent
      const monthlyAmount = sub.plan_type === 'annual' 
        ? (sub.amount || 0) / 12 
        : (sub.amount || 0);
      return acc + monthlyAmount;
    }
    return acc;
  }, 0) || 0;

  // 4. MAU (Monthly Active Users)
  const { count: mau } = await supabase
    .from('user_usage')
    .select('user_id', { count: 'exact', head: true })
    .gte('used_at', firstDayOfMonth.toISOString());

  // Get unique MAU
  const { data: mauData } = await supabase
    .from('user_usage')
    .select('user_id')
    .gte('used_at', firstDayOfMonth.toISOString());
  const uniqueMAU = new Set(mauData?.map(d => d.user_id)).size;

  // 5. DAU (Daily Active Users)
  const { data: dauData } = await supabase
    .from('user_usage')
    .select('user_id')
    .gte('used_at', today.toISOString());
  const uniqueDAU = new Set(dauData?.map(d => d.user_id)).size;

  // 6. Total workflows this month
  const { count: workflowsThisMonth } = await supabase
    .from('user_usage')
    .select('*', { count: 'exact', head: true })
    .gte('used_at', firstDayOfMonth.toISOString());

  // 7. Total workflows last month (for comparison)
  const { count: workflowsLastMonth } = await supabase
    .from('user_usage')
    .select('*', { count: 'exact', head: true })
    .gte('used_at', firstDayOfLastMonth.toISOString())
    .lt('used_at', firstDayOfMonth.toISOString());

  // 8. Total workflows all time
  const { count: totalWorkflowsAllTime } = await supabase
    .from('user_usage')
    .select('*', { count: 'exact', head: true });

  // 9. Total favorites
  const { count: totalFavorites } = await supabase
    .from('user_favorites')
    .select('*', { count: 'exact', head: true });

  // 10. Top 10 Workflows this month
  const { data: topWorkflowsRaw } = await supabase
    .from('user_usage')
    .select('workflow_id')
    .gte('used_at', firstDayOfMonth.toISOString());

  // Count workflow usage
  const workflowCounts: Record<string, number> = {};
  topWorkflowsRaw?.forEach(u => {
    workflowCounts[u.workflow_id] = (workflowCounts[u.workflow_id] || 0) + 1;
  });

  // Get workflow details for top workflows
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
      title: workflow?.title || 'Unknown',
      slug: workflow?.slug || '',
      usage_count: workflowCounts[id] || 0
    };
  });

  // 11. Daily usage trend (last 14 days)
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const { data: dailyUsageRaw } = await supabase
    .from('user_usage')
    .select('used_at, user_id')
    .gte('used_at', fourteenDaysAgo.toISOString())
    .order('used_at', { ascending: true });

  // Aggregate by day
  const dailyUsageMap: Record<string, { workflows: number; users: Set<string> }> = {};
  dailyUsageRaw?.forEach(u => {
    const date = new Date(u.used_at).toISOString().split('T')[0];
    if (!dailyUsageMap[date]) {
      dailyUsageMap[date] = { workflows: 0, users: new Set() };
    }
    dailyUsageMap[date].workflows++;
    dailyUsageMap[date].users.add(u.user_id);
  });

  const dailyUsage: DailyUsage[] = Object.entries(dailyUsageMap)
    .map(([date, data]) => ({
      date,
      workflows: data.workflows,
      unique_users: data.users.size
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // 12. Recent subscriptions
  const { data: recentSubsRaw } = await supabase
    .from('subscriptions')
    .select('user_id, status, plan_type, amount, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  // 13. Calculate growth percentages
  const workflowGrowth = workflowsLastMonth && workflowsLastMonth > 0
    ? Math.round(((workflowsThisMonth || 0) - workflowsLastMonth) / workflowsLastMonth * 100)
    : 0;

  // 14. Conversion rate (users who subscribed / total users)
  const conversionRate = totalUsers && totalUsers > 0
    ? ((proCount || 0) / totalUsers * 100).toFixed(1)
    : '0';

  // 15. Average workflows per user
  const avgWorkflowsPerUser = uniqueMAU > 0
    ? ((workflowsThisMonth || 0) / uniqueMAU).toFixed(1)
    : '0';

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-12 text-white">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="h-8 w-8 text-blue-500" />
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          </div>
          <p className="text-zinc-400">
            PromptFinder Analytics • {now.toLocaleDateString('de-DE', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* KPI Cards - Top Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* MRR */}
          <Card className="border-zinc-800 bg-gradient-to-br from-green-950/50 to-zinc-900">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400 mb-1">MRR</p>
                  <p className="text-3xl font-bold text-green-400">
                    €{(monthlyRevenue / 100).toFixed(2)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500/50" />
              </div>
            </CardContent>
          </Card>

          {/* Pro Subscribers */}
          <Card className="border-zinc-800 bg-gradient-to-br from-purple-950/50 to-zinc-900">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400 mb-1">Pro Users</p>
                  <p className="text-3xl font-bold text-purple-400">{proCount || 0}</p>
                  <p className="text-xs text-zinc-500">{conversionRate}% conversion</p>
                </div>
                <Crown className="h-8 w-8 text-purple-500/50" />
              </div>
            </CardContent>
          </Card>

          {/* MAU */}
          <Card className="border-zinc-800 bg-gradient-to-br from-blue-950/50 to-zinc-900">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400 mb-1">MAU</p>
                  <p className="text-3xl font-bold text-blue-400">{uniqueMAU}</p>
                  <p className="text-xs text-zinc-500">active this month</p>
                </div>
                <Users className="h-8 w-8 text-blue-500/50" />
              </div>
            </CardContent>
          </Card>

          {/* DAU */}
          <Card className="border-zinc-800 bg-gradient-to-br from-cyan-950/50 to-zinc-900">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400 mb-1">DAU</p>
                  <p className="text-3xl font-bold text-cyan-400">{uniqueDAU}</p>
                  <p className="text-xs text-zinc-500">active today</p>
                </div>
                <Activity className="h-8 w-8 text-cyan-500/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Second Row - Usage Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* Workflows This Month */}
          <Card className="border-zinc-800 bg-zinc-900">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400 mb-1">Workflows (Month)</p>
                  <p className="text-3xl font-bold">{workflowsThisMonth || 0}</p>
                  {workflowGrowth !== 0 && (
                    <p className={`text-xs ${workflowGrowth > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {workflowGrowth > 0 ? '↑' : '↓'} {Math.abs(workflowGrowth)}% vs last month
                    </p>
                  )}
                </div>
                <Zap className="h-8 w-8 text-yellow-500/50" />
              </div>
            </CardContent>
          </Card>

          {/* Total Workflows */}
          <Card className="border-zinc-800 bg-zinc-900">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400 mb-1">Total Workflows</p>
                  <p className="text-3xl font-bold">{totalWorkflowsAllTime || 0}</p>
                  <p className="text-xs text-zinc-500">all time</p>
                </div>
                <TrendingUp className="h-8 w-8 text-zinc-500/50" />
              </div>
            </CardContent>
          </Card>

          {/* Total Users */}
          <Card className="border-zinc-800 bg-zinc-900">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400 mb-1">Registered Users</p>
                  <p className="text-3xl font-bold">{totalUsers || 0}</p>
                  <p className="text-xs text-zinc-500">with activity</p>
                </div>
                <UserCheck className="h-8 w-8 text-zinc-500/50" />
              </div>
            </CardContent>
          </Card>

          {/* Avg per User */}
          <Card className="border-zinc-800 bg-zinc-900">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400 mb-1">Avg/User</p>
                  <p className="text-3xl font-bold">{avgWorkflowsPerUser}</p>
                  <p className="text-xs text-zinc-500">workflows/month</p>
                </div>
                <BarChart3 className="h-8 w-8 text-zinc-500/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Workflows */}
          <Card className="border-zinc-800 bg-zinc-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Top Workflows
              </CardTitle>
              <CardDescription>Most used this month</CardDescription>
            </CardHeader>
            <CardContent>
              {topWorkflows.length === 0 ? (
                <p className="text-zinc-500 text-center py-8">No data this month</p>
              ) : (
                <div className="space-y-3">
                  {topWorkflows.map((workflow, index) => (
                    <div 
                      key={workflow.slug || index}
                      className="flex items-center justify-between p-3 rounded-lg bg-zinc-950 border border-zinc-800"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-zinc-500 w-6">
                          {index + 1}.
                        </span>
                        <span className="font-medium truncate max-w-[200px]">
                          {workflow.title}
                        </span>
                      </div>
                      <Badge variant="secondary" className="bg-zinc-800">
                        {workflow.usage_count} uses
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Daily Usage Chart (Simple) */}
          <Card className="border-zinc-800 bg-zinc-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                Daily Usage (14 Days)
              </CardTitle>
              <CardDescription>Workflows per day</CardDescription>
            </CardHeader>
            <CardContent>
              {dailyUsage.length === 0 ? (
                <p className="text-zinc-500 text-center py-8">No data available</p>
              ) : (
                <div className="space-y-2">
                  {dailyUsage.slice(-7).map((day) => {
                    const maxWorkflows = Math.max(...dailyUsage.map(d => d.workflows), 1);
                    const percentage = (day.workflows / maxWorkflows) * 100;
                    return (
                      <div key={day.date} className="flex items-center gap-3">
                        <span className="text-xs text-zinc-500 w-20">
                          {new Date(day.date).toLocaleDateString('de-DE', { 
                            weekday: 'short', 
                            day: 'numeric',
                            month: 'short'
                          })}
                        </span>
                        <div className="flex-1 h-6 bg-zinc-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-12 text-right">
                          {day.workflows}
                        </span>
                        <span className="text-xs text-zinc-500 w-16 text-right">
                          {day.unique_users} users
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Subscriptions & Additional Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Subscription Breakdown */}
          <Card className="border-zinc-800 bg-zinc-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-purple-500" />
                Subscription Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Monthly */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-purple-600">Monthly</Badge>
                  </div>
                  <span className="font-bold">
                    {proSubscribers?.filter(s => s.plan_type === 'monthly').length || 0}
                  </span>
                </div>
                {/* Annual */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-amber-600">Annual</Badge>
                  </div>
                  <span className="font-bold">
                    {proSubscribers?.filter(s => s.plan_type === 'annual').length || 0}
                  </span>
                </div>
                {/* Free */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Free</Badge>
                  </div>
                  <span className="font-bold text-zinc-400">
                    {(totalUsers || 0) - (proCount || 0)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border-zinc-800 bg-zinc-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Total Favorites</span>
                  <span className="font-bold">{totalFavorites || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Workflows Last Month</span>
                  <span className="font-bold">{workflowsLastMonth || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">DAU/MAU Ratio</span>
                  <span className="font-bold">
                    {uniqueMAU > 0 ? ((uniqueDAU / uniqueMAU) * 100).toFixed(1) : '0'}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Pro Conversion</span>
                  <span className="font-bold text-green-400">{conversionRate}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Info */}
          <Card className="border-zinc-800 bg-zinc-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-500" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Database</span>
                  <Badge className="bg-green-600">Connected</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Admin</span>
                  <span className="text-xs text-zinc-500 truncate max-w-[150px]">
                    {user.email}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Last Refresh</span>
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

