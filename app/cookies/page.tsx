import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-3xl px-4 py-20">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Cookie Policy</h1>
          <p className="text-lg text-zinc-400">How we use cookies</p>
          <p className="text-sm text-zinc-500 mt-2">Last updated: November 2024</p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <p className="text-xl text-zinc-300 leading-relaxed">
              PromptFinder uses cookies to enhance your experience and provide essential functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">What Are Cookies?</h2>
            <p className="text-zinc-300">
              Cookies are small text files stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and activity.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Cookies We Use</h2>
            
            <div className="space-y-6">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Essential Cookies</h3>
                <p className="text-zinc-300 mb-3">
                  Required for the website to function properly.
                </p>
                <ul className="list-disc list-inside space-y-2 text-zinc-400 ml-4">
                  <li>Authentication cookies (Supabase)</li>
                  <li>Session management</li>
                  <li>Security tokens</li>
                </ul>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Functional Cookies</h3>
                <p className="text-zinc-300 mb-3">
                  Remember your preferences and settings.
                </p>
                <ul className="list-disc list-inside space-y-2 text-zinc-400 ml-4">
                  <li>Saved workflows and favorites</li>
                  <li>User preferences</li>
                  <li>Anonymous usage tracking (localStorage)</li>
                </ul>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Analytics Cookies</h3>
                <p className="text-zinc-300 mb-3">
                  Help us understand how you use our service.
                </p>
                <ul className="list-disc list-inside space-y-2 text-zinc-400 ml-4">
                  <li>Usage statistics</li>
                  <li>Performance monitoring</li>
                  <li>Error tracking</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Third-Party Cookies</h2>
            <div className="space-y-3 text-zinc-300">
              <p>We use third-party services that may set cookies:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Supabase:</strong> Authentication and database</li>
                <li><strong>LemonSqueezy:</strong> Payment processing</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Managing Cookies</h2>
            <div className="space-y-3 text-zinc-300">
              <p>You can control cookies through your browser settings:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Block all cookies</li>
                <li>Accept only certain cookies</li>
                <li>Delete cookies after each session</li>
              </ul>
              <p className="mt-4">
                <strong>Note:</strong> Blocking essential cookies may prevent you from using parts of our service.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Contact</h2>
            <p className="text-zinc-300">
              Questions about our cookie usage? Contact us at:{' '}
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

