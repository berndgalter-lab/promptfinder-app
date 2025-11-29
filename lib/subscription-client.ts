import { createClient } from '@/lib/supabase/client';

/**
 * Check if user has active Pro subscription (Client-side only)
 * Use this in Client Components and hooks
 */
export async function hasActiveSubscriptionClient(userId: string): Promise<boolean> {
  const supabase = createClient();
  
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

