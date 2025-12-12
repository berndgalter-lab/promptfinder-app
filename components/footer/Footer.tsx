import Link from 'next/link';
import { Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative bg-zinc-950 border-t border-zinc-800">
      <div className="mx-auto max-w-7xl px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">PromptFinder</h3>
            <p className="text-sm text-zinc-400">
              Reliable AI workflows for professionals
            </p>
          </div>

          {/* Column 2: Product */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Product
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/workflows" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Workflows
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/#features" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Features
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <a href="mailto:contact@promptfinder.com" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link href="/impressum" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Impressum
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/widerruf" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Widerruf
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-zinc-500 text-center sm:text-left">
              © 2025 PromptFinder. Built with ❤️ for professionals who need reliable AI.
            </p>
            <a 
              href="mailto:support@prompt-finder.com" 
              className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>support@prompt-finder.com</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

