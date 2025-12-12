'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { User, Settings, CreditCard, LogOut, ChevronDown, ExternalLink } from 'lucide-react';

interface UserDropdownProps {
  email: string;
  isPro: boolean;
}

// Lemon Squeezy Customer Portal URL
const CUSTOMER_PORTAL_URL = 'https://promptfinder.lemonsqueezy.com/billing';

export function UserDropdown({ email, isPro }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setIsOpen(false);
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-800 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
          <User className="w-4 h-4 text-zinc-300" />
        </div>
        <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 py-2 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl z-50">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-zinc-800">
            <div className="text-sm font-medium text-white truncate">{email}</div>
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
          
          {/* Menu Items */}
          <div className="py-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <User className="w-4 h-4" />
              Dashboard
            </Link>
            
            <Link
              href="/settings"
              className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="w-4 h-4" />
              Settings
            </Link>
            
            <a
              href={CUSTOMER_PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <CreditCard className="w-4 h-4" />
              Manage Subscription
              <ExternalLink className="w-3 h-3 ml-auto text-zinc-500" />
            </a>
          </div>
          
          {/* Sign Out */}
          <div className="border-t border-zinc-800 pt-1 mt-1">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

