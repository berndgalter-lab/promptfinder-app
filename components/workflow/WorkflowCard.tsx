'use client';

import Link from 'next/link';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface WorkflowCardData {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string | null;
  time_saved_minutes: number | null;
  featured: boolean;
  tags: string[] | null;
  category: {
    id: number;
    slug: string;
    name: string;
    icon: string;
  } | null;
}

interface WorkflowCardProps {
  workflow: WorkflowCardData;
}

export function WorkflowCard({ workflow }: WorkflowCardProps) {
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
          workflow.featured && "ring-1 ring-yellow-500/20"
        )}
      >
        {/* Featured indicator */}
        {workflow.featured && (
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

        {/* Footer: Category + Time Saved */}
        <div className="flex items-center justify-between gap-2 pt-3 border-t border-zinc-800/50">
          {/* Category Badge */}
          {workflow.category && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-zinc-800/50 text-xs text-zinc-400">
              <span>{workflow.category.icon}</span>
              <span>{workflow.category.name}</span>
            </span>
          )}

          {/* Time Saved */}
          {workflow.time_saved_minutes && workflow.time_saved_minutes > 0 && (
            <span className="inline-flex items-center gap-1 text-xs text-zinc-500">
              <Clock className="h-3 w-3" />
              <span>Saves {workflow.time_saved_minutes} min</span>
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

