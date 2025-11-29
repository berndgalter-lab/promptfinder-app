import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/auth';
import { Badge } from '@/components/ui/badge';
import { FavoriteButton } from '@/components/workflow/FavoriteButton';
import { WorkflowRunnerWrapper } from '@/components/workflow/WorkflowRunnerWrapper';
import { WorkflowLimitGuard } from '@/components/workflow/WorkflowLimitGuard';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Lock, Zap } from 'lucide-react';
import { type Workflow, type WorkflowStep } from '@/lib/types/workflow';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function WorkflowDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  
  // Fetch workflow
  const { data: rawWorkflow, error: workflowError } = await supabase
    .from('workflows')
    .select('*')
    .eq('slug', slug)
    .single();

  if (workflowError || !rawWorkflow) {
    notFound();
  }

  // Transform to new Workflow type with backward compatibility
  const workflow: Workflow = {
    id: rawWorkflow.id,  // UUID string from Supabase
    slug: rawWorkflow.slug,
    title: rawWorkflow.title,
    description: rawWorkflow.description || '',
    tier: rawWorkflow.tier || 'essential',
    workflow_type: rawWorkflow.workflow_type || 'combined', // Default to combined for old workflows
    steps: (rawWorkflow.steps || []).map((step: any, index: number) => ({
      number: index + 1,
      type: step.type || 'prompt', // Default to prompt for old workflows
      title: step.title,
      description: step.description,
      // PromptStep fields
      ...((!step.type || step.type === 'prompt') && {
        prompt_template: step.prompt_template || '',
        fields: (step.fields || []).map((field: any) => ({
          name: field.name,
          label: field.label,
          type: field.type || 'text',
          required: field.required !== false, // Default to true
          placeholder: field.placeholder,
          options: field.options,
        })),
      }),
      // InstructionStep fields
      ...(step.type === 'instruction' && {
        instruction_text: step.instruction_text || '',
        instruction_icon: step.instruction_icon,
      }),
      // InputStep fields
      ...(step.type === 'input' && {
        input_label: step.input_label || '',
        input_placeholder: step.input_placeholder,
        input_description: step.input_description,
      }),
    })) as WorkflowStep[],
    created_at: rawWorkflow.created_at,
  };

  // Fetch current user
  const user = await getUser();

  // Check if workflow is favorited (only if user is logged in)
  let isFavorited = false;
  
  if (user) {
    const { data: favorite } = await supabase
      .from('user_favorites')
      .select('*')
      .eq('user_id', user.id)
      .eq('workflow_id', workflow.id)
      .single();
    
    isFavorited = !!favorite;
  }

  const tierVariant = workflow.tier === 'essential' ? 'success' : 'default';
  const tierLabel = workflow.tier === 'essential' ? 'Essential' : 'Advanced';

  // Remove old limit check - now handled by WorkflowLimitGuard
  if (false) {
    return (
      <div className="min-h-screen bg-zinc-950 px-4 py-12 text-white">
        <div className="mx-auto max-w-2xl">
          <Card className="border-2 border-yellow-500/50 bg-gradient-to-br from-yellow-500/10 to-orange-500/10">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/20">
                <Lock className="h-8 w-8 text-yellow-500" />
              </div>
              <CardTitle className="text-3xl">Free Limit Reached</CardTitle>
              <CardDescription className="text-base mt-2">
                You've used all 5 free workflows this month. Upgrade to Pro for unlimited access!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Features */}
              <div className="space-y-3 border-t border-zinc-800 pt-6">
                <p className="font-semibold text-white">With Pro you get:</p>
                <ul className="space-y-2 text-sm text-zinc-400">
                  <li className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-blue-400" />
                    <span>Unlimited workflows per month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-blue-400" />
                    <span>Custom templates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-blue-400" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-blue-400" />
                    <span>Early access to new features</span>
                  </li>
                </ul>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  size="lg" 
                  className="flex-1 !bg-blue-600 hover:!bg-blue-700 !text-white"
                  asChild
                >
                  <Link href="/dashboard">
                    Upgrade to Pro
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="flex-1 !text-white !border-zinc-700 hover:!bg-zinc-800"
                  asChild
                >
                  <Link href="/workflows">
                    Browse Workflows
                  </Link>
                </Button>
              </div>

              <p className="text-center text-xs text-zinc-500">
                Starting at just $19/month • Cancel anytime
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        {/* Header with title and favorite button */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="mb-3 flex items-center gap-3">
              <h1 className="text-4xl font-bold md:text-5xl">
                {workflow.title}
              </h1>
              <Badge variant={tierVariant}>
                {tierLabel}
              </Badge>
            </div>
            <p className="text-lg text-zinc-400">
              {workflow.description}
            </p>
          </div>
          
          {/* Favorite button */}
          <FavoriteButton
            workflowId={workflow.id}
            initialIsFavorited={isFavorited}
            userId={user?.id || null}
            workflowTitle={workflow.title}
          />
        </div>

        {/* Workflow Runner with Limit Guard */}
        <div className="mt-12">
          {workflow.steps && workflow.steps.length > 0 ? (
            <WorkflowLimitGuard 
              userId={user?.id || null}
              workflowId={workflow.id}
              workflowTitle={workflow.title}
            >
              <WorkflowRunnerWrapper 
                workflow={workflow}
                userId={user?.id || null}
              />
            </WorkflowLimitGuard>
          ) : (
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-12 text-center">
              <p className="text-zinc-500">
                No steps configured for this workflow yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

