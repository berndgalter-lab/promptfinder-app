import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

const BASE_URL = 'https://prompt-finder.com';

// Create a simple Supabase client for public data (no auth needed)
function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    console.error('Supabase env vars missing for sitemap');
    return null;
  }
  
  return createClient(url, key);
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
  let workflowPages: MetadataRoute.Sitemap = [];

  try {
    const supabase = getSupabaseClient();
    
    if (supabase) {
      const { data: workflows, error } = await supabase
        .from('workflows')
        .select('slug, updated_at')
        .eq('status', 'published')
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Supabase error in sitemap:', error.message);
      }

      if (workflows && workflows.length > 0) {
        console.log(`Sitemap: Found ${workflows.length} workflows`);
        workflowPages = workflows.map((workflow) => ({
          url: `${BASE_URL}/workflows/${workflow.slug}`,
          lastModified: workflow.updated_at ? new Date(workflow.updated_at) : new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        }));
      }
    }
  } catch (error) {
    console.error('Error fetching workflows for sitemap:', error);
  }

  return [...staticPages, ...workflowPages];
}

