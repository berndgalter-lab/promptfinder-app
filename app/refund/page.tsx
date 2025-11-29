import Link from 'next/link';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-3xl px-4 py-20">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Refund Policy</h1>
          <p className="text-lg text-zinc-400">30-Day Money-Back Guarantee</p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Guarantee Card */}
          <Card className="border-green-500/50 bg-zinc-900/50 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">
                Not Satisfied? Get a Full Refund Within 30 Days
              </h2>
              <p className="text-lg text-zinc-300">
                We stand behind the quality of our workflows. If you're not completely satisfied, 
                we'll refund your purchase—no questions asked.
              </p>
            </CardContent>
          </Card>

          {/* How It Works */}
          <section className="prose prose-invert max-w-none space-y-6">
            <h2 className="text-2xl font-semibold text-white">How It Works</h2>
            
            <div className="space-y-4 text-zinc-300">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-600/50 flex items-center justify-center text-blue-400 font-semibold shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Request a Refund</h3>
                  <p>Email us at <a href="mailto:support@prompt-finder.com" className="text-blue-400 hover:text-blue-300">support@prompt-finder.com</a> within 30 days of your purchase.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-600/50 flex items-center justify-center text-blue-400 font-semibold shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">We Process It</h3>
                  <p>No lengthy forms or complicated processes. We'll process your refund request immediately.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-600/50 flex items-center justify-center text-blue-400 font-semibold shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Get Your Money Back</h3>
                  <p>Refunds are processed through LemonSqueezy and typically appear in your account within 5-10 business days.</p>
                </div>
              </div>
            </div>
          </section>

          {/* What's Covered */}
          <section className="prose prose-invert max-w-none space-y-6">
            <h2 className="text-2xl font-semibold text-white">What's Covered</h2>
            <ul className="space-y-3 text-zinc-300">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-1" />
                <span>Pro monthly subscriptions (refund for current month)</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-1" />
                <span>Pro annual subscriptions (full refund if requested within 30 days)</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-1" />
                <span>Any charges made in error</span>
              </li>
            </ul>
          </section>

          {/* Important Notes */}
          <section className="prose prose-invert max-w-none space-y-6">
            <h2 className="text-2xl font-semibold text-white">Important Notes</h2>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
              <ul className="space-y-3 text-zinc-300">
                <li className="flex items-start gap-3">
                  <span className="text-zinc-500 mt-1">•</span>
                  <span>Refund requests must be made within 30 days of purchase</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-zinc-500 mt-1">•</span>
                  <span>Free tier is not eligible for refunds (as it's free)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-zinc-500 mt-1">•</span>
                  <span>After a refund, your Pro access will be revoked</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-zinc-500 mt-1">•</span>
                  <span>You can still use the free tier after a refund</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Contact */}
          <section className="text-center bg-zinc-900/50 border border-zinc-800 rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Need Help?</h2>
            <p className="text-zinc-300 mb-6">
              Have questions about refunds or want to request one?
            </p>
            <a href="mailto:support@prompt-finder.com">
              <Button className="!bg-blue-600 hover:!bg-blue-700 !text-white">
                Contact Support
              </Button>
            </a>
          </section>
        </div>

        {/* Back to Home */}
        <div className="mt-16 pt-8 border-t border-zinc-800">
          <Link href="/">
            <Button variant="ghost" className="!text-white hover:!bg-zinc-800">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

