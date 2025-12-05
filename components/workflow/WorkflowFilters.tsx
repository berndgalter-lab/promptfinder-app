'use client';

import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface Category {
  id: number;
  slug: string;
  name: string;
  icon: string;
  count: number;
}

interface WorkflowFiltersProps {
  categories: Category[];
  totalCount: number;
  searchQuery: string;
  selectedCategory: string | null;
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: string | null) => void;
}

export function WorkflowFilters({
  categories,
  totalCount,
  searchQuery,
  selectedCategory,
  onSearchChange,
  onCategoryChange,
}: WorkflowFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Update URL when filters change
  const updateURL = useCallback((newQuery: string, newCategory: string | null) => {
    const params = new URLSearchParams();
    if (newQuery) params.set('q', newQuery);
    if (newCategory) params.set('category', newCategory);
    
    const queryString = params.toString();
    router.push(queryString ? `/workflows?${queryString}` : '/workflows', { scroll: false });
  }, [router]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    onSearchChange(newQuery);
    updateURL(newQuery, selectedCategory);
  };

  const handleClearSearch = () => {
    onSearchChange('');
    updateURL('', selectedCategory);
  };

  const handleCategoryClick = (categorySlug: string | null) => {
    onCategoryChange(categorySlug);
    updateURL(searchQuery, categorySlug);
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <Input
          type="text"
          placeholder="Search workflows..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-10 pr-10 bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-500 focus:border-zinc-600 focus:ring-zinc-600/20 h-11"
        />
        {searchQuery && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {/* All Tab */}
        <button
          onClick={() => handleCategoryClick(null)}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all",
            selectedCategory === null
              ? "bg-white text-zinc-900"
              : "bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          )}
        >
          All ({totalCount})
        </button>

        {/* Category Tabs */}
        {categories.map((category) => (
          <button
            key={category.slug}
            onClick={() => handleCategoryClick(category.slug)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5",
              selectedCategory === category.slug
                ? "bg-white text-zinc-900"
                : "bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-white"
            )}
          >
            <span>{category.icon}</span>
            <span>{category.name}</span>
            <span className="text-xs opacity-70">({category.count})</span>
          </button>
        ))}
      </div>
    </div>
  );
}

