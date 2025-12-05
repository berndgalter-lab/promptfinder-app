'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { AuthButton } from '@/components/auth/AuthButton';

interface NavLinksProps {
  isLoggedIn: boolean;
  isAdmin?: boolean;
}

export function NavLinks({ isLoggedIn, isAdmin = false }: NavLinksProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { href: '/workflows', label: 'Workflows', showAlways: true, adminOnly: false },
    { href: '/pricing', label: 'Pricing', showAlways: true, adminOnly: false },
    { href: '/dashboard', label: 'Dashboard', showAlways: false, adminOnly: false },
    { href: '/history', label: 'History', showAlways: false, adminOnly: false },
    { href: '/admin', label: 'Admin', showAlways: false, adminOnly: true },
  ];

  const visibleLinks = links.filter(link => {
    if (link.adminOnly) return isAdmin;
    return link.showAlways || isLoggedIn;
  });

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-1">
        {visibleLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5',
              pathname === link.href
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50',
              link.adminOnly && 'text-purple-400 hover:text-purple-300'
            )}
          >
            {link.adminOnly && <ShieldCheck className="h-4 w-4" />}
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Mobile Navigation */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Menü öffnen</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[280px] bg-zinc-950 border-zinc-800">
          <SheetHeader>
            <SheetTitle className="text-white text-left">Navigation</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-2 mt-6">
            {visibleLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'px-4 py-3 text-base font-medium rounded-lg transition-colors flex items-center gap-2',
                  pathname === link.href
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50',
                  link.adminOnly && 'text-purple-400 hover:text-purple-300'
                )}
              >
                {link.adminOnly && <ShieldCheck className="h-5 w-5" />}
                {link.label}
              </Link>
            ))}
          </nav>
          
          {/* Auth Section im Mobile-Sheet */}
          <div className="mt-8 pt-6 border-t border-zinc-800">
            <p className="text-xs text-zinc-500 mb-3 px-4">Account</p>
            <div className="px-4">
              <AuthButton />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
