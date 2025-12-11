import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export const revalidate = 3600; // ISR: revalidate every hour

export const metadata: Metadata = {
  title: 'AI Workflows by Role | PromptFinder',
  description: 'Find AI workflows built for your job. Browse curated workflow libraries for marketers, founders, creators, e-commerce sellers, freelancers, and more.',
  alternates: {
    canonical: 'https://prompt-finder.com/for',
  },
  openGraph: {
    title: 'AI Workflows by Role | PromptFinder',
    description: 'Find AI workflows built for your job. Browse curated workflow libraries for marketers, founders, creators, e-commerce sellers, freelancers, and more.',
    type: 'website',
    url: 'https://prompt-finder.com/for',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Workflows by Role | PromptFinder',
    description: 'Find AI workflows built for your job. Browse curated workflow libraries for marketers, founders, creators, e-commerce sellers, freelancers, and more.',
  },
};

interface JobProfile {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
  workflow_job_profiles: { count: number }[];
}

export default async function ForHubPage() {
  const supabase = await createClient();

  // Load all published profiles with workflow counts
  const { data: profiles } = await supabase
    .from('job_profiles')
    .select(`
      id, slug, title, description, icon, sort_order,
      workflow_job_profiles(count)
    `)
    .eq('status', 'published')
    .order('sort_order', { ascending: true });

  // Transform profiles with counts
  const profilesWithCounts = (profiles as JobProfile[] || []).map(profile => ({
    ...profile,
    workflowCount: profile.workflow_job_profiles?.[0]?.count || 0,
  }));

  // Build JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "AI Workflows by Role",
    "description": "Find AI workflows built for your job. Browse curated workflow libraries for marketers, founders, creators, e-commerce sellers, freelancers, and more.",
    "url": "https://prompt-finder.com/for",
    "publisher": {
      "@type": "Organization",
      "name": "PromptFinder",
      "url": "https://prompt-finder.com"
    },
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": profilesWithCounts.length,
      "itemListElement": profilesWithCounts.map((profile, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "name": profile.title,
        "url": `https://prompt-finder.com/for/${profile.slug}`
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
          <span className="text-zinc-300">Browse by Role</span>
        </nav>

        {/* Hero Section */}
        <section className="mb-12">
          <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl mb-4">
            AI Workflows for Every Role
          </h1>
          <p className="text-lg text-zinc-400 max-w-3xl">
            Find workflows built for your job. Whether you&apos;re a marketer, founder, creator, or seller — there&apos;s a workflow library waiting for you.
          </p>
        </section>

        {/* Profile Cards Grid */}
        <section className="mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {profilesWithCounts.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>
        </section>

        {/* Empty State */}
        {profilesWithCounts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-zinc-500 mb-4">No role profiles available yet.</p>
            <Link 
              href="/workflows" 
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Browse all workflows →
            </Link>
          </div>
        )}

        {/* Bottom CTA */}
        <section className="text-center py-8 border-t border-zinc-800">
          <p className="text-zinc-400">
            Don&apos;t see your role?{' '}
            <Link 
              href="/workflows" 
              className="text-blue-400 hover:text-blue-300 underline transition-colors"
            >
              All 160+ workflows are available in our main library
            </Link>
            .
          </p>
        </section>

        {/* SEO Text */}
        <section className="mt-8 pt-8 border-t border-zinc-800">
          <p className="text-sm text-zinc-500 max-w-3xl">
            PromptFinder organizes AI workflows by role to help you find exactly what you need. Each role library contains curated prompts and workflows designed for specific job functions — from content marketing and SEO to sales outreach and e-commerce optimization. All workflows work with ChatGPT, Claude, Gemini, and other AI tools.
          </p>
        </section>
      </div>
    </div>
  );
}

// Profile Card Component
function ProfileCard({ 
  profile 
}: { 
  profile: {
    slug: string;
    title: string;
    description: string | null;
    icon: string | null;
    workflowCount: number;
  };
}) {
  return (
    <Link 
      href={`/for/${profile.slug}`}
      className="group block"
    >
      <div 
        className={cn(
          "relative h-full p-5 rounded-xl border transition-all duration-200",
          "bg-zinc-900/50 border-zinc-800",
          "hover:border-zinc-600 hover:bg-zinc-900 hover:scale-[1.02]",
          "hover:shadow-lg hover:shadow-zinc-950/50"
        )}
      >
        {/* Icon */}
        <div className="text-3xl mb-3 text-center">
          {profile.icon || '💼'}
        </div>

        {/* Title */}
        <h2 className="font-semibold text-white text-center group-hover:text-blue-400 transition-colors mb-2">
          {profile.title}
        </h2>

        {/* Description */}
        {profile.description && (
          <p className="text-sm text-zinc-400 text-center line-clamp-2 mb-4">
            {profile.description}
          </p>
        )}

        {/* Workflow Count Badge */}
        <div className="flex justify-center">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-zinc-800 text-zinc-400 border border-zinc-700">
            {profile.workflowCount} workflows
          </span>
        </div>
      </div>
    </Link>
  );
}

