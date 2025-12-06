import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { WorkflowsPageClient } from '@/components/workflow/WorkflowsPageClient';
import type { WorkflowCardData } from '@/components/workflow/WorkflowCard';
import type { Category } from '@/components/workflow/WorkflowFilters';

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient();
  const { count } = await supabase
    .from('workflows')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published');

  const workflowCount = count || 40;

  return {
    title: `${workflowCount}+ Free AI Prompt Templates | PromptFinder`,
    description: `Browse ${workflowCount} ready-to-use AI workflows for email, marketing, business & career. Structured prompts for ChatGPT & Claude that deliver results. Free.`,
    alternates: {
      canonical: 'https://prompt-finder.com/workflows',
    },
    openGraph: {
      title: `${workflowCount}+ Free AI Prompt Templates`,
      description: 'Curated AI workflows for professionals. Email, marketing, business & more.',
      type: 'website',
    },
  };
}

interface CategoryData {
  id: number;
  slug: string;
  name: string;
  icon: string;
}

interface RawWorkflow {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string | null;
  time_saved_minutes: number | null;
  featured: boolean;
  sort_order: number;
  status: string;
  tags: string[] | null;
  // Supabase returns joined data as array
  category: CategoryData | CategoryData[] | null;
}

interface RawCategory {
  id: number;
  slug: string;
  name: string;
  icon: string;
  sort_order: number;
}

export default async function WorkflowsPage() {
  const supabase = await createClient();

  // Fetch all published workflows with category data
  const { data: rawWorkflows, error: workflowsError } = await supabase
    .from('workflows')
    .select(`
      id,
      slug,
      title,
      description,
      icon,
      time_saved_minutes,
      featured,
      sort_order,
      status,
      tags,
      category:categories(id, slug, name, icon)
    `)
    .eq('status', 'published')
    .order('featured', { ascending: false })
    .order('sort_order', { ascending: true });

  // Fetch all categories
  const { data: rawCategories, error: categoriesError } = await supabase
    .from('categories')
    .select('id, slug, name, icon, sort_order')
    .order('sort_order', { ascending: true });

  // Handle errors
  if (workflowsError) {
    console.error('Error fetching workflows:', workflowsError);
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4 text-white">
        <div className="max-w-md text-center">
          <h1 className="mb-4 text-2xl font-bold text-red-500">Error Loading Workflows</h1>
          <p className="text-zinc-400">{workflowsError.message}</p>
        </div>
      </div>
    );
  }

  if (categoriesError) {
    console.error('Error fetching categories:', categoriesError);
  }

  // Transform workflows to card data format
  const workflows: WorkflowCardData[] = (rawWorkflows || []).map((w: RawWorkflow) => {
    // Supabase can return category as array or single object depending on the join
    const category = Array.isArray(w.category) ? w.category[0] : w.category;
    
    return {
      id: w.id,
      slug: w.slug,
      title: w.title,
      description: w.description || '',
      icon: w.icon,
      time_saved_minutes: w.time_saved_minutes,
      featured: w.featured || false,
      tags: w.tags,
      category: category || null,
    };
  });

  // Calculate category counts
  const categoryCounts: Record<string, number> = {};
  workflows.forEach(w => {
    if (w.category) {
      categoryCounts[w.category.slug] = (categoryCounts[w.category.slug] || 0) + 1;
    }
  });

  // Transform categories with counts
  const categories: Category[] = (rawCategories || []).map((c: RawCategory) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    icon: c.icon,
    count: categoryCounts[c.slug] || 0,
  }));

  // Empty state
  if (workflows.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4 text-white">
        <div className="max-w-md text-center">
          <h1 className="mb-4 text-2xl font-bold">No Workflows Found</h1>
          <p className="text-zinc-400">There are no workflows available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <WorkflowsPageClient 
      workflows={workflows} 
      categories={categories} 
    />
  );
}
