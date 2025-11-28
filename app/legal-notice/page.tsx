import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LegalNoticePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-3xl px-4 py-20">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Legal Notice</h1>
          <p className="text-lg text-zinc-400">Impressum (German Legal Requirement)</p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Company Information</h2>
            <div className="space-y-2 text-zinc-300">
              <p><strong>Company Name:</strong> [Company Name]</p>
              <p><strong>Managing Director:</strong> [Name]</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Business Address</h2>
            <div className="space-y-2 text-zinc-300">
              <p>[Street Address]</p>
              <p>[Postal Code] [City]</p>
              <p>[Country]</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Contact</h2>
            <div className="space-y-2 text-zinc-300">
              <p><strong>Email:</strong> <a href="mailto:contact@promptfinder.com" className="text-blue-400 hover:text-blue-300">contact@promptfinder.com</a></p>
              <p><strong>Website:</strong> promptfinder.com</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Register Information</h2>
            <div className="space-y-2 text-zinc-300">
              <p><strong>Commercial Register:</strong> [Register Court]</p>
              <p><strong>Registration Number:</strong> [Number]</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">VAT ID</h2>
            <div className="space-y-2 text-zinc-300">
              <p><strong>VAT Identification Number:</strong> [VAT ID]</p>
              <p>According to §27a VAT Act</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Responsible for Content</h2>
            <div className="space-y-2 text-zinc-300">
              <p>According to § 55 Abs. 2 RStV:</p>
              <p>[Name]</p>
              <p>[Address]</p>
            </div>
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

