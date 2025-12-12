'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SignInModal } from './SignInModal';

interface AuthButtonProps {
  variant?: 'default' | 'mobile';
}

export function AuthButton({ variant = 'default' }: AuthButtonProps) {
  const [showSignIn, setShowSignIn] = useState(false);

  if (variant === 'mobile') {
    return (
      <div className="space-y-2">
        <Button 
          onClick={() => setShowSignIn(true)}
          variant="ghost"
          className="w-full justify-start text-zinc-400 hover:text-white"
        >
          Sign In
        </Button>
        <Link href="/pricing" className="block">
          <Button className="w-full !bg-white !text-black hover:!bg-zinc-200 font-medium">
            Get Started
          </Button>
        </Link>
        <SignInModal open={showSignIn} onOpenChange={setShowSignIn} />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <Button 
          onClick={() => setShowSignIn(true)}
          variant="ghost"
          className="text-zinc-400 hover:text-white"
        >
          Sign In
        </Button>
        <Link href="/pricing">
          <Button className="!bg-white !text-black hover:!bg-zinc-200 font-medium">
            Get Started
      </Button>
        </Link>
    </div>
      <SignInModal open={showSignIn} onOpenChange={setShowSignIn} />
    </>
  );
}
