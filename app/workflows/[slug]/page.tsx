import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/auth';
import { Badge } from '@/components/ui/badge';
import { FavoriteButton } from '@/components/workflow/FavoriteButton';
import { CleanWorkflowRunnerWrapper } from '@/components/workflow/CleanWorkflowRunnerWrapper';
import { WorkflowRunnerWrapper } from '@/components/workflow/WorkflowRunnerWrapper';
import { WorkflowLimitGuard } from '@/components/workflow/WorkflowLimitGuard';
import { OnboardingOverlay } from '@/components/workflow/OnboardingOverlay';
import { notFound } from 'next/navigation';
import { Clock, Target, Sparkles } from 'lucide-react';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import { type Workflow, type WorkflowStep, isPromptStep } from '@/lib/types/workflow';
import { ExampleOutputSection } from '@/components/workflow/ExampleOutputSection';
import { LongDescriptionSection } from '@/components/workflow/LongDescriptionSection';
import { RelatedWorkflows } from '@/components/workflow/RelatedWorkflows';
import { WorkflowRating } from '@/components/workflow/WorkflowRating';
import { Breadcrumbs } from '@/components/workflow/Breadcrumbs';
import { BreadcrumbSchema } from '@/components/workflow/BreadcrumbSchema';
import { getCompatibleToolsDisplay } from '@/lib/constants/ai-tools';

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

