'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavLinksProps {
  isLoggedIn: boolean;
}

export function NavLinks({ isLoggedIn }: NavLinksProps) {
  const pathname = usePathname();

  const links = [
    { href: '/workflows', label: 'Workflows', showAlways: true },
    { href: '/pricing', label: 'Pricing', showAlways: true },
    { href: '/dashboard', label: 'Dashboard', showAlways: false },
    { href: '/history', label: 'History', showAlways: false },
  ];

  const visibleLinks = links.filter(link => link.showAlways || isLoggedIn);

  return (
    <nav className="flex items-center gap-1">
      {visibleLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            'px-3 py-2 text-sm font-medium rounded-md transition-colors',
            pathname === link.href
              ? 'bg-zinc-800 text-white'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

