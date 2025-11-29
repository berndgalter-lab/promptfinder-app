import { createClient } from '@/lib/supabase/server';

export type SubscriptionStatus = 'free' | 'active' | 'past_due' | 'canceled' | 'paused';
export type PlanType = 'monthly' | 'annual' | null;

export interface Subscription {
  id: string;
  user_id: string;
  status: SubscriptionStatus;
  plan_type: PlanType;
  current_period_end: string | null;
  current_period_start: string | null;
  customer_id: string | null;
  subscription_id: string | null;
  amount: number | null;
  currency: string | null;
  canceled_at: string | null;
  customer_portal_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionDetails {
  plan: 'free' | 'monthly' | 'annual';
  status: SubscriptionStatus;
  amount: number | null;
  currency: string | null;
  renewsAt: string | null;
  canceledAt: string | null;
  customerPortalUrl: string;
  isActive: boolean;
  isCanceled: boolean;
}

/**
 * Check if user has active Pro subscription
 */
export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('subscriptions')
    .select('status, current_period_end')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return false;
  }

  // Check if subscription is active and not expired
  if (data.status === 'active' || data.status === 'past_due') {
    if (!data.current_period_end) {
      return true;
    }
    
    const endDate = new Date(data.current_period_end);
    return endDate > new Date();
  }

  return false;
}

/**
 * Get user subscription details
 */
export async function getUserSubscription(userId: string): Promise<Subscription | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return null;
  }
  
  return data as Subscription;
}

/**
 * Check if user is on free plan (no subscription or canceled)
 */
export async function isFreePlan(userId: string): Promise<boolean> {
  const isActive = await hasActiveSubscription(userId);
  return !isActive;
}

/**
 * Get user's current plan type
 */
export async function getUserPlan(userId: string): Promise<'free' | 'monthly' | 'annual'> {
  const subscription = await getUserSubscription(userId);
  
  if (!subscription || subscription.status !== 'active') {
    return 'free';
  }
  
  // Check if subscription is expired
  if (subscription.current_period_end) {
    const endDate = new Date(subscription.current_period_end);
    if (endDate <= new Date()) {
      return 'free';
    }
  }
  
  return subscription.plan_type || 'free';
}

/**
 * Check if user has reached free tier limit
 */
export async function hasReachedFreeLimit(userId: string): Promise<boolean> {
  const isPro = await hasActiveSubscription(userId);
  
  // Pro users have no limit
  if (isPro) {
    return false;
  }
  
  // Check current month usage for free users
  const supabase = await createClient();
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  const { count } = await supabase
    .from('user_usage')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('used_at', firstDayOfMonth.toISOString());
  
  const FREE_TIER_LIMIT = 5;
  return (count || 0) >= FREE_TIER_LIMIT;
}

/**
 * Get remaining free workflows for the month
 */
export async function getRemainingFreeWorkflows(userId: string): Promise<number> {
  const isPro = await hasActiveSubscription(userId);
  
  // Pro users have unlimited
  if (isPro) {
    return Infinity;
  }
  
  const supabase = await createClient();
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  const { count } = await supabase
    .from('user_usage')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('used_at', firstDayOfMonth.toISOString());
  
  const FREE_TIER_LIMIT = 5;
  const remaining = FREE_TIER_LIMIT - (count || 0);
  
  return Math.max(0, remaining);
}

/**
 * Get detailed subscription information for display
 */
export async function getSubscriptionDetails(userId: string): Promise<SubscriptionDetails> {
  const subscription = await getUserSubscription(userId);
  const plan = await getUserPlan(userId);
  
  // Default for free users
  if (!subscription || plan === 'free') {
    return {
      plan: 'free',
      status: 'free',
      amount: null,
      currency: null,
      renewsAt: null,
      canceledAt: null,
      customerPortalUrl: 'https://app.lemonsqueezy.com/my-orders',
      isActive: false,
      isCanceled: false,
    };
  }
  
  // Determine if subscription is still active
  const isActive = subscription.status === 'active' || subscription.status === 'past_due';
  const isCanceled = subscription.status === 'canceled' || !!subscription.canceled_at;
  
  // Check if canceled but still active until period end
  const isActiveUntilPeriodEnd = Boolean(
    isCanceled && 
    subscription.current_period_end && 
    new Date(subscription.current_period_end) > new Date()
  );
  
  return {
    plan,
    status: subscription.status,
    amount: subscription.amount,
    currency: subscription.currency,
    renewsAt: subscription.current_period_end,
    canceledAt: subscription.canceled_at,
    customerPortalUrl: subscription.customer_portal_url || 'https://app.lemonsqueezy.com/my-orders',
    isActive: isActive || isActiveUntilPeriodEnd,
    isCanceled,
  };
}

