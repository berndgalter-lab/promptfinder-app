import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/auth';
import { Badge } from '@/components/ui/badge';
import { FavoriteButton } from '@/components/workflow/FavoriteButton';
import { WorkflowRunnerWrapper } from '@/components/workflow/WorkflowRunnerWrapper';
import { WorkflowLimitGuard } from '@/components/workflow/WorkflowLimitGuard';
import { HowItWorksBox } from '@/components/workflow/HowItWorksBox';
import { OnboardingOverlay } from '@/components/workflow/OnboardingOverlay';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Lock, Zap, Clock, Target, Sparkles, ChevronDown, FileText, BookOpen } from 'lucide-react';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import { type Workflow, type WorkflowStep } from '@/lib/types/workflow';
import { ExampleOutputSection } from '@/components/workflow/ExampleOutputSection';
import { LongDescriptionSection } from '@/components/workflow/LongDescriptionSection';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Helper to format difficulty
function formatDifficulty(difficulty: string): string {
  const map: Record<string, string> = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
  };
  return map[difficulty] || difficulty;
}

export default async function WorkflowDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  
  // Fetch workflow with category (including new fields)
  const { data: rawWorkflow, error: workflowError } = await supabase
    .from('workflows')
    .select(`
      *,
      category:categories(id, slug, name, icon)
    `)
    .eq('slug', slug)
    .single();

  if (workflowError || !rawWorkflow) {
    notFound();
  }

  // Transform to Workflow type with all fields
  const workflow: Workflow & { category?: { id: number; slug: string; name: string; icon: string } | null } = {
    id: rawWorkflow.id,
    slug: rawWorkflow.slug,
    title: rawWorkflow.title,
    description: rawWorkflow.description || '',
    workflow_type: rawWorkflow.workflow_type || 'combined',
    steps: (rawWorkflow.steps || []).map((step: any, index: number) => ({
      number: index + 1,
      type: step.type || 'prompt',
      title: step.title,
      description: step.description,
      ...((!step.type || step.type === 'prompt') && {
        prompt_template: step.prompt_template || '',
        fields: (step.fields || []).map((field: any) => ({
          name: field.name,
          label: field.label,
          type: field.type || 'text',
          required: field.required !== false,
          placeholder: field.placeholder,
          options: field.options,
        })),
      }),
      ...(step.type === 'instruction' && {
        instruction_text: step.instruction_text || '',
        instruction_icon: step.instruction_icon,
      }),
      ...(step.type === 'input' && {
        input_label: step.input_label || '',
        input_placeholder: step.input_placeholder,
        input_description: step.input_description,
      }),
    })) as WorkflowStep[],
    created_at: rawWorkflow.created_at,
    // Extended fields
    category_id: rawWorkflow.category_id ?? null,
    tags: rawWorkflow.tags ?? [],
    tool: rawWorkflow.tool ?? 'any',
    difficulty: rawWorkflow.difficulty ?? 'beginner',
    estimated_minutes: rawWorkflow.estimated_minutes ?? 5,
    icon: rawWorkflow.icon ?? '📝',
    meta_title: rawWorkflow.meta_title ?? null,
    meta_description: rawWorkflow.meta_description ?? null,
    featured: rawWorkflow.featured ?? false,
    usage_count: rawWorkflow.usage_count ?? 0,
    status: rawWorkflow.status ?? 'published',
    sort_order: rawWorkflow.sort_order ?? 0,
    // NEW content fields
    time_saved_minutes: rawWorkflow.time_saved_minutes ?? null,
    use_cases: rawWorkflow.use_cases ?? null,
    example_output: rawWorkflow.example_output ?? null,
    long_description: rawWorkflow.long_description ?? null,
    // Category from join
    category: rawWorkflow.category ?? null,
  };

  // Fetch current user
  const user = await getUser();

  // Check if workflow is favorited
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

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-12 text-white">
      {/* First-time user onboarding */}
      <OnboardingOverlay workflowTitle={workflow.title} />
      
      <div className="mx-auto max-w-4xl">
        
        {/* ============================================ */}
        {/* 1. HERO SECTION */}
        {/* ============================================ */}
        <div className="mb-6">
          {/* Title Row */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">
                  {workflow.title}
                </h1>
                {workflow.category && (
                  <CategoryBadge 
                    slug={workflow.category.slug}
                    name={workflow.category.name}
                    icon={workflow.category.icon}
                  />
                )}
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

          {/* Meta Badges Row */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            {/* Estimated Time */}
            <Badge variant="secondary" className="bg-zinc-800/80 text-zinc-300 border-zinc-700 gap-1.5 py-1 px-2.5">
              <Clock className="h-3.5 w-3.5" />
              <span>{workflow.estimated_minutes} Min</span>
            </Badge>
            
            {/* Difficulty */}
            <Badge variant="secondary" className="bg-zinc-800/80 text-zinc-300 border-zinc-700 gap-1.5 py-1 px-2.5">
              <Target className="h-3.5 w-3.5" />
              <span>{formatDifficulty(workflow.difficulty)}</span>
            </Badge>
            
            {/* Time Saved (only if available) */}
            {workflow.time_saved_minutes && workflow.time_saved_minutes > 0 && (
              <Badge variant="secondary" className="bg-green-950/50 text-green-400 border-green-800/50 gap-1.5 py-1 px-2.5">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Saves {workflow.time_saved_minutes} min of work</span>
              </Badge>
            )}
          </div>
        </div>

        {/* ============================================ */}
        {/* 2. USE CASES SECTION */}
        {/* ============================================ */}
        {workflow.use_cases && workflow.use_cases.length > 0 && (
          <div className="mb-8 p-4 rounded-lg bg-zinc-900/50 border border-zinc-800">
            <p className="text-sm text-zinc-500 mb-2">Perfect for:</p>
            <div className="flex flex-wrap gap-2">
              {workflow.use_cases.map((useCase, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-zinc-800 text-zinc-300 border border-zinc-700"
                >
                  {useCase}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* 3. EXAMPLE OUTPUT SECTION (Collapsible) */}
        {/* ============================================ */}
        {workflow.example_output && (
          <ExampleOutputSection exampleOutput={workflow.example_output} />
        )}

        {/* ============================================ */}
        {/* 4. HOW IT WORKS (existing) */}
        {/* ============================================ */}
        <div className="mt-6">
          <HowItWorksBox 
            estimatedMinutes={workflow.estimated_minutes}
            difficulty={workflow.difficulty}
            tool={workflow.tool}
          />
        </div>

        {/* ============================================ */}
        {/* 5. LONG DESCRIPTION SECTION (Collapsible) */}
        {/* ============================================ */}
        {workflow.long_description && (
          <LongDescriptionSection longDescription={workflow.long_description} />
        )}

        {/* ============================================ */}
        {/* 6. WORKFLOW RUNNER */}
        {/* ============================================ */}
        <div className="mt-12" id="workflow-runner">
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
