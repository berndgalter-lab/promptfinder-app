import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Target, Zap, Shield, Users, TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About PromptFinder - Built by Someone Who Got Tired of Unreliable AI',
  description: 'The story behind PromptFinder and why we built a better way to use ChatGPT consistently.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Built by someone who got tired of unreliable AI
            </span>
          </h1>
          <p className="text-xl text-gray-400">
            The story behind PromptFinder
          </p>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-20 md:py-32 px-4 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">The Frustration</h2>
          <div className="prose prose-lg prose-invert max-w-none">
            <p className="text-gray-300 leading-relaxed mb-6">
              Like many professionals, I was excited about ChatGPT. The potential was obvious.
            </p>
            <p className="text-gray-300 leading-relaxed mb-6">
              But the results? Wildly inconsistent.
            </p>
            <p className="text-gray-300 leading-relaxed mb-6">
              One day I'd get brilliant output. The next day, the same prompt would give me garbage. 
              I'd spend 30 minutes tweaking words, trying to figure out what worked.
            </p>
            <p className="text-gray-300 leading-relaxed">
              The worst part? I couldn't replicate my own success. When I finally got a great result, 
              I couldn't remember exactly what I'd written.
            </p>
          </div>
        </div>
      </section>

      {/* The Discovery */}
      <section className="py-20 md:py-32 px-4 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">What I Learned</h2>
          <div className="prose prose-lg prose-invert max-w-none mb-12">
            <p className="text-gray-300 leading-relaxed mb-6">
              After 6 months of testing hundreds of prompt variations, I discovered something simple:
            </p>
            <p className="text-xl font-semibold text-white leading-relaxed mb-6">
              Consistency comes from structure, not creativity.
            </p>
            <p className="text-gray-300 leading-relaxed mb-6">
              The best prompts aren't magical phrases. They're repeatable frameworks. Like SOPs for your business, 
              or recipes in a kitchen.
            </p>
            <p className="text-gray-300 leading-relaxed">
              ChatGPT isn't unreliable. Our process for using it is.
            </p>
          </div>

          <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20 p-8">
            <div className="flex items-start gap-4">
              <div className="text-4xl">💡</div>
              <p className="text-lg text-gray-200 leading-relaxed">
                Great AI results don't come from better prompts. They come from <span className="font-semibold text-white">better systems</span>.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* The Solution */}
      <section className="py-20 md:py-32 px-4 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Why PromptFinder Exists</h2>
          <div className="prose prose-lg prose-invert max-w-none mb-12">
            <p className="text-gray-300 leading-relaxed mb-6">
              I built PromptFinder to solve my own problem: I needed reliable AI results without 
              reinventing the wheel every time.
            </p>
            <p className="text-gray-300 leading-relaxed mb-6">
              Every workflow you see here has been:
            </p>
            <ul className="text-gray-300 leading-relaxed mb-6 space-y-2">
              <li>Tested with dozens of variations</li>
              <li>Refined based on actual results</li>
              <li>Validated for consistency</li>
              <li>Packaged into a simple format anyone can use</li>
            </ul>
            <p className="text-gray-300 leading-relaxed">
              No guessing. No trial and error. Just fill in the blanks and get results.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">50+</div>
              <div className="text-gray-400">Workflows Tested</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">100+</div>
              <div className="text-gray-400">Variations Refined</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-4xl font-bold text-pink-400 mb-2">6+</div>
              <div className="text-gray-400">Months of Testing</div>
            </Card>
          </div>
        </div>
      </section>

      {/* The Mission */}
      <section className="py-20 md:py-32 px-4 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">What We Believe</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <Shield className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Reliability over hype</h3>
                  <p className="text-gray-400 text-sm">We build tools that work consistently, not marketing promises.</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <Target className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Process over creativity</h3>
                  <p className="text-gray-400 text-sm">Repeatable systems beat one-off brilliance every time.</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <Zap className="w-6 h-6 text-pink-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Clarity over complexity</h3>
                  <p className="text-gray-400 text-sm">Simple tools that work beat complex tools that confuse.</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Results over features</h3>
                  <p className="text-gray-400 text-sm">We care about outcomes, not feature checklists.</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="prose prose-lg prose-invert max-w-none">
            <p className="text-gray-300 leading-relaxed mb-6">
              PromptFinder isn't about having the most workflows. It's about having workflows that actually work.
            </p>
            <p className="text-gray-300 leading-relaxed">
              We're not here to teach you prompt engineering. We're here to give you prompts that work the first time.
            </p>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-20 md:py-32 px-4 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Built For Professionals</h2>
          <div className="prose prose-lg prose-invert max-w-none">
            <p className="text-gray-300 leading-relaxed mb-6">
              PromptFinder is designed for people who:
            </p>
            <ul className="text-gray-300 leading-relaxed mb-8 space-y-3">
              <li>Need consistent results, not experiments</li>
              <li>Value their time more than learning curves</li>
              <li>Want to use AI as a tool, not a hobby</li>
              <li>Expect professional quality from their tools</li>
            </ul>
            <p className="text-lg text-white leading-relaxed">
              If you're tired of inconsistent ChatGPT results and want something that just works — this is for you.
            </p>
          </div>
        </div>
      </section>

      {/* What's Next */}
      <section className="py-20 md:py-32 px-4 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">The Future</h2>
          <div className="prose prose-lg prose-invert max-w-none mb-12">
            <p className="text-gray-300 leading-relaxed mb-6">
              We're just getting started. Our roadmap includes:
            </p>
            <ul className="text-gray-300 leading-relaxed mb-8 space-y-2">
              <li>More workflows across different use cases</li>
              <li>Team collaboration features</li>
              <li>Advanced customization options</li>
              <li>Integration with more AI tools</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mb-6">
              But we'll never sacrifice reliability for features.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Every new workflow goes through the same rigorous testing. If it doesn't work consistently, it doesn't ship.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 text-gray-400">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-sm">Team Features</span>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              <span className="text-sm">More Workflows</span>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <Zap className="w-5 h-5 text-pink-400" />
              <span className="text-sm">AI Integrations</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 md:py-32 px-4 border-t border-white/5">
        <div className="max-w-2xl mx-auto">
          <Card className="p-12 text-center bg-gradient-to-br from-blue-500/5 to-purple-500/5 border-white/10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Questions? Feedback? Just want to chat?
            </h2>
            <p className="text-gray-400 mb-8">
              I read every email. Seriously.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="mailto:contact@promptfinder.com">
                  Get in Touch
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/workflows">
                  Start For Free
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}

