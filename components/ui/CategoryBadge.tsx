import Link from 'next/link';

interface CategoryBadgeProps {
  slug: string;
  name: string;
  icon: string;
  clickable?: boolean;
  className?: string;
}

export function CategoryBadge({ 
  slug, 
  name, 
  icon, 
  clickable = true,
  className = '' 
}: CategoryBadgeProps) {
  const content = (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors ${className}`}>
      <span>{icon}</span>
      <span>{name}</span>
    </span>
  );

  if (clickable) {
    return (
      <Link href={`/categories/${slug}`} className="inline-block">
        {content}
      </Link>
    );
  }

  return content;
}

