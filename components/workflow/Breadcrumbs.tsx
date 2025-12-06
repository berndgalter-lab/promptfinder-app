import Link from 'next/link';

interface BreadcrumbsProps {
  workflowTitle: string;
}

export function Breadcrumbs({ workflowTitle }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center gap-2 text-sm text-zinc-400">
        <li>
          <Link 
            href="/" 
            className="hover:text-zinc-200 transition-colors"
          >
            Home
          </Link>
        </li>
        <li className="text-zinc-600" aria-hidden="true">›</li>
        <li>
          <Link 
            href="/workflows" 
            className="hover:text-zinc-200 transition-colors"
          >
            Workflows
          </Link>
        </li>
        <li className="text-zinc-600" aria-hidden="true">›</li>
        <li>
          <span className="text-zinc-200" aria-current="page">
            {workflowTitle}
          </span>
        </li>
      </ol>
    </nav>
  );
}

