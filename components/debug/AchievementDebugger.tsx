'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { showAchievementToast } from '@/lib/achievement-toast';
import { ACHIEVEMENTS, getAchievementIcon } from '@/lib/achievements';

/**
 * Debug component to test achievement toasts
 * Remove this component in production
 */
export function AchievementDebugger() {
  const [visible, setVisible] = useState(false);

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-[9999]">
      <Button
        onClick={() => setVisible(!visible)}
        size="sm"
        variant="outline"
        className="!bg-zinc-900 !text-white !border-zinc-700"
      >
        🎮 Debug Achievements
      </Button>

      {visible && (
        <div className="mt-2 p-4 rounded-lg border border-zinc-700 bg-zinc-900 max-h-96 overflow-y-auto w-64">
          <h3 className="text-sm font-semibold text-white mb-3">Test Achievements</h3>
          <div className="space-y-2">
            {ACHIEVEMENTS.map((achievement) => (
              <Button
                key={achievement.code}
                onClick={() => {
                  console.log('🧪 Testing achievement:', achievement.code);
                  showAchievementToast(achievement);
                }}
                size="sm"
                variant="ghost"
                className="w-full justify-start !text-xs !text-white hover:!bg-zinc-800 !h-auto !py-2"
              >
                <span className="mr-2">{getAchievementIcon(achievement.code)}</span>
                <span className="truncate">{achievement.title}</span>
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

