-- Add streak tracking columns to user_stats table
-- This enables streak-based achievements (3-day, 7-day, 30-day streaks)

ALTER TABLE user_stats 
ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS longest_streak INTEGER DEFAULT 0;

-- Create index for streak queries
CREATE INDEX IF NOT EXISTS idx_user_stats_streaks ON user_stats(user_id, current_streak);

-- Update existing rows to have default streak values
UPDATE user_stats 
SET current_streak = 0, longest_streak = 0 
WHERE current_streak IS NULL OR longest_streak IS NULL;

-- Comments for documentation
COMMENT ON COLUMN user_stats.current_streak IS 'Number of consecutive days user has used workflows';
COMMENT ON COLUMN user_stats.longest_streak IS 'Highest streak the user has ever achieved';

