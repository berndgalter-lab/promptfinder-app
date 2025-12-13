# Achievement System Documentation

## Overview All

The achievement/badge system adds gamification to PromptFinder. Users unlock achievements based on their usage patterns and milestones.

## Files

- `lib/achievements.ts` - Core achievement logic and definitions
- `lib/achievement-toast.ts` - Toast notification helpers
- `lib/usage-tracking.ts` - Integration point (calls `checkAchievements`)
- `components/workflow/WorkflowSteps.tsx` - Shows achievement toasts after workflow usage

## Achievement Definitions

Current achievements:

### Progress-based
- 🎉 **First Steps**: Complete your first workflow
- 🚀 **Getting Started**: Complete 5 workflows
- 💪 **Productive**: Complete 10 workflows
- ⚡ **Power User**: Complete 25 workflows
- 👑 **Workflow Master**: Complete 50 workflows
- 🏆 **Legend**: Complete 100 workflows

### Streak-based
- 🔥 **On Fire**: 3-day streak
- 🔥 **Week Warrior**: 7-day streak
- 🔥 **Consistency King**: 30-day streak

### Special
- 🌟 **Early Adopter**: Join in first 1000 users (not yet implemented)

## How It Works

1. User completes a workflow (clicks "Open in ChatGPT", "Copy Prompt", etc.)
2. `recordUsage()` is called in `usage-tracking.ts`
3. `checkAchievements(userId)` is automatically called
4. New achievements are returned and shown via `showAchievementToasts()`
5. Special celebration toast appears with custom styling

## Database Schema

### `user_achievements` table
```sql
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_code TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_code)
);
```

### `user_stats` table
```sql
CREATE TABLE user_stats (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_workflows INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## API Functions

### `checkAchievements(userId: string): Promise<Achievement[]>`
Checks which achievements should be unlocked based on current stats. Returns newly unlocked achievements.

### `unlockAchievement(userId: string, achievementCode: string): Promise<Achievement | null>`
Manually unlock a specific achievement.

### `getUserAchievements(userId: string): Promise<Achievement[]>`
Get all unlocked achievements for a user.

### `getAchievementProgress(userId: string): Promise<{ total, unlocked, percentage }>`
Get achievement completion progress.

## Visual Design

Achievement toasts have special styling:
- Golden gradient background (yellow → amber → orange)
- Pulsing glow effect
- Shimmer animation
- Bounce-in entrance animation
- 5-second duration (longer than normal toasts)
- Multiple achievements shown sequentially with 6s gap

## Future Enhancements

- [ ] Category-specific achievements (e.g., "Email Master")
- [ ] Early Adopter badge (requires user_number field)
- [ ] Achievement showcase page (`/achievements`)
- [ ] Display badges in user profile/header
- [ ] Confetti animation on unlock
- [ ] Sound effect on unlock
- [ ] Share achievements on social media
- [ ] Leaderboard page

