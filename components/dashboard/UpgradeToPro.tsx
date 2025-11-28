'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Crown, Sparkles } from 'lucide-react';

interface UpgradeToProProps {
  currentPlan: 'free' | 'monthly' | 'annual';
  monthlyUsage: number;
}

const MONTHLY_CHECKOUT = 'https://promptfinder.lemonsqueezy.com/buy/c534f3ab-80c2-4a53-86ff-69c05e62a79a';
const ANNUAL_CHECKOUT = 'https://promptfinder.lemonsqueezy.com/buy/f7107575-9075-4e57-8440-7f511102db70';

export function UpgradeToPro({ currentPlan, monthlyUsage }: UpgradeToProProps) {
  // Show Pro status if already subscribed
  if (currentPlan !== 'free') {
    return (
      <Card className="border-zinc-800 bg-gradient-to-br from-purple-500/10 to-blue-500/10">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-500" />
            <CardTitle>Pro Member</CardTitle>
            <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-0">
              {currentPlan === 'annual' ? 'Annual' : 'Monthly'}
            </Badge>
          </div>
          <CardDescription>
            You have unlimited access to all workflows and features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span>Thanks for supporting PromptFinder!</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const FREE_LIMIT = 5;
  const isNearLimit = monthlyUsage >= 4;
  const limitReached = monthlyUsage >= FREE_LIMIT;

  return (
    <Card className={`border-2 transition-all ${
      limitReached
        ? 'border-red-500/50 bg-gradient-to-br from-red-500/10 to-orange-500/10'
        : isNearLimit 
        ? 'border-yellow-500/50 bg-gradient-to-br from-yellow-500/10 to-orange-500/10' 
        : 'border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-purple-500/10'
    }`}>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-blue-400" />
            <CardTitle className="text-2xl">Upgrade to Pro</CardTitle>
          </div>
          {monthlyUsage > 0 && (
            <Badge 
              variant="outline" 
              className={`${
                limitReached 
                  ? 'text-red-500 border-red-500/50 bg-red-500/10' 
                  : isNearLimit
                  ? 'text-yellow-500 border-yellow-500/50 bg-yellow-500/10'
                  : 'text-zinc-400 border-zinc-600'
              }`}
            >
              {limitReached 
                ? 'Limit reached' 
                : `${FREE_LIMIT - monthlyUsage} left this month`
              }
            </Badge>
          )}
        </div>
        <CardDescription className="text-base">
          {limitReached 
            ? "You've used all 5 free workflows this month. Upgrade now for unlimited access!"
            : isNearLimit 
            ? "You're almost out of free workflows this month. Upgrade for unlimited access!"
            : "Unlock unlimited workflows and premium features"
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Features Grid */}
        <div className="grid gap-3">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-full bg-green-500/20 p-1">
              <Check className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <p className="font-medium text-white">Unlimited Workflows</p>
              <p className="text-sm text-zinc-400">Use any workflow as many times as you want</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-full bg-green-500/20 p-1">
              <Check className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <p className="font-medium text-white">Custom Templates</p>
              <p className="text-sm text-zinc-400">Save and reuse your favorite prompts</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-full bg-green-500/20 p-1">
              <Check className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <p className="font-medium text-white">Priority Support</p>
              <p className="text-sm text-zinc-400">Get help when you need it</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-full bg-green-500/20 p-1">
              <Check className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <p className="font-medium text-white">Early Access</p>
              <p className="text-sm text-zinc-400">Try new features before everyone else</p>
            </div>
          </div>
        </div>

        {/* Pricing Options */}
        <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-zinc-800">
          {/* Monthly */}
          <div className="space-y-3 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
            <div>
              <p className="text-sm text-zinc-400">Monthly</p>
              <div className="flex items-baseline gap-1">
                <p className="text-3xl font-bold text-white">$19</p>
                <span className="text-lg text-zinc-400">/mo</span>
              </div>
            </div>
            <Button 
              className="w-full !bg-blue-600 hover:!bg-blue-700 !text-white"
              size="lg"
              asChild
            >
              <a href={MONTHLY_CHECKOUT} target="_blank" rel="noopener noreferrer">
                Start Monthly
              </a>
            </Button>
          </div>

          {/* Annual - Highlighted */}
          <div className="space-y-3 rounded-lg border-2 border-blue-500/50 bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-4 relative">
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 text-white border-0">
              Save 17%
            </Badge>
            <div>
              <p className="text-sm text-zinc-400">Annual</p>
              <div className="flex items-baseline gap-1">
                <p className="text-3xl font-bold text-white">$190</p>
                <span className="text-lg text-zinc-400">/yr</span>
              </div>
              <p className="text-xs text-zinc-500 mt-1">$15.83/mo billed annually</p>
            </div>
            <Button 
              className="w-full !bg-gradient-to-r !from-blue-600 !to-purple-600 hover:!from-blue-700 hover:!to-purple-700 !text-white"
              size="lg"
              asChild
            >
              <a href={ANNUAL_CHECKOUT} target="_blank" rel="noopener noreferrer">
                Start Annual
              </a>
            </Button>
          </div>
        </div>

        <p className="text-xs text-zinc-500 text-center">
          Cancel anytime. No questions asked. 30-day money-back guarantee.
        </p>
      </CardContent>
    </Card>
  );
}

