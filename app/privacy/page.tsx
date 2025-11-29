import Link from 'next/link';
import { ArrowLeft, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-3xl px-4 py-20">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-lg text-zinc-400">How we handle your data</p>
          <p className="text-sm text-zinc-500 mt-2">Last updated: November 2024</p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <p className="text-xl text-zinc-300 leading-relaxed">
              We respect your privacy and comply with GDPR.
            </p>
          </section>

          <section className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
            <p className="text-zinc-400 italic">
              [Detailed privacy policy to be added]
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Key Points</h2>
            <ul className="space-y-3 text-zinc-300">
              <li className="flex items-start gap-3">
                <span className="text-blue-400 mt-1">•</span>
                <span>We collect email and usage data to provide and improve our service</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 mt-1">•</span>
                <span>We use Supabase for secure data storage and authentication</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 mt-1">•</span>
                <span>We use LemonSqueezy for secure payment processing</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 mt-1">•</span>
                <span>You can request data deletion anytime by contacting us</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 mt-1">•</span>
                <span>We never share or sell your personal information to third parties</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Data We Collect</h2>
            <div className="space-y-4 text-zinc-300">
              <p><strong>Account Information:</strong> Email address, name (if provided)</p>
              <p><strong>Usage Data:</strong> Workflows used, favorites, achievements</p>
              <p><strong>Technical Data:</strong> IP address, browser type, device information</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Your Rights</h2>
            <div className="space-y-3 text-zinc-300">
              <p>Under GDPR, you have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access your personal data</li>
                <li>Rectify inaccurate data</li>
                <li>Request data deletion</li>
                <li>Object to data processing</li>
                <li>Data portability</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Contact</h2>
            <p className="text-zinc-300 flex items-start gap-2">
              <Mail className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
              <span>
                For any privacy-related questions or requests, please contact us at:{' '}
                <a href="mailto:support@prompt-finder.com" className="text-blue-400 hover:text-blue-300 font-medium">
                  support@prompt-finder.com
                </a>
              </span>
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

