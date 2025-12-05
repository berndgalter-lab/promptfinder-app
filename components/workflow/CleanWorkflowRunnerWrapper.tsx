'use client';

import { CleanWorkflowRunner } from './CleanWorkflowRunner';
import { type Workflow } from '@/lib/types/workflow';
import { useToast } from '@/components/ui/use-toast';
import { createClient } from '@/lib/supabase/client';
import { checkAchievements } from '@/lib/achievements';
import { incrementAnonymousUsage } from '@/lib/usage-tracking';

interface CleanWorkflowRunnerWrapperProps {
  workflow: Workflow;
  userId: string | null;
}

export function CleanWorkflowRunnerWrapper({ workflow, userId }: CleanWorkflowRunnerWrapperProps) {
  const { toast } = useToast();
  const supabase = createClient();

  const handleComplete = async (data: {
    fieldValues: Record<number, Record<string, string>>;
    inputValues: Record<number, string>;
  }) => {
    try {
      if (userId) {
        // Logged-in user: Record usage in Supabase
        // DSGVO-SAFE: Only collect non-personal data (select values only)
        
        const safeValues: Record<string, string> = {};
        
        workflow.steps.forEach(step => {
          if (step.type === 'prompt' && 'fields' in step) {
            const stepValues = data.fieldValues[step.number] || {};
            step.fields.forEach(field => {
              // ONLY store select fields - no text/textarea (could be personal)
              if (field.type === 'select' && stepValues[field.name]) {
                safeValues[field.name] = stepValues[field.name];
              }
            });
          }
        });
        
        // Usage tracking - only safe metadata
        const { error: usageError } = await supabase
          .from('user_usage')
          .insert({
            user_id: userId,
            workflow_id: workflow.id,
            input_values: safeValues,
            used_at: new Date().toISOString(),
          });

        if (usageError) {
          console.error('Error recording usage:', usageError);
        }

        // Update user stats
        try {
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
                total_workflows: currentTotal + 1,
                last_used_at: new Date().toISOString(),
              },
              {
                onConflict: 'user_id',
              }
            );

          if (statsError) {
            console.error('Error updating user stats:', statsError);
          }
        } catch (statsError) {
          console.error('Error updating stats:', statsError);
        }

        // Check for achievements
        try {
          const newAchievements = await checkAchievements(userId);
          
          if (newAchievements && newAchievements.length > 0) {
            newAchievements.forEach((achievement) => {
              toast({
                title: `🏆 Achievement Unlocked!`,
                description: `${achievement.title} - ${achievement.description}`,
                duration: 5000,
              });
            });
          }
        } catch (achievementError) {
          console.error('Error checking achievements:', achievementError);
        }
      } else {
        // Anonymous user: Track in localStorage
        incrementAnonymousUsage();
      }
    } catch (error) {
      console.error('Error completing workflow:', error);
    }
  };

  return (
    <CleanWorkflowRunner
      workflow={workflow}
      userId={userId}
      onComplete={handleComplete}
    />
  );
}

