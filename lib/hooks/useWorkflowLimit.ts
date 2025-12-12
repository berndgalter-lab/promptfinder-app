'use client';

import { useState, useEffect } from 'react';
import { checkAnonymousLimit, checkUserLimit } from '@/lib/usage-tracking';
import { hasActiveSubscriptionClient } from '@/lib/subscription-client';
import type { LimitModalType } from '@/components/workflow/LimitModal';

export interface WorkflowLimitState {
  canUse: boolean;
  count: number;
  limit: number;
  remaining: number;
  showModal: boolean;
  modalType: LimitModalType | null;
  isPro: boolean;
  isLoading: boolean;
  userDismissed: boolean; // Track if user chose to wait
}

export function useWorkflowLimit(userId: string | null) {
  const [state, setState] = useState<WorkflowLimitState>({
    canUse: true,
    count: 0,
    limit: 0,
    remaining: 0,
    showModal: false,
    modalType: null,
    isPro: false,
    isLoading: true,
    userDismissed: false,
  });

  useEffect(() => {
    checkLimit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const checkLimit = async () => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      if (userId) {
        // Check if Pro user
        const isPro = await hasActiveSubscriptionClient(userId);
        
        if (isPro) {
          // Pro users: unlimited
          setState(prev => ({
            canUse: true,
            count: 0,
            limit: 0,
            remaining: 999,
            showModal: false,
            modalType: null,
            isPro: true,
            isLoading: false,
            userDismissed: prev.userDismissed, // Preserve dismissal state
          }));
          return;
        }

        // Free user: check monthly limit
        const limitInfo = await checkUserLimit(userId);
        const { count, limit = 5, canUse, remaining = 0 } = limitInfo;

        setState(prev => ({
          canUse: prev.userDismissed ? true : canUse, // Respect user's choice to wait
          count,
          limit,
          remaining,
          showModal: prev.userDismissed ? false : !canUse,
          modalType: prev.userDismissed ? null : (!canUse ? 'UPGRADE_TO_PRO' : null),
          isPro: false,
          isLoading: false,
          userDismissed: prev.userDismissed, // Preserve dismissal state
        }));
      } else {
        // Anonymous user: check combined limit
        const limitInfo = checkAnonymousLimit();
        const { count, limit = 5, canUse, remaining = 0, showSignUpPrompt } = limitInfo;

        let modalType: LimitModalType | null = null;
        
        if (!canUse) {
          // Hard limit reached
          modalType = 'SIGN_UP_HARD';
        } else if (showSignUpPrompt && count >= 3) {
          // Soft limit reached
          modalType = 'SIGN_UP_SOFT';
        }

        setState(prev => ({
          canUse: prev.userDismissed ? true : canUse,
          count,
          limit,
          remaining,
          showModal: prev.userDismissed ? false : modalType !== null,
          modalType: prev.userDismissed ? null : modalType,
          isPro: false,
          isLoading: false,
          userDismissed: prev.userDismissed, // Preserve dismissal state
        }));
      }
    } catch (error) {
      console.error('Error checking workflow limit:', error);
      // On error, allow usage but log the issue
      setState(prev => ({
        canUse: true,
        count: 0,
        limit: 5,
        remaining: 5,
        showModal: false,
        modalType: null,
        isPro: false,
        isLoading: false,
        userDismissed: prev.userDismissed, // Preserve dismissal state
      }));
    }
  };

  const closeModal = () => {
    setState(prev => ({ 
      ...prev, 
      showModal: false, 
      modalType: null,
      // If user chooses to wait, allow workflow usage despite limit
      canUse: true,
      userDismissed: true // Mark that user dismissed the modal
    }));
  };

  const refreshLimit = () => {
    checkLimit();
  };

  return {
    ...state,
    closeModal,
    refreshLimit,
  };
}

