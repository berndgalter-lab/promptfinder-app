'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface AuthButtonProps {
  variant?: 'default' | 'mobile';
}

export function AuthButton({ variant = 'default' }: AuthButtonProps) {
  if (variant === 'mobile') {
    return (
      <div className="space-y-2">
        <Link href="/login" className="block">
          <Button 
            variant="ghost"
            className="w-full justify-start text-zinc-400 hover:text-white"
          >
            Sign In
          </Button>
        </Link>
        <Link href="/pricing" className="block">
          <Button className="w-full !bg-white !text-black hover:!bg-zinc-200 font-medium">
            Get Started
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link href="/login">
        <Button 
          variant="ghost"
          className="text-zinc-400 hover:text-white"
        >
          Sign In
        </Button>
      </Link>
      <Link href="/pricing">
        <Button className="!bg-white !text-black hover:!bg-zinc-200 font-medium">
          Get Started
        </Button>
      </Link>
    </div>
  );
}
