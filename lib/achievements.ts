import { createClient } from '@/lib/supabase/client';

// Achievement Types
export interface Achievement {
  code: string;
  title: string;
  description: string;
  requirement: AchievementRequirement;
}

export interface AchievementRequirement {
  type: 'total_workflows' | 'category' | 'streak' | 'user_id';
  value: number;
  category?: string;
}

export interface UnlockedAchievement {
  achievement_code: string;
  unlocked_at: string;
}

export interface UserStats {
  total_workflows: number;
  current_streak: number;
  user_id: string;
}

// Achievement Definitions
export const ACHIEVEMENTS: Achievement[] = [
  {
    code: 'first_workflow',
    title: 'First Steps',
    description: 'Complete your first workflow',
    requirement: { type: 'total_workflows', value: 1 }
  },
  {
    code: 'getting_started',
    title: 'Getting Started',
    description: 'Complete 5 workflows',
    requirement: { type: 'total_workflows', value: 5 }
  },
  {
    code: 'productive',
    title: 'Productive',
    description: 'Complete 10 workflows',
    requirement: { type: 'total_workflows', value: 10 }
  },
  {
    code: 'power_user',
    title: 'Power User',
    description: 'Complete 25 workflows',
    requirement: { type: 'total_workflows', value: 25 }
  },
  {
    code: 'workflow_master',
    title: 'Workflow Master',
    description: 'Complete 50 workflows',
    requirement: { type: 'total_workflows', value: 50 }
  },
  {
    code: 'legend',
    title: 'Legend',
    description: 'Complete 100 workflows',
    requirement: { type: 'total_workflows', value: 100 }
  },
  {
    code: 'streak_3',
    title: 'On Fire',
    description: '3-day streak',
    requirement: { type: 'streak', value: 3 }
  },
  {
    code: 'streak_7',
    title: 'Week Warrior',
    description: '7-day streak',
    requirement: { type: 'streak', value: 7 }
  },
  {
    code: 'streak_30',
    title: 'Consistency King',
    description: '30-day streak',
    requirement: { type: 'streak', value: 30 }
  },
  {
    code: 'early_adopter',
    title: 'Early Adopter',
    description: 'Join in first 1000 users',
    requirement: { type: 'user_id', value: 1000 }
  }
];

/**
 * Get emoji icon for achievement based on code
 */
export function getAchievementIcon(code: string): string {
  const icons: Record<string, string> = {
    'first_workflow': '🎉',
    'getting_started': '🚀',
    'productive': '💪',
    'power_user': '⚡',
    'workflow_master': '👑',
    'legend': '🏆',
    'streak_3': '🔥',
    'streak_7': '🔥',
    'streak_30': '🔥',
    'early_adopter': '🌟',
  };
  return icons[code] || '✨';
}

/**
 * Get achievement object by code
 */
export function getAchievement(code: string): Achievement | undefined {
  return ACHIEVEMENTS.find(a => a.code === code);
}

/**
 * Check if a requirement is met based on user stats
 */
function isRequirementMet(requirement: AchievementRequirement, stats: UserStats): boolean {
  switch (requirement.type) {
    case 'total_workflows':
      return stats.total_workflows >= requirement.value;
    
    case 'streak':
      return (stats.current_streak || 0) >= requirement.value;
    
    case 'user_id':
      // This would need to check the user's creation order
      // For now, simplified check (would need user_number field in DB)
      return false; // Implement when user_number field exists
    
    case 'category':
      // Category-specific achievements would need additional tracking
      // For now, return false (implement when category tracking exists)
      return false;
    
    default:
      return false;
  }
}

/**
 * Unlock a specific achievement for a user
 */
