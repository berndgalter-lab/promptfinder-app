import { createClient } from '@/lib/supabase/client';
import { checkAchievements } from '@/lib/achievements';

// Types
export interface UsageLimit {
  count: number;
  limit?: number;
  canUse: boolean;
  remaining?: number;
  showSignUpPrompt?: boolean;
}

export interface AnonymousUsageData {
  count: number;
  month: string; // Format: YYYY-MM
  firstUsed: string; // ISO timestamp
  sessionId: string;
}

const STORAGE_KEY = 'promptfinder_usage';
const FREE_USER_LIMIT = 5; // Free users: 5 workflows per month
const ANONYMOUS_SOFT_LIMIT = 3; // Show sign-up prompt after 3 uses

// Get current month in YYYY-MM format
const getCurrentMonth = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

// Generate a session ID for anonymous users
const getOrCreateSessionId = (): string => {
  const existingData = getAnonymousUsageData();
  if (existingData && existingData.sessionId) {
    return existingData.sessionId;
  }
  return crypto.randomUUID();
};

// Get anonymous usage data from localStorage
const getAnonymousUsageData = (): AnonymousUsageData | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    return JSON.parse(data) as AnonymousUsageData;
  } catch (error) {
    console.error('Error reading anonymous usage data:', error);
    return null;
  }
};

// Save anonymous usage data to localStorage
const saveAnonymousUsageData = (data: AnonymousUsageData): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving anonymous usage data:', error);
  }
};

/**
 * Record workflow usage
 * @param userId - User ID if logged in, null if anonymous
 * @param workflowId - The workflow being used
 * @param inputValues - The form values used
 * @returns Newly unlocked achievements (if any)
 */
export async function recordUsage(
  userId: string | null,
  workflowId: string,
  inputValues: Record<string, any>
): Promise<any[]> {
  const supabase = createClient();

  if (userId) {
    // Logged-in user: record in Supabase
    try {
      // Insert usage record
      const { error: usageError } = await supabase
        .from('user_usage')
        .insert({
          user_id: userId,
          workflow_id: workflowId,
          input_values: inputValues,
          used_at: new Date().toISOString(),
        });

      if (usageError) {
        console.error('Error recording usage:', usageError);
      }

      // Update user stats - read current value first, then increment
      const { data: currentStats } = await supabase
        .from('user_stats')
        .select('total_workflows')
        .eq('user_id', userId)
        .single();

      const currentTotal = currentStats?.total_workflows || 0;

      const { error: statsError } = await supabase
        .from('user_stats')
        .upsert(
          {
            user_id: userId,
            total_workflows: currentTotal + 1, // Increment by 1
            last_used_at: new Date().toISOString(),
          },
          {
            onConflict: 'user_id',
          }
        );

      if (statsError) {
        console.error('Error updating user stats:', statsError);
      }

      // Check for newly unlocked achievements
      const newAchievements = await checkAchievements(userId);
      
      // Debug log
      console.log('🎮 Achievement Check:', {
        userId,
        currentTotal: currentTotal + 1,
        newAchievements: newAchievements.map(a => a.code)
      });
      
      return newAchievements;
    } catch (error) {
      console.error('Error in recordUsage:', error);
      return [];
    }
  } else {
    // Anonymous user: record in localStorage
    incrementAnonymousUsage();
    return [];
  }
}

/**
 * Check usage limits for logged-in users
 * @param userId - The user ID to check
 * @returns Usage limit information
 */
export async function checkUserLimit(userId: string): Promise<UsageLimit> {
  const supabase = createClient();
  
  try {
    // Get first day of current month
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayISO = firstDayOfMonth.toISOString();

    // Count workflows used this month
    const { data, error, count } = await supabase
      .from('user_usage')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('used_at', firstDayISO);

    if (error) {
      console.error('Error checking user limit:', error);
      return {
        count: 0,
        limit: FREE_USER_LIMIT,
        canUse: true,
        remaining: FREE_USER_LIMIT,
      };
    }

    const usageCount = count || 0;
    const remaining = Math.max(0, FREE_USER_LIMIT - usageCount);

    return {
      count: usageCount,
      limit: FREE_USER_LIMIT,
      canUse: usageCount < FREE_USER_LIMIT,
      remaining,
    };
  } catch (error) {
    console.error('Error in checkUserLimit:', error);
    return {
      count: 0,
      limit: FREE_USER_LIMIT,
      canUse: true,
      remaining: FREE_USER_LIMIT,
    };
  }
}

/**
 * Check usage limits for anonymous users
 * @returns Usage limit information with sign-up prompt flag
 */
export function checkAnonymousLimit(): UsageLimit {
  const currentMonth = getCurrentMonth();
  const data = getAnonymousUsageData();

  if (!data) {
    // No usage data yet
    return {
      count: 0,
      canUse: true,
      showSignUpPrompt: false,
    };
  }

  // Check if it's a new month - reset count
  if (data.month !== currentMonth) {
    const sessionId = data.sessionId;
    const resetData: AnonymousUsageData = {
      count: 0,
      month: currentMonth,
      firstUsed: new Date().toISOString(),
      sessionId,
    };
    saveAnonymousUsageData(resetData);
    
    return {
      count: 0,
      canUse: true,
      showSignUpPrompt: false,
    };
  }

  // Anonymous users have soft limit - always can use, but show prompt after 3
  return {
    count: data.count,
    canUse: true, // Soft limit - always allowed
    showSignUpPrompt: data.count >= ANONYMOUS_SOFT_LIMIT,
  };
}

/**
 * Increment anonymous usage counter
 */
export function incrementAnonymousUsage(): void {
  const currentMonth = getCurrentMonth();
  const existingData = getAnonymousUsageData();

  if (!existingData || existingData.month !== currentMonth) {
    // New month or first use - create fresh data
    const newData: AnonymousUsageData = {
      count: 1,
      month: currentMonth,
      firstUsed: new Date().toISOString(),
      sessionId: getOrCreateSessionId(),
    };
    saveAnonymousUsageData(newData);
  } else {
    // Increment existing count
    const updatedData: AnonymousUsageData = {
      ...existingData,
      count: existingData.count + 1,
    };
    saveAnonymousUsageData(updatedData);
  }
}

/**
 * Get current usage for display purposes
 * @param userId - User ID if logged in, null if anonymous
 * @returns Current usage information
 */
export async function getCurrentUsage(userId: string | null): Promise<UsageLimit> {
  if (userId) {
    return await checkUserLimit(userId);
  } else {
    return checkAnonymousLimit();
  }
}

/**
 * Reset anonymous usage (useful for testing or user requested reset)
 */
export function resetAnonymousUsage(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error resetting anonymous usage:', error);
  }
}

