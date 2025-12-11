import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Clock, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCompatibleToolsDisplay } from '@/lib/constants/ai-tools';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface JobProfile {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  hero_headline: string | null;
  hero_subheadline: string | null;
  meta_title: string | null;
  meta_description: string | null;
  seo_text: string | null;
  status: string;
}

interface CategoryData {
  name: string;
  icon: string;
  slug: string;
}

interface WorkflowData {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string | null;
  difficulty: string | null;
  estimated_minutes: number | null;
  category: CategoryData | null;
}

// Raw types from Supabase (can return arrays for joins)
interface RawWorkflowData {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string | null;
  difficulty: string | null;
  estimated_minutes: number | null;
  category: CategoryData | CategoryData[] | null;
}

interface RawWorkflowJoin {
  is_featured: boolean;
  sort_order: number;
  workflow: RawWorkflowData | RawWorkflowData[] | null;
}

// Fetch profile data (used by both metadata and page)
async function getProfile(slug: string): Promise<JobProfile | null> {
  const supabase = await createClient();
  
  const { data: profile } = await supabase
    .from('job_profiles')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();
  
  return profile;
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getProfile(slug);

  if (!profile) {
    return {
      title: 'Profile Not Found | PromptFinder',
    };
  }

  const title = profile.meta_title || `AI Workflows for ${profile.title} | PromptFinder`;
  const description = profile.meta_description || profile.description || `AI-powered workflows for ${profile.title}. Works with ChatGPT, Claude & Gemini.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://prompt-finder.com/for/${slug}`,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://prompt-finder.com/for/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function JobProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch job profile
  const profile = await getProfile(slug);

  if (!profile) {
    notFound();
  }

  // Fetch workflows for this profile
  const { data: workflowJoins } = await supabase
    .from('workflow_job_profiles')
    .select(`
      is_featured,
      sort_order,
      workflow:workflows(
        id,
        slug,
        title,
        description,
        icon,
        difficulty,
        estimated_minutes,
        category:categories(name, icon, slug)
      )
    `)
    .eq('job_profile_id', profile.id)
    .order('sort_order', { ascending: true });

  // Transform and split workflows
  const allWorkflows: Array<{ workflow: WorkflowData; is_featured: boolean }> = [];
  
  if (workflowJoins) {
    for (const join of workflowJoins as RawWorkflowJoin[]) {
      // Handle Supabase returning array or single object
      const rawWorkflow = Array.isArray(join.workflow) ? join.workflow[0] : join.workflow;
      if (rawWorkflow) {
        // Handle category similarly
        const category = Array.isArray(rawWorkflow.category) ? rawWorkflow.category[0] : rawWorkflow.category;
        const workflow: WorkflowData = {
          id: rawWorkflow.id,
          slug: rawWorkflow.slug,
          title: rawWorkflow.title,
          description: rawWorkflow.description,
          icon: rawWorkflow.icon,
          difficulty: rawWorkflow.difficulty,
          estimated_minutes: rawWorkflow.estimated_minutes,
          category: category || null,
        };
        allWorkflows.push({
          workflow,
          is_featured: join.is_featured,
        });
      }
    }
  }

  const featuredWorkflows = allWorkflows.filter(w => w.is_featured);
  const otherWorkflows = allWorkflows.filter(w => !w.is_featured);
  const totalCount = allWorkflows.length;

  // Build JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": profile.meta_title || `AI Workflows for ${profile.title}`,
    "description": profile.meta_description || profile.description,
    "url": `https://prompt-finder.com/for/${profile.slug}`,
    "publisher": {
      "@type": "Organization",
      "name": "PromptFinder",
      "url": "https://prompt-finder.com"
    },
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": totalCount,
      "itemListElement": featuredWorkflows.map((w, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "url": `https://prompt-finder.com/workflows/${w.workflow.slug}`
      }))
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-12 text-white">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-6xl">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-zinc-500">
          <Link href="/" className="hover:text-zinc-300 transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span>For</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-zinc-300">{profile.title}</span>
        </nav>

        {/* Hero Section */}
        <section className="mb-12">
          <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl mb-4">
            {profile.hero_headline || `AI Workflows for ${profile.title}`}
          </h1>
          <p className="text-lg text-zinc-400 max-w-3xl mb-4">
            {profile.hero_subheadline || profile.description}
          </p>
          <p className="text-sm text-zinc-500">
            <span>Works with: </span>
            <span className="text-zinc-300">{getCompatibleToolsDisplay('any')}</span>
          </p>
        </section>

        {/* Featured Workflows */}
        {featuredWorkflows.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <span className="text-yellow-400">★</span>
              Top Workflows for {profile.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredWorkflows.map(({ workflow }) => (
                <ProfileWorkflowCard 
                  key={workflow.id} 
                  workflow={workflow} 
                  featured={true} 
                />
              ))}
            </div>
          </section>
        )}

        {/* All Other Workflows */}
        {otherWorkflows.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-6">
              All {profile.title} Workflows
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {otherWorkflows.map(({ workflow }) => (
                <ProfileWorkflowCard 
                  key={workflow.id} 
                  workflow={workflow} 
                  featured={false} 
                />
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {totalCount === 0 && (
          <div className="text-center py-16">
            <p className="text-zinc-500 mb-4">No workflows available for this profile yet.</p>
            <Link 
              href="/workflows" 
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Browse all workflows →
            </Link>
          </div>
        )}

        {/* SEO Text */}
        {profile.seo_text && (
          <section className="mt-16 pt-8 border-t border-zinc-800">
            <div className="prose prose-invert prose-zinc max-w-none">
              {profile.seo_text.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="text-zinc-400 mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

// Workflow Card Component for Profile Pages
function ProfileWorkflowCard({ 
  workflow, 
  featured 
}: { 
  workflow: WorkflowData; 
  featured: boolean;
}) {
  return (
    <Link 
      href={`/workflows/${workflow.slug}`}
      className="group block"
    >
      <div 
        className={cn(
          "relative h-full p-5 rounded-xl border transition-all duration-200",
          "bg-zinc-900/50 border-zinc-800",
          "hover:border-zinc-600 hover:bg-zinc-900 hover:scale-[1.02]",
          "hover:shadow-lg hover:shadow-zinc-950/50",
          featured && "ring-1 ring-yellow-500/20"
        )}
      >
        {/* Featured indicator */}
        {featured && (
          <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-[10px] font-medium">
            Featured
          </div>
        )}

        {/* Icon + Title */}
        <div className="flex items-start gap-3 mb-3">
          <span className="text-2xl flex-shrink-0">{workflow.icon || '📝'}</span>
          <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
            {workflow.title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-sm text-zinc-400 line-clamp-2 mb-4 min-h-[2.5rem]">
          {workflow.description}
        </p>

        {/* Footer: Category + Time */}
        <div className="flex items-center justify-between gap-2 pt-3 border-t border-zinc-800/50">
          {/* Category Badge */}
          {workflow.category && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-zinc-800/50 text-xs text-zinc-400">
              <span>{workflow.category.icon}</span>
              <span>{workflow.category.name}</span>
            </span>
          )}

          {/* Estimated Time */}
          {workflow.estimated_minutes && workflow.estimated_minutes > 0 && (
            <span className="inline-flex items-center gap-1 text-xs text-zinc-500">
              <Clock className="h-3 w-3" />
              <span>{workflow.estimated_minutes} min</span>
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