// Helper to enhance meta description with AI tool names
function enhanceMetaDescription(description: string): string {
  const toolNames = 'ChatGPT, Claude or Gemini';
  
  // If description already contains tool names, return as-is
  if (description.toLowerCase().includes('chatgpt') || 
      description.toLowerCase().includes('claude') ||
      description.toLowerCase().includes('gemini')) {
    return description.substring(0, 160);
  }
  
  // Find the first period to inject tool names
  const firstPeriod = description.indexOf('.');
  
  if (firstPeriod > 0 && firstPeriod < 80) {
    // Insert tools after first sentence (replacing the period)
    const firstSentence = description.substring(0, firstPeriod);
    const rest = description.substring(firstPeriod + 1).trim();
    return `${firstSentence} with ${toolNames}. ${rest}`.substring(0, 160);
  }
  
  // Fallback: prepend tool info
  return `Use ${toolNames} to ${description.charAt(0).toLowerCase()}${description.slice(1)}`.substring(0, 160);
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: workflow } = await supabase
    .from('workflows')
    .select('title, description, meta_title, meta_description, tool')
    .eq('slug', slug)
    .single();

  if (!workflow) {
    return {
      title: 'Workflow Not Found | PromptFinder',
    };
  }

  // Enhance description with AI tool names for SEO
  const baseDescription = workflow.meta_description || workflow.description;
  const enhancedDescription = enhanceMetaDescription(baseDescription);

  // New title format: "{Title} for ChatGPT & Claude | Free AI Prompt"
  const seoTitle = `${workflow.title} for ChatGPT & Claude | Free AI Prompt`;

  return {
    title: seoTitle,
    description: enhancedDescription,
    alternates: {
      canonical: `https://prompt-finder.com/workflows/${slug}`,
    },
    openGraph: {
      title: seoTitle,
      description: enhancedDescription,
      type: 'website',
      images: [
        {
          url: `https://prompt-finder.com/api/og/${slug}`,
          width: 1200,
          height: 630,
          alt: workflow.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: enhancedDescription,
      images: [`https://prompt-finder.com/api/og/${slug}`],
    },
  };
}

export default async function WorkflowDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  
  // Fetch workflow with category
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
    // Content fields
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

  // Determine if this is a single-prompt workflow (use clean runner) or multi-step
  const isSinglePromptWorkflow = workflow.steps.length === 1 && isPromptStep(workflow.steps[0]);

  // Fetch related workflows from the same category
  let relatedWorkflows: Array<{
    id: number;
    slug: string;
    title: string;
    description: string;
    icon: string;
    estimated_minutes: number;
  }> = [];

  if (workflow.category_id) {
    const { data: related } = await supabase
      .from('workflows')
      .select('id, slug, title, description, icon, estimated_minutes')
      .eq('category_id', workflow.category_id)
      .eq('status', 'published')
      .neq('slug', slug)
      .order('featured', { ascending: false })
      .order('sort_order', { ascending: true })
      .limit(4);

    if (related) {
      relatedWorkflows = related;
    }
  }

  // Fetch ratings for Schema Markup
  const { data: ratings } = await supabase
    .from('workflow_ratings')
    .select('rating')
    .eq('workflow_id', workflow.id);

  const ratingCount = ratings?.length || 0;
  const ratingAverage = ratingCount > 0
    ? ratings!.reduce((sum, r) => sum + r.rating, 0) / ratingCount
    : 0;

  // Build JSON-LD structured data (Article schema for better SEO)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `${workflow.title} - AI Prompt for ChatGPT & Claude`,
    "description": workflow.meta_description || workflow.description,
    "image": `https://prompt-finder.com/api/og/${workflow.slug}`,
    "author": {
      "@type": "Organization",
      "name": "PromptFinder"
    },
    "publisher": {
      "@type": "Organization",
      "name": "PromptFinder",
      "url": "https://prompt-finder.com"
    },
    "datePublished": workflow.created_at,
    "dateModified": rawWorkflow.updated_at || workflow.created_at,
    "keywords": ["ChatGPT", "Claude", "Gemini", "Copilot", ...(workflow.tags || [])],
    "articleSection": workflow.category?.name || "AI Prompts",
    "url": `https://prompt-finder.com/workflows/${workflow.slug}`
  };

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-12 text-white">
      {/* Schema.org JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* BreadcrumbList Schema */}
      <BreadcrumbSchema workflowTitle={workflow.title} workflowSlug={slug} />

      {/* First-time user onboarding */}
      <OnboardingOverlay workflowTitle={workflow.title} />
      
      <div className="mx-auto max-w-4xl">
        
        {/* ============================================ */}
        {/* BREADCRUMBS */}
        {/* ============================================ */}
        <Breadcrumbs workflowTitle={workflow.title} />

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
              <span>{workflow.estimated_minutes} min</span>
            </Badge>
            
            {/* Difficulty */}
            <Badge variant="secondary" className="bg-zinc-800/80 text-zinc-300 border-zinc-700 gap-1.5 py-1 px-2.5">
              <Target className="h-3.5 w-3.5" />
              <span>{formatDifficulty(workflow.difficulty)}</span>
            </Badge>
            
            {/* Time Saved */}
            {workflow.time_saved_minutes && workflow.time_saved_minutes > 0 && (
              <Badge variant="secondary" className="bg-green-950/50 text-green-400 border-green-800/50 gap-1.5 py-1 px-2.5">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Saves {workflow.time_saved_minutes} min of work</span>
              </Badge>
            )}
          </div>

          {/* Works with AI Tools */}
          <p className="mt-3 text-sm text-zinc-500">
            <span>Works with: </span>
            <span className="text-zinc-300">{getCompatibleToolsDisplay(workflow.tool)}</span>
          </p>
        </div>

        {/* ============================================ */}
        {/* 2. USE CASES SECTION */}
        {/* ============================================ */}
        {workflow.use_cases && workflow.use_cases.length > 0 && (
          <div className="mb-6 p-4 rounded-lg bg-zinc-900/50 border border-zinc-800">
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
        {/* 3. EXAMPLE OUTPUT SECTION (Open by default) */}
        {/* ============================================ */}
        {workflow.example_output && (
          <ExampleOutputSection exampleOutput={workflow.example_output} workflowTitle={workflow.title} />
        )}

        {/* ============================================ */}
        {/* 4. LONG DESCRIPTION SECTION (Closed by default) */}
        {/* ============================================ */}
        {workflow.long_description && (
          <LongDescriptionSection longDescription={workflow.long_description} workflowTitle={workflow.title} />
        )}

        {/* ============================================ */}
        {/* 5. DIVIDER */}
        {/* ============================================ */}
        <div className="my-10 border-t border-zinc-800" />

        {/* ============================================ */}
        {/* 6. WORKFLOW RUNNER */}
        {/* ============================================ */}
        <div id="workflow-runner">
          {workflow.steps && workflow.steps.length > 0 ? (
            <WorkflowLimitGuard 
              userId={user?.id || null}
              workflowId={workflow.id}
              workflowTitle={workflow.title}
            >
              {isSinglePromptWorkflow ? (
                // New clean runner for single-prompt workflows
                <CleanWorkflowRunnerWrapper 
                  workflow={workflow}
                  userId={user?.id || null}
                />
              ) : (
                // Original runner for multi-step workflows
                <WorkflowRunnerWrapper 
                  workflow={workflow}
                  userId={user?.id || null}
                />
              )}
            </WorkflowLimitGuard>
          ) : (
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-12 text-center">
              <p className="text-zinc-500">
                No steps configured for this workflow yet.
              </p>
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* 7. RATING SECTION */}
        {/* ============================================ */}
        <div className="mt-8 flex justify-center border-t border-zinc-800 pt-8">
          <WorkflowRating 
            workflowId={workflow.id} 
            userId={user?.id || null}
          />
        </div>

        {/* ============================================ */}
        {/* 8. RELATED WORKFLOWS */}
        {/* ============================================ */}
        {workflow.category && relatedWorkflows.length > 0 && (
          <RelatedWorkflows 
            workflows={relatedWorkflows}
            currentCategory={workflow.category.name}
          />
        )}
      </div>
    </div>
  );
}
