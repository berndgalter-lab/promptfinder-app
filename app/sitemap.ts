import { MetadataRoute } from 'next';

// Force dynamic generation (no caching)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const BASE_URL = 'https://prompt-finder.com';

interface Workflow {
  slug: string;
  updated_at: string | null;
}

async function getWorkflows(): Promise<Workflow[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('[Sitemap] Missing Supabase credentials');
    return [];
  }

  try {
    // Use REST API directly - more reliable than the JS client
    const response = await fetch(
      `${supabaseUrl}/rest/v1/workflows?status=eq.published&select=slug,updated_at`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Sitemap] Supabase API error:', response.status, errorText);
      return [];
    }

    const workflows = await response.json();
    console.log(`[Sitemap] Found ${workflows.length} published workflows`);
    return workflows;
  } catch (error) {
    console.error('[Sitemap] Fetch error:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/workflows`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    // Legal pages (DE)
    {
      url: `${BASE_URL}/datenschutz`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/impressum`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/widerruf`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    // Legal pages (EN)
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/legal-notice`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/cancellation`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/refund`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/cookies`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  // Dynamic workflow pages from Supabase
  const workflows = await getWorkflows();
  
  const workflowPages: MetadataRoute.Sitemap = workflows.map((workflow) => ({
    url: `${BASE_URL}/workflows/${workflow.slug}`,
    lastModified: workflow.updated_at ? new Date(workflow.updated_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  console.log(`[Sitemap] Total URLs: ${staticPages.length + workflowPages.length}`);
  return [...staticPages, ...workflowPages];
}