export async function unlockAchievement(
  userId: string, 
  achievementCode: string
): Promise<Achievement | null> {
  const supabase = createClient();
  const achievement = getAchievement(achievementCode);
  
  if (!achievement) {
    console.error(`Achievement ${achievementCode} not found`);
    return null;
  }

  try {
    // Check if already unlocked
    const { data: existing } = await supabase
      .from('user_achievements')
      .select('achievement_code')
      .eq('user_id', userId)
      .eq('achievement_code', achievementCode)
      .single();

    if (existing) {
      return null; // Already unlocked
    }

    // Insert new achievement
    const { error } = await supabase
      .from('user_achievements')
      .insert({
        user_id: userId,
        achievement_code: achievementCode,
        unlocked_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error unlocking achievement:', error);
      return null;
    }

    return achievement;
  } catch (error) {
    console.error('Error in unlockAchievement:', error);
    return null;
  }
}

/**
 * Check and unlock achievements based on current user stats
 * Returns newly unlocked achievements
 */
export async function checkAchievements(userId: string): Promise<Achievement[]> {
  const supabase = createClient();
  const newlyUnlocked: Achievement[] = [];

  try {
    // Get user's current stats
    const { data: userStats, error: statsError } = await supabase
      .from('user_stats')
      .select('total_workflows, current_streak')
      .eq('user_id', userId)
      .single();

    if (statsError || !userStats) {
      console.error('Error fetching user stats:', statsError);
      return [];
    }

    const stats: UserStats = {
      total_workflows: userStats.total_workflows || 0,
      current_streak: userStats.current_streak || 0,
      user_id: userId,
    };

    console.log('📊 User Stats:', stats);

    // Get already unlocked achievements
    const { data: unlockedAchievements, error: achievementsError } = await supabase
      .from('user_achievements')
      .select('achievement_code')
      .eq('user_id', userId);

    if (achievementsError) {
      console.error('Error fetching unlocked achievements:', achievementsError);
      return [];
    }

    const unlockedCodes = new Set(
      (unlockedAchievements || []).map((a: any) => a.achievement_code)
    );

    console.log('🏆 Already unlocked:', Array.from(unlockedCodes));

    // Check which achievements should be unlocked
    for (const achievement of ACHIEVEMENTS) {
      // Skip if already unlocked
      if (unlockedCodes.has(achievement.code)) {
        continue;
      }

      // Check if requirement is met
      if (isRequirementMet(achievement.requirement, stats)) {
        console.log('✅ Unlocking achievement:', achievement.code);
        const unlocked = await unlockAchievement(userId, achievement.code);
        if (unlocked) {
          newlyUnlocked.push(unlocked);
        }
      }
    }

    console.log('🎉 Newly unlocked:', newlyUnlocked.map(a => a.code));
    return newlyUnlocked;
  } catch (error) {
    console.error('Error in checkAchievements:', error);
    return [];
  }
}

/**
 * Get all unlocked achievements for a user
 */
export async function getUserAchievements(userId: string): Promise<Achievement[]> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('user_achievements')
      .select('achievement_code, unlocked_at')
      .eq('user_id', userId)
      .order('unlocked_at', { ascending: false });

    if (error) {
      console.error('Error fetching user achievements:', error);
      return [];
    }

    return (data || [])
      .map((ua: any) => getAchievement(ua.achievement_code))
      .filter((a): a is Achievement => a !== undefined);
  } catch (error) {
    console.error('Error in getUserAchievements:', error);
    return [];
  }
}

/**
 * Get achievement progress for a user (percentage, etc.)
 */
export async function getAchievementProgress(userId: string): Promise<{
  total: number;
  unlocked: number;
  percentage: number;
}> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('user_achievements')
      .select('achievement_code', { count: 'exact', head: true })
      .eq('user_id', userId);

    const unlocked = data?.length || 0;
    const total = ACHIEVEMENTS.length;
    const percentage = total > 0 ? Math.round((unlocked / total) * 100) : 0;

    return { total, unlocked, percentage };
  } catch (error) {
    console.error('Error in getAchievementProgress:', error);
    return { total: ACHIEVEMENTS.length, unlocked: 0, percentage: 0 };
  }
}

