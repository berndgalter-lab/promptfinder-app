'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, ShieldCheck, Settings, CreditCard, LogOut, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { SignInModal } from '@/components/auth/SignInModal';
import { createClient } from '@/lib/supabase/client';

interface NavLinksProps {
  isLoggedIn: boolean;
  isAdmin?: boolean;
  userEmail?: string;
  isPro?: boolean;
}

// Lemon Squeezy Customer Portal URL
const CUSTOMER_PORTAL_URL = 'https://promptfinder.lemonsqueezy.com/billing';

export function NavLinks({ isLoggedIn, isAdmin = false, userEmail = '', isPro = false }: NavLinksProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const supabase = createClient();

  const handleSignOut = async () => {
    setOpen(false);
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  // Public links (shown to everyone)
  const publicLinks = [
    { href: '/workflows', label: 'Workflows' },
    { href: '/for', label: 'By Role' },
    { href: '/pricing', label: 'Pricing' },
  ];

  // Additional links for logged-in users
  const authLinks = [
    ...publicLinks,
    { href: '/dashboard', label: 'Dashboard' },
  ];

  const visibleLinks = isLoggedIn ? authLinks : publicLinks;

  // Helper to check if link is active (handles /for and /for/[slug])
  const isActive = (href: string) => {
    if (href === '/for') {
      return pathname === '/for' || pathname.startsWith('/for/');
    }
    return pathname === href;
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-1">
        {visibleLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
              'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
              isActive(link.href)
                  ? 'bg-zinc-800 text-white'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              )}
            >
              {link.label}
            </Link>
        ))}
        
        {/* Admin link - only for admins */}
        {isAdmin && (
          <Link
            href="/admin"
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5',
              pathname === '/admin'
                ? 'bg-purple-900/50 text-purple-300'
                : 'text-purple-400 hover:text-purple-300 hover:bg-zinc-800/50'
            )}
          >
            <ShieldCheck className="h-4 w-4" />
            Admin
          </Link>
        )}
      </nav>

      {/* Mobile Navigation (Hamburger Menu) */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[280px] bg-zinc-950 border-zinc-800">
          <SheetHeader>
            <SheetTitle className="text-white text-left">Menu</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-2 mt-6">
            {visibleLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                  'px-4 py-3 text-base font-medium rounded-lg transition-colors',
                  isActive(link.href)
                      ? 'bg-zinc-800 text-white'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                  )}
                >
                  {link.label}
                </Link>
            ))}
            
            {/* Admin link in mobile */}
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className={cn(
                  'px-4 py-3 text-base font-medium rounded-lg transition-colors flex items-center gap-2',
                  pathname === '/admin'
                    ? 'bg-purple-900/50 text-purple-300'
                    : 'text-purple-400 hover:text-purple-300 hover:bg-zinc-800/50'
                )}
              >
                <ShieldCheck className="h-5 w-5" />
                Admin
              </Link>
            )}
          </nav>
          
          {/* Auth Section in Mobile Sheet */}
          <div className="mt-8 pt-6 border-t border-zinc-800">
            {isLoggedIn ? (
              <>
                {/* User Info */}
                <div className="px-4 pb-4 border-b border-zinc-800 mb-4">
                  <div className="text-sm font-medium text-white truncate">{userEmail}</div>
                  <div className="text-xs text-zinc-400 flex items-center gap-1 mt-1">
                    {isPro ? (
                      <>
                        <span className="text-yellow-500">✨</span>
                        <span>Pro Plan</span>
                      </>
                    ) : (
                      <span>Free Plan</span>
                    )}
                  </div>
                </div>

                {/* Account Links */}
                <div className="space-y-1">
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    Dashboard
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                    Settings
                  </Link>
                  <a
                    href={CUSTOMER_PORTAL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    <CreditCard className="w-5 h-5" />
                    Manage Subscription
                  </a>
                </div>

                {/* Sign Out */}
                <div className="mt-4 pt-4 border-t border-zinc-800">
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <>
            <p className="text-xs text-zinc-500 mb-3 px-4">Account</p>
                <div className="space-y-2 px-4">
                  <Button 
                    onClick={() => {
                      setOpen(false);
                      setShowSignIn(true);
                    }}
                    variant="outline"
                    className="w-full !text-white !border-zinc-700 hover:!bg-zinc-800"
                  >
                    Sign In
                  </Button>
                  <Link href="/pricing" onClick={() => setOpen(false)}>
                    <Button className="w-full !bg-white !text-black hover:!bg-zinc-200 font-medium">
                      Get Started
                    </Button>
                  </Link>
            </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Sign In Modal (for mobile) */}
      <SignInModal open={showSignIn} onOpenChange={setShowSignIn} />
    </>
  );
}
