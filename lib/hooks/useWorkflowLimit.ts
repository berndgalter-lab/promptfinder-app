'use client';

import { useState, useEffect } from 'react';
import { checkAnonymousLimit, checkUserLimit } from '@/lib/usage-tracking';
import { hasActiveSubscription } from '@/lib/subscription';
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
  });

  useEffect(() => {
    checkLimit();
  }, [userId]);

  const checkLimit = async () => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      if (userId) {
        // Check if Pro user
        const isPro = await hasActiveSubscription(userId);
        
        if (isPro) {
          // Pro users: unlimited
          setState({
            canUse: true,
            count: 0,
            limit: 0,
            remaining: 999,
            showModal: false,
            modalType: null,
            isPro: true,
            isLoading: false,
          });
          return;
        }

        // Free user: check monthly limit
        const limitInfo = await checkUserLimit(userId);
        const { count, limit = 5, canUse, remaining = 0 } = limitInfo;

        setState({
          canUse,
          count,
          limit,
          remaining,
          showModal: !canUse,
          modalType: !canUse ? 'UPGRADE_TO_PRO' : null,
          isPro: false,
          isLoading: false,
        });
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

        setState({
          canUse,
          count,
          limit,
          remaining,
          showModal: modalType !== null,
          modalType,
          isPro: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Error checking workflow limit:', error);
      // On error, allow usage but log the issue
      setState({
        canUse: true,
        count: 0,
        limit: 5,
        remaining: 5,
        showModal: false,
        modalType: null,
        isPro: false,
        isLoading: false,
      });
    }
  };

  const closeModal = () => {
    setState(prev => ({ ...prev, showModal: false, modalType: null }));
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

