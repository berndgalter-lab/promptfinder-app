import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-3xl px-4 py-20">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-lg text-zinc-400">Terms and conditions of use</p>
          <p className="text-sm text-zinc-500 mt-2">Last updated: November 2024</p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <p className="text-xl text-zinc-300 leading-relaxed">
              By using PromptFinder, you agree to these terms and conditions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
            <p className="text-zinc-300">
              By accessing and using PromptFinder, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Use License</h2>
            <div className="space-y-3 text-zinc-300">
              <p>Permission is granted to temporarily use PromptFinder for personal or commercial use. This includes:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access to workflow templates</li>
                <li>Generation of AI prompts</li>
                <li>Personal workflow library management</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. Account Responsibilities</h2>
            <div className="space-y-3 text-zinc-300">
              <p>You are responsible for:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Maintaining the confidentiality of your account</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us of any unauthorized use</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Subscription and Billing</h2>
            <div className="space-y-3 text-zinc-300">
              <p><strong>Free Tier:</strong> 5 workflows per month, resets monthly</p>
              <p><strong>Pro Tier:</strong> Unlimited workflows, billed monthly or annually</p>
              <p>Billing is handled securely through LemonSqueezy.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Refund Policy</h2>
            <p className="text-zinc-300">
              We offer a 30-day money-back guarantee. See our{' '}
              <Link href="/refund" className="text-blue-400 hover:text-blue-300">
                Refund Policy
              </Link>{' '}
              for details.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Prohibited Uses</h2>
            <div className="space-y-3 text-zinc-300">
              <p>You may not use PromptFinder:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>For any illegal purpose</li>
                <li>To violate any regulations or laws</li>
                <li>To harm or attempt to harm minors</li>
                <li>To transmit harmful code or malware</li>
                <li>To impersonate another person or entity</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. Limitation of Liability</h2>
            <p className="text-zinc-300">
              PromptFinder is provided "as is" without warranties. We are not liable for any damages arising from the use of our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">8. Changes to Terms</h2>
            <p className="text-zinc-300">
              We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of the modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">9. Contact</h2>
            <p className="text-zinc-300">
              Questions about the Terms of Service? Contact us at:{' '}
              <a href="mailto:contact@promptfinder.com" className="text-blue-400 hover:text-blue-300">
                contact@promptfinder.com
              </a>
            </p>
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

