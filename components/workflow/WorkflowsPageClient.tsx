'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { WorkflowCard, type WorkflowCardData } from './WorkflowCard';
import { WorkflowFilters, type Category } from './WorkflowFilters';
import { SearchX } from 'lucide-react';

interface WorkflowsPageClientProps {
  workflows: WorkflowCardData[];
  categories: Category[];
}

export function WorkflowsPageClient({ workflows, categories }: WorkflowsPageClientProps) {
  const searchParams = useSearchParams();
  
  // Initialize state from URL params
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get('category') || null
  );

  // Sync state with URL on navigation (back/forward)
  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
    setSelectedCategory(searchParams.get('category') || null);
  }, [searchParams]);

  // Filter and sort workflows
  const filteredWorkflows = useMemo(() => {
    let result = [...workflows];

    // Filter by category
    if (selectedCategory) {
      result = result.filter(w => w.category?.slug === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(w => {
        const titleMatch = w.title.toLowerCase().includes(query);
        const descMatch = w.description.toLowerCase().includes(query);
        const tagMatch = w.tags?.some(tag => tag.toLowerCase().includes(query)) || false;
        return titleMatch || descMatch || tagMatch;
      });

      // Sort by relevance: title matches first, then description, then tags
      result.sort((a, b) => {
        const aTitle = a.title.toLowerCase().includes(query);
        const bTitle = b.title.toLowerCase().includes(query);
        const aDesc = a.description.toLowerCase().includes(query);
        const bDesc = b.description.toLowerCase().includes(query);
        
        // Title match is highest priority
        if (aTitle && !bTitle) return -1;
        if (!aTitle && bTitle) return 1;
        
        // Description match is second priority
        if (aDesc && !bDesc) return -1;
        if (!aDesc && bDesc) return 1;
        
        return 0;
      });
    }

    return result;
  }, [workflows, searchQuery, selectedCategory]);

  // Calculate category counts based on current search (for dynamic counts)
  const categoryCountsForSearch = useMemo(() => {
    let baseWorkflows = workflows;
    
    // If there's a search query, filter first
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      baseWorkflows = workflows.filter(w => {
        const titleMatch = w.title.toLowerCase().includes(query);
        const descMatch = w.description.toLowerCase().includes(query);
        const tagMatch = w.tags?.some(tag => tag.toLowerCase().includes(query)) || false;
        return titleMatch || descMatch || tagMatch;
      });
    }

    // Count per category
    const counts: Record<string, number> = {};
    baseWorkflows.forEach(w => {
      if (w.category) {
        counts[w.category.slug] = (counts[w.category.slug] || 0) + 1;
      }
    });

    return {
      total: baseWorkflows.length,
      byCategory: counts,
    };
  }, [workflows, searchQuery]);

  // Update categories with dynamic counts
  const categoriesWithCounts = useMemo(() => {
    return categories.map(cat => ({
      ...cat,
      count: categoryCountsForSearch.byCategory[cat.slug] || 0,
    }));
  }, [categories, categoryCountsForSearch]);

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-12 text-white">
      <div className="mx-auto max-w-7xl">
        {/* Hero Section */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold md:text-5xl mb-3">AI Workflows</h1>
          <p className="text-lg text-zinc-400">
            {workflows.length} ready-to-use prompts. Pick one, fill in the blanks, go.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <WorkflowFilters
            categories={categoriesWithCounts}
            totalCount={categoryCountsForSearch.total}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            onSearchChange={setSearchQuery}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Results */}
        {filteredWorkflows.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredWorkflows.map((workflow) => (
              <WorkflowCard key={workflow.id} workflow={workflow} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <SearchX className="h-12 w-12 text-zinc-600 mb-4" />
            <h2 className="text-xl font-semibold text-zinc-300 mb-2">No workflows found</h2>
            <p className="text-zinc-500 max-w-md">
              {searchQuery 
                ? `No results for "${searchQuery}". Try a different search term.`
                : 'No workflows in this category yet.'}
            </p>
            {(searchQuery || selectedCategory) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory(null);
                }}
                className="mt-4 px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

