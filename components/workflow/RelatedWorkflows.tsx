import Link from 'next/link';
import { Clock } from 'lucide-react';

interface RelatedWorkflow {
  id: number;
  slug: string;
  title: string;
  description: string;
  icon: string;
  estimated_minutes: number;
}

interface RelatedWorkflowsProps {
  workflows: RelatedWorkflow[];
  currentCategory: string;
}

export function RelatedWorkflows({ workflows, currentCategory }: RelatedWorkflowsProps) {
  if (!workflows || workflows.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 pt-10 border-t border-zinc-800">
      <h2 className="text-2xl font-bold text-white mb-6">
        More {currentCategory} Workflows
      </h2>
      
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {workflows.map((workflow) => (
          <Link
            key={workflow.id}
            href={`/workflows/${workflow.slug}`}
            className="group block rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 transition-all hover:border-zinc-700 hover:bg-zinc-900"
          >
            {/* Icon & Title */}
            <div className="flex items-start gap-2 mb-2">
              <span className="text-2xl flex-shrink-0" role="img" aria-hidden="true">
                {workflow.icon}
              </span>
              <h3 className="font-medium text-white text-sm leading-tight group-hover:text-blue-400 transition-colors line-clamp-2">
                {workflow.title}
              </h3>
            </div>
            
            {/* Description */}
            <p className="text-xs text-zinc-500 line-clamp-2 mb-3">
              {workflow.description}
            </p>
            
            {/* Time Badge */}
            <div className="flex items-center gap-1 text-xs text-zinc-500">
              <Clock className="h-3 w-3" />
              <span>{workflow.estimated_minutes} min</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

