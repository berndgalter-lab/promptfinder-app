'use client';

import { WorkflowRunner } from './WorkflowRunner';
import { type Workflow } from '@/lib/types/workflow';
import { useToast } from '@/components/ui/use-toast';
import { createClient } from '@/lib/supabase/client';
import { checkAchievements } from '@/lib/achievements';
import { incrementAnonymousUsage } from '@/lib/usage-tracking';

interface WorkflowRunnerWrapperProps {
  workflow: Workflow;
  userId: string | null;
}

export function WorkflowRunnerWrapper({ workflow, userId }: WorkflowRunnerWrapperProps) {
  const { toast } = useToast();
  const supabase = createClient();

  const handleComplete = async (data: {
    fieldValues: Record<number, Record<string, string>>;
    inputValues: Record<number, string>;
  }) => {
    try {
      if (userId) {
        // Logged-in user: Record usage in Supabase
        // DSGVO-SAFE: Only collect non-personal data
        // - Select values: OK (no free-text input)
        // - Text/Textarea values: NOT stored (could be personal)
        // - inputValues: NOT stored (user content, definitely personal)
        
        const safeValues: Record<string, string> = {};
        
        // Only collect select field values (no free-text fields)
        // We need access to workflow steps to check which fields are "select"
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
        
        // ❌ inputValues are NOT stored (GDPR!)
        // User content like meeting notes, emails etc. stays only in browser RAM
        
        // Usage tracking - only safe metadata
        const { error: usageError } = await supabase
          .from('user_usage')
          .insert({
            user_id: userId,
            workflow_id: workflow.id,
            input_values: safeValues, // Only select values, no free-text input
            used_at: new Date().toISOString(),
          });

        if (usageError) {
          console.error('Error recording usage:', usageError);
        }
        
        console.log('[GDPR-Safe] Usage tracked with safe values only:', Object.keys(safeValues));

        // Update user stats (total_workflows counter)
        try {
          // Get current stats
          const { data: currentStats } = await supabase
            .from('user_stats')
            .select('total_workflows')
            .eq('user_id', userId)
            .single();

          const currentTotal = currentStats?.total_workflows || 0;

          // Increment total workflows
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

          console.log(`📊 User stats updated: ${currentTotal + 1} total workflows`);
        } catch (statsError) {
          console.error('Error updating stats:', statsError);
        }

        // Check for achievements (using JavaScript function, not SQL RPC)
        try {
          const newAchievements = await checkAchievements(userId);
          
          if (newAchievements && newAchievements.length > 0) {
            console.log(`🎉 ${newAchievements.length} new achievement(s) unlocked!`);
            
            // Show achievement toasts
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
        console.log('📊 Anonymous usage tracked');
      }

      // Show success message (optional - already shown by trackFirstUsage)
      // toast({
      //   title: '🎉 Workflow Completed!',
      //   description: 'Great job! You\'ve completed all steps.',
      //   duration: 3000,
      // });
    } catch (error) {
      console.error('Error completing workflow:', error);
      toast({
        title: 'Error',
        description: 'Failed to save workflow completion',
      });
    }
  };

  return (
    <WorkflowRunner
      workflow={workflow}
      userId={userId}
      onComplete={handleComplete}
    />
  );
}

