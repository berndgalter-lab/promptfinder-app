'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, ExternalLink, Calendar, CreditCard, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { type SubscriptionDetails } from '@/lib/subscription';

interface SubscriptionManagementProps {
  details: SubscriptionDetails;
}

export function SubscriptionManagement({ details }: SubscriptionManagementProps) {
  const { plan, status, amount, currency, renewsAt, canceledAt, customerPortalUrl, isActive, isCanceled } = details;

  // Format amount for display
  const formatAmount = (cents: number | null, curr: string | null): string => {
    if (!cents || !curr) return '$0';
    const dollars = cents / 100;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: curr,
    }).format(dollars);
  };

  // Get status badge variant
  const getStatusBadge = () => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-green-600 text-white border-0">
            Active
          </Badge>
        );
      case 'past_due':
        return (
          <Badge className="bg-yellow-600 text-white border-0">
            Payment Due
          </Badge>
        );
      case 'canceled':
        return (
          <Badge className="bg-red-600 text-white border-0">
            Canceled
          </Badge>
        );
      case 'paused':
        return (
          <Badge className="bg-gray-600 text-white border-0">
            Paused
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="border-zinc-800 bg-gradient-to-br from-purple-500/10 to-blue-500/10">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border border-yellow-500/50 flex items-center justify-center">
              <Crown className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl">Pro Subscription</CardTitle>
                {getStatusBadge()}
              </div>
              <CardDescription className="mt-1">
                {plan === 'annual' ? 'Annual Plan' : 'Monthly Plan'}
                {amount && ` • ${formatAmount(amount, currency)}`}
                {plan === 'annual' && ' /year'}
                {plan === 'monthly' && ' /month'}
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Status Information */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Next Billing Date */}
          {renewsAt && isActive && !isCanceled && (
            <div className="flex items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
              <div className="mt-0.5 rounded-full bg-blue-500/20 p-2">
                <Calendar className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-400">Next Billing</p>
                <p className="text-base font-semibold text-white mt-1">
                  {format(new Date(renewsAt), 'MMM d, yyyy', { locale: de })}
                </p>
              </div>
            </div>
          )}

          {/* Canceled but active until period end */}
          {isCanceled && renewsAt && new Date(renewsAt) > new Date() && (
            <div className="flex items-start gap-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
              <div className="mt-0.5 rounded-full bg-yellow-500/20 p-2">
                <AlertCircle className="w-4 h-4 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-yellow-400">Access Until</p>
                <p className="text-base font-semibold text-white mt-1">
                  {format(new Date(renewsAt), 'MMM d, yyyy', { locale: de })}
                </p>
                <p className="text-xs text-zinc-400 mt-1">
                  Subscription canceled but still active
                </p>
              </div>
            </div>
          )}

          {/* Payment Info */}
          {amount && (
            <div className="flex items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
              <div className="mt-0.5 rounded-full bg-green-500/20 p-2">
                <CreditCard className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-400">
                  {plan === 'annual' ? 'Annual Price' : 'Monthly Price'}
                </p>
                <p className="text-base font-semibold text-white mt-1">
                  {formatAmount(amount, currency)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Benefits Reminder */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
          <p className="text-sm font-medium text-white mb-3">Your Pro Benefits:</p>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              Unlimited workflow usage
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              Access to all advanced workflows
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              Priority support
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              Early access to new features
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-4 border-t border-zinc-800">
          {/* Manage Subscription Button */}
          <Button
            asChild
            className="w-full !bg-blue-600 hover:!bg-blue-700 !text-white"
            size="lg"
          >
            <a href={customerPortalUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              Manage Subscription
            </a>
          </Button>

          {/* Additional Info */}
          <p className="text-xs text-zinc-500 text-center">
            Update payment method, change plan, or cancel subscription
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

