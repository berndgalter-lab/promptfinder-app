'use client';

import { WorkflowRunner } from './WorkflowRunner';
import { type Workflow } from '@/lib/types/workflow';
import { useToast } from '@/components/ui/use-toast';
import { createClient } from '@/lib/supabase/client';

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
      // Record usage if user is logged in
      if (userId) {
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

        // Check for achievements
        try {
          const { data: achievements } = await supabase
            .rpc('check_achievements', { check_user_id: userId });
          
          if (achievements && achievements.length > 0) {
            // Show achievement toasts
            achievements.forEach((achievement: any) => {
              toast({
                title: `🏆 Achievement Unlocked!`,
                description: achievement.title,
                duration: 5000,
              });
            });
          }
        } catch (achievementError) {
          console.error('Error checking achievements:', achievementError);
        }
      }

      // Show success message
      toast({
        title: '🎉 Workflow Completed!',
        description: 'Great job! You\'ve completed all steps.',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error completing workflow:', error);
      toast({
        title: 'Error',
        description: 'Failed to save workflow completion',
        variant: 'destructive',
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

