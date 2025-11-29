'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Mail } from 'lucide-react';
import Link from 'next/link';

type BillingInterval = 'monthly' | 'annual';

const MONTHLY_CHECKOUT = 'https://promptfinder.lemonsqueezy.com/buy/c534f3ab-80c2-4a53-86ff-69c05e62a79a';
const ANNUAL_CHECKOUT = 'https://promptfinder.lemonsqueezy.com/buy/f7107575-9075-4e57-8440-7f511102db70';

export default function PricingPage() {
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('monthly');

  const proPrice = billingInterval === 'monthly' ? 19 : 190;
  const proMonthlyEquivalent = billingInterval === 'annual' ? 15.83 : 19;
  const savings = billingInterval === 'annual' ? 38 : 0;
  const savingsPercent = 17;

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-12 text-white">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold md:text-5xl mb-4">
            Simple pricing that scales with you
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Start free. Upgrade when you're ready. Cancel anytime.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center rounded-lg border border-zinc-800 bg-zinc-900 p-1">
            <button
              onClick={() => setBillingInterval('monthly')}
              className={`
                px-6 py-2 rounded-md text-sm font-medium transition-all duration-200
                ${billingInterval === 'monthly'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-zinc-400 hover:text-white'
                }
              `}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingInterval('annual')}
              className={`
                px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2
                ${billingInterval === 'annual'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-zinc-400 hover:text-white'
                }
              `}
            >
              Annual
              <Badge variant="secondary" className="!bg-green-600 !text-white text-xs">
                Save {savingsPercent}%
              </Badge>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
          {/* Free Tier */}
          <Card className="border-zinc-800 bg-zinc-900 relative">
            <CardHeader>
              <CardTitle className="text-2xl">Free</CardTitle>
              <CardDescription>Perfect for trying out PromptFinder</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Price */}
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold">$0</span>
                  <span className="text-zinc-400">/ month</span>
                </div>
                <p className="text-sm text-zinc-500 mt-2">
                  No credit card required
                </p>
              </div>

              {/* Features */}
              <ul className="space-y-3">
                {[
                  '5 workflows per month',
                  'Essential workflows',
                  'Save favorites',
                  'Basic support',
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-zinc-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/" className="w-full">
                <Button variant="outline" className="w-full !border-zinc-700 !text-white hover:!bg-zinc-800">
                  Get Started
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Pro Tier */}
          <Card className="border-blue-500/50 bg-zinc-900 relative shadow-xl shadow-blue-500/10 ring-1 ring-blue-500/20">
            {/* Popular Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <Badge className="!bg-blue-600 !text-white px-4 py-1">
                Most Popular
              </Badge>
            </div>

            <CardHeader>
              <CardTitle className="text-2xl">Pro</CardTitle>
              <CardDescription>For power users who want it all</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Price */}
              <div className="transition-all duration-300">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold transition-all duration-300">
                    ${proPrice}
                  </span>
                  <span className="text-zinc-400">
                    / {billingInterval === 'monthly' ? 'month' : 'year'}
                  </span>
                </div>
                
                {/* Annual pricing details */}
                {billingInterval === 'annual' && (
                  <div className="mt-2 space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
                    <p className="text-sm text-zinc-400">
                      That's just ${proMonthlyEquivalent.toFixed(2)}/month
                    </p>
                    <Badge variant="outline" className="!border-green-600 !text-green-400">
                      💰 Save ${savings}/year
                    </Badge>
                  </div>
                )}

                {/* Billing frequency note */}
                <p className="text-xs text-zinc-500 mt-2">
                  {billingInterval === 'monthly' ? 'Billed monthly' : 'Billed annually'}
                </p>
              </div>

              {/* Features */}
              <ul className="space-y-3">
                {[
                  'Unlimited workflows',
                  'All Essential workflows',
                  'Advanced workflows',
                  'Save favorites & history',
                  'Priority support',
                  'Early access to new features',
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                    <span className="text-zinc-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full !bg-blue-600 hover:!bg-blue-700 !text-white text-base"
                asChild
              >
                <a 
                  href={billingInterval === 'monthly' ? MONTHLY_CHECKOUT : ANNUAL_CHECKOUT}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Upgrade to Pro
                </a>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            Frequently asked questions
          </h2>
          
          <div className="space-y-6">
            <Card className="border-zinc-800 bg-zinc-900">
              <CardHeader>
                <CardTitle className="text-lg">Can I cancel anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-400">
                  Yes. Cancel with one click. No questions asked.
                </p>
              </CardContent>
            </Card>

            <Card className="border-zinc-800 bg-zinc-900">
              <CardHeader>
                <CardTitle className="text-lg">What happens after my free workflows run out?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-400">
                  You can upgrade to Pro for unlimited access, or wait until next month when your limit resets.
                </p>
              </CardContent>
            </Card>

            <Card className="border-zinc-800 bg-zinc-900">
              <CardHeader>
                <CardTitle className="text-lg">Do you offer refunds?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-400">
                  Absolutely. 30-day money-back guarantee, no questions asked.
                </p>
              </CardContent>
            </Card>

            <Card className="border-zinc-800 bg-zinc-900">
              <CardHeader>
                <CardTitle className="text-lg">Can I change plans later?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-400">
                  Yes. Upgrade or downgrade anytime from your dashboard.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <Card className="border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl">
                Ready to get started?
              </CardTitle>
              <CardDescription className="text-base">
                Start free and upgrade anytime to Pro.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-4 justify-center">
              <Link href="/">
                <Button variant="outline" size="lg" className="!border-zinc-700 !text-white hover:!bg-zinc-800">
                  Get Started Free
                </Button>
              </Link>
              <Button 
                size="lg" 
                className="!bg-blue-600 hover:!bg-blue-700 !text-white"
                asChild
              >
                <a 
                  href={billingInterval === 'monthly' ? MONTHLY_CHECKOUT : ANNUAL_CHECKOUT}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Upgrade to Pro
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="mt-8">
            <p className="text-zinc-400 flex items-center justify-center gap-2">
              <Mail className="w-4 h-4" />
              <span>Questions? Contact us at</span>
              <a 
                href="mailto:support@prompt-finder.com" 
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                support@prompt-finder.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

