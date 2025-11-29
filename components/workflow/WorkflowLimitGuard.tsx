'use client';

import { ReactNode } from 'react';
import { useWorkflowLimit } from '@/lib/hooks/useWorkflowLimit';
import { LimitModal } from './LimitModal';
import { Card, CardContent } from '@/components/ui/card';
import { Lock, Loader2 } from 'lucide-react';

interface WorkflowLimitGuardProps {
  userId: string | null;
  children: ReactNode;
}

export function WorkflowLimitGuard({ userId, children }: WorkflowLimitGuardProps) {
  const {
    canUse,
    showModal,
    modalType,
    remaining,
    closeModal,
    isLoading,
  } = useWorkflowLimit(userId);

  if (isLoading) {
    return (
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardContent className="p-12 text-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">Loading workflow...</p>
        </CardContent>
      </Card>
    );
  }

  // If hard limit reached, show block message
  if (!canUse && modalType === 'SIGN_UP_HARD') {
    return (
      <>
        <Card className="border-amber-600/50 bg-zinc-900/50">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-600/20 border border-amber-600/50 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-amber-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Workflow Limit Reached
            </h3>
            <p className="text-zinc-300 mb-4">
              You've used all 5 free workflows. Sign up for free to continue!
            </p>
          </CardContent>
        </Card>
        <LimitModal
          isOpen={showModal}
          onClose={closeModal}
          type={modalType}
          remaining={remaining}
        />
      </>
    );
  }

  if (!canUse && modalType === 'UPGRADE_TO_PRO') {
    return (
      <>
        <Card className="border-purple-600/50 bg-zinc-900/50">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-purple-600/20 border border-purple-600/50 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Monthly Limit Reached
            </h3>
            <p className="text-zinc-300 mb-4">
              You've used all 5 workflows this month. Upgrade to Pro for unlimited access!
            </p>
          </CardContent>
        </Card>
        <LimitModal
          isOpen={showModal}
          onClose={closeModal}
          type={modalType}
          remaining={remaining}
        />
      </>
    );
  }

  // Can use workflow - render children and optional modal
  return (
    <>
      {children}
      {showModal && modalType && (
        <LimitModal
          isOpen={showModal}
          onClose={closeModal}
          type={modalType}
          remaining={remaining}
        />
      )}
    </>
  );
}

