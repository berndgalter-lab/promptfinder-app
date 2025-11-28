import { toast } from '@/components/ui/use-toast';
import { getAchievementIcon, type Achievement } from '@/lib/achievements';

/**
 * Show achievement unlock toast with celebration styling
 */
export function showAchievementToast(achievement: Achievement) {
  console.log('🎊 Showing achievement toast:', achievement.title);
  
  const icon = getAchievementIcon(achievement.code);
  
  toast({
    title: `${icon} Achievement Unlocked!`,
    description: `${achievement.title} - ${achievement.description}`,
    duration: 5000,
    className: 'achievement-toast !border-2 !border-yellow-500/50 !bg-gradient-to-br from-yellow-950/95 via-amber-950/95 to-orange-950/95 !text-white !shadow-2xl backdrop-blur-sm',
  });
}

/**
 * Show multiple achievement toasts sequentially
 */
export function showAchievementToasts(achievements: Achievement[]) {
  console.log('🎯 showAchievementToasts called with:', achievements.length, 'achievements');
  
  if (achievements.length === 0) {
    console.log('⚠️ No achievements to show');
    return;
  }

  // Show first achievement immediately
  console.log('🎉 Showing first achievement immediately');
  showAchievementToast(achievements[0]);

  // Show remaining achievements with delay
  if (achievements.length > 1) {
    console.log('⏰ Scheduling', achievements.length - 1, 'more achievements');
    achievements.slice(1).forEach((achievement, index) => {
      setTimeout(() => {
        console.log('⏰ Showing scheduled achievement', index + 2);
        showAchievementToast(achievement);
      }, (index + 1) * 6000); // 6s delay to allow previous toast to be visible
    });
  }
}

