import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, Sparkles, ChevronDown, Target, FileEdit, CheckCircle, Clock, Check, Zap, RotateCcw, BarChart3, Lock } from "lucide-react";
import { ScrollButton } from "@/components/landing/ScrollButton";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-zinc-950 text-white overflow-hidden">
      {/* Background gradient mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-zinc-950 to-purple-950/20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-zinc-950 to-transparent" />
      
      {/* Animated background elements - reduced blur on mobile for performance */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-xl md:blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-xl md:blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Hero Content - CSS animation instead of JS */}
      <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center animate-fade-in-up">
          {/* Left side - Text Content */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Main Headline with gradient */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500 bg-clip-text text-transparent">
                Get reliable results from ChatGPT.
              </span>
              <br />
              <span className="text-white">
                Every single time.
              </span>
          </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto lg:mx-0">
              Pre-built AI workflows that work like SOPs — tested, proven, ready to use.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/workflows">
                <Button 
                  size="lg" 
                  className="group !bg-green-600 hover:!bg-green-700 !text-white text-base px-8 py-6 shadow-lg shadow-green-600/20 hover:shadow-xl hover:shadow-green-600/30 transition-all duration-300"
                >
                  Start For Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <ScrollButton />
            </div>

            {/* Social Proof */}
            <div className="flex flex-col items-center lg:items-start pt-4">
              <p className="text-sm text-zinc-500">
                No credit card required · Start with 5 free workflows
              </p>
            </div>
          </div>

          {/* Right side - Visual */}
          <div className="relative">
            {/* Hero Mock-Up - Clickable */}
            <Link href="/workflows/linkedin-post-generator" className="block group">
              <div className="relative">
                <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm shadow-2xl shadow-blue-500/10 overflow-hidden 
                                transition-all duration-300 group-hover:border-blue-500/50 group-hover:shadow-blue-500/20 group-hover:-translate-y-1">
                  
                  {/* Window Header */}
                  <div className="border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                      </div>
                      <span className="text-sm text-zinc-400 font-medium">LinkedIn Post Generator</span>
                    </div>
                    <div className="bg-green-600/90 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                      ✓ Tested
                    </div>
                  </div>

                  {/* Workflow Content - 3 Steps Only */}
                  <div className="p-5 space-y-4">
                    
                    {/* Step 1 */}
                      <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">1</div>
                      <div className="flex-1 px-3 py-2 bg-zinc-800/80 rounded border border-zinc-700 text-sm text-zinc-300">
                        AI productivity tips
                      </div>
                    </div>

                    {/* Step 2 */}
                      <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">2</div>
                      <div className="flex-1 px-3 py-2 bg-zinc-800/80 rounded border border-zinc-700 text-sm text-zinc-300">
                        Marketing managers
                      </div>
                    </div>
                    
                    {/* Step 3 */}
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">3</div>
                      <div className="flex-1 px-3 py-2 bg-zinc-800/80 rounded border border-zinc-700 text-sm text-zinc-300">
                        Professional tone
                      </div>
                    </div>

                    {/* CTA Button */}
                    <div className="pt-2">
                      <div className="h-11 bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 group-hover:shadow-blue-600/50 transition-shadow">
                        <Sparkles className="h-4 w-4 text-white" />
                        <span className="text-white font-semibold text-sm">Open in ChatGPT</span>
                      </div>
                    </div>
                    
                    {/* Hover Hint */}
                    <div className="text-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs text-blue-400">Click to try this workflow →</span>
                  </div>

                  </div>
                </div>

                {/* Decorative blurs - reduced on mobile */}
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-500/20 rounded-full blur-xl md:blur-2xl"></div>
                <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-purple-500/20 rounded-full blur-xl md:blur-2xl"></div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Section 2: Problem/Agitate */}
      <section className="relative bg-zinc-900/50">
        <div className="mx-auto max-w-4xl px-4 py-20 md:py-32">
          <div className="space-y-12 text-center">
            {/* Headline with gradient */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500 bg-clip-text text-transparent">
                You're using the most powerful AI ever created.
              </span>
              <br />
              <span className="text-white">
                So why does it feel so... unreliable?
              </span>
            </h2>

            {/* Body paragraphs */}
            <div className="space-y-8 text-lg md:text-xl leading-relaxed">
              {/* Paragraph 1 */}
              <p className="text-zinc-400">
                One prompt gets you amazing results.
                <br />
                The next one? Completely different output.
              </p>

              {/* Paragraph 2 - Standout */}
              <p className="text-2xl md:text-3xl font-semibold text-white">
                You're not the problem.
                <br />
                The process is.
              </p>

              {/* Paragraph 3 */}
              <p className="text-zinc-400 max-w-2xl mx-auto">
                ChatGPT is powerful — but only when you know
                <br className="hidden md:block" />
                {" "}exactly what to say, exactly how to say it,
                <br className="hidden md:block" />
                {" "}every single time.
              </p>
            </div>

            {/* CTA Line */}
            <div className="pt-8">
              <p className="text-base text-zinc-500 flex items-center justify-center gap-2">
                That's where PromptFinder comes in.
                <ChevronDown className="h-5 w-5 text-blue-400 animate-bounce" />
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: How It Works */}
      <section id="how-it-works" className="relative bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 py-20 md:py-32">
          {/* Header */}
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-lg text-zinc-400">
              Get professional AI results in 3 simple steps
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid gap-8 md:grid-cols-3 md:gap-12">
            {/* Step 1 */}
            <Card className="group relative border-zinc-800 bg-zinc-900/50 p-8 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-0 space-y-6">
                {/* Number Badge */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    1
                  </div>
                  <Target className="h-12 w-12 text-blue-400" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white">
                  Choose Your Workflow
                </h3>

                {/* Description */}
                <p className="text-base text-zinc-400 leading-relaxed">
                  Browse 166 tested workflows for every task. Email writing, content creation, research — we've got you covered.
                </p>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="group relative border-zinc-800 bg-zinc-900/50 p-8 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-0 space-y-6">
                {/* Number Badge */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    2
                  </div>
                  <FileEdit className="h-12 w-12 text-purple-400" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white">
                  Fill Simple Fields
                </h3>

                {/* Description */}
                <p className="text-base text-zinc-400 leading-relaxed">
                  Answer 3-5 quick questions. No prompting skills needed. Just like filling out a form.
                </p>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="group relative border-zinc-800 bg-zinc-900/50 p-8 hover:border-green-500/50 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-0 space-y-6">
                {/* Number Badge */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    3
                  </div>
                  <Sparkles className="h-12 w-12 text-green-400" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white">
                  Get Reliable Results
                </h3>

                {/* Description */}
                <p className="text-base text-zinc-400 leading-relaxed">
                  Open in ChatGPT with one click. Your perfect prompt is ready. Works the same way, every time.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* CTA Button */}
          <div className="mt-16 text-center">
            <Link href="/workflows">
              <Button 
                size="lg" 
                className="!bg-blue-600 hover:!bg-blue-700 !text-white text-base px-8 py-6 shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 transition-all duration-300"
              >
                Browse Workflows
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Section 4: Built for Reliability */}
      <section className="relative bg-zinc-900/30">
        <div className="mx-auto max-w-7xl px-4 py-20 md:py-32">
          {/* Header */}
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built for Reliability, Not Hype
            </h2>
            <p className="text-lg text-zinc-400">
              Every workflow is tested, refined, and proven to work
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-3 md:gap-8 mb-16">
            {/* Stat 1 */}
            <Card className="group relative border-zinc-800 bg-zinc-900/50 p-8 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-0 flex flex-col items-center text-center space-y-4">
                <CheckCircle className="h-12 w-12 text-green-400" />
                <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  166
                </div>
                <p className="text-lg text-zinc-400">
                  Ready-to-Use Workflows
                </p>
              </CardContent>
            </Card>

            {/* Stat 2 */}
            <Card className="group relative border-zinc-800 bg-zinc-900/50 p-8 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-0 flex flex-col items-center text-center space-y-4">
                <Sparkles className="h-12 w-12 text-purple-400" />
                <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  1,000+
                </div>
                <p className="text-lg text-zinc-400">
                  Hours of Testing
                </p>
              </CardContent>
            </Card>

            {/* Stat 3 */}
            <Card className="group relative border-zinc-800 bg-zinc-900/50 p-8 hover:border-green-500/50 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-0 flex flex-col items-center text-center space-y-4">
                <Clock className="h-12 w-12 text-blue-400" />
                <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                  8
                </div>
                <p className="text-lg text-zinc-400">
                  Job Role Categories
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Founder Quote */}
          <div className="max-w-3xl mx-auto">
            <Card className="relative border-zinc-800 bg-zinc-900/50 p-8 md:p-12">
              <CardContent className="p-0">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white">Why I Built This</h3>
                  <p className="text-lg text-zinc-300 leading-relaxed">
                    I was tired of getting amazing results from ChatGPT one day and completely 
                    different output the next.
                  </p>
                  <p className="text-lg text-zinc-300 leading-relaxed">
                    After testing hundreds of prompt variations, I discovered what actually 
                    works — and built PromptFinder so you don't have to figure it out yourself.
                  </p>
                  <p className="text-base text-zinc-500">— Bernd, Founder</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section 5: Pricing Teaser */}
      <section className="relative bg-zinc-950">
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-32">
          {/* Header */}
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-zinc-400">
              Start free. Upgrade when you're ready.
            </p>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto mb-8">
            {/* Free Tier */}
            <Card className="relative border-zinc-800 bg-zinc-900/50 p-8 hover:border-zinc-700 transition-all duration-300">
              <CardContent className="p-0 space-y-6">
                {/* Title */}
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-white">$0</span>
                    <span className="text-zinc-500">per month</span>
                  </div>
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

                {/* CTA */}
                <Link href="/workflows" className="block">
                  <Button 
                    variant="outline" 
                    className="w-full !border-zinc-700 !text-white hover:!bg-zinc-800"
                  >
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro Tier */}
            <Card className="relative border-blue-500/50 bg-zinc-900/50 p-8 shadow-xl shadow-blue-500/10 ring-1 ring-blue-500/20 hover:shadow-blue-500/20 transition-all duration-300">
              {/* Popular Badge */}
              <div className="absolute -top-3 -right-3">
                <Badge className="!bg-blue-600 !text-white px-3 py-1">
                  Most Popular
                </Badge>
              </div>

              <CardContent className="p-0 space-y-6">
                {/* Title */}
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-white">$19</span>
                    <span className="text-zinc-500">per month</span>
                  </div>
                  <p className="text-sm text-zinc-500 mt-1">
                    or $190/year (save 17%)
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-3">
                  {[
                    'Unlimited workflows',
                    'All Essential workflows',
                    'Advanced workflows',
                    'Priority support',
                    'Early access to new features',
                  ].map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-zinc-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link href="/pricing" className="block">
                  <Button 
                    className="w-full !bg-green-600 hover:!bg-green-700 !text-white text-base shadow-lg shadow-green-600/20"
                  >
                    Start Free Trial
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Link to full pricing */}
          <div className="text-center">
            <Link 
              href="/pricing" 
              className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors inline-flex items-center gap-1"
            >
              View full pricing details
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Section 6: Features */}
      <section className="relative bg-zinc-900/30">
        <div className="mx-auto max-w-7xl px-4 py-20 md:py-32">
          {/* Header */}
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to master AI prompts
            </h2>
            <p className="text-lg text-zinc-400">
              Designed for professionals who need reliable results
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 md:gap-8">
            {/* Feature 1 */}
            <Card className="group relative border-zinc-800 bg-zinc-900/50 p-6 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-0 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-600/50 flex items-center justify-center">
                  <Target className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  166 Ready-to-Use Workflows
                </h3>
                <p className="text-base text-zinc-400 leading-relaxed">
                  Skip the trial and error. Every workflow is tested and proven to work.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="group relative border-zinc-800 bg-zinc-900/50 p-6 hover:border-yellow-500/50 hover:shadow-xl hover:shadow-yellow-500/10 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-0 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border border-yellow-600/50 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-yellow-400" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  1-Click ChatGPT Launch
                </h3>
                <p className="text-base text-zinc-400 leading-relaxed">
                  Open in ChatGPT instantly with your perfect prompt. No copy-pasting needed.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="group relative border-zinc-800 bg-zinc-900/50 p-6 hover:border-green-500/50 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-0 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-600/50 flex items-center justify-center">
                  <RotateCcw className="h-6 w-6 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Save & Reuse
                </h3>
                <p className="text-base text-zinc-400 leading-relaxed">
                  Build your personal library of workflows. Use them again and again.
                </p>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="group relative border-zinc-800 bg-zinc-900/50 p-6 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-0 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-600/50 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Track Your Progress
                </h3>
                <p className="text-base text-zinc-400 leading-relaxed">
                  See your usage, favorites, and achievements. Stay motivated and productive.
                </p>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card className="group relative border-zinc-800 bg-zinc-900/50 p-6 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-0 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border border-cyan-600/50 flex items-center justify-center">
                  <Lock className="h-6 w-6 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Privacy First
                </h3>
                <p className="text-base text-zinc-400 leading-relaxed">
                  Your data stays yours. We never share or sell your information.
                </p>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card className="group relative border-zinc-800 bg-zinc-900/50 p-6 hover:border-pink-500/50 hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-0 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-600/20 to-rose-600/20 border border-pink-600/50 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-pink-400" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Always Updated
                </h3>
                <p className="text-base text-zinc-400 leading-relaxed">
                  New workflows added regularly. Stay ahead with the latest AI techniques.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section 7: Final CTA */}
      <section className="relative overflow-hidden">
        {/* Gradient mesh background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/40 via-purple-950/40 to-zinc-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
        
        {/* Animated background elements - reduced blur on mobile */}
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-xl md:blur-3xl animate-pulse" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-xl md:blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative mx-auto max-w-4xl px-4 py-24 md:py-32">
          <div className="text-center space-y-8">
            {/* Headline */}
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Ready to get reliable AI results?
            </h2>

            {/* Subheadline */}
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Join professionals who've stopped wasting time on inconsistent prompts.
            </p>

            {/* Primary CTA Button */}
            <div className="pt-4">
              <Link href="/workflows">
                <Button 
                  size="lg" 
                  className="group !bg-green-600 hover:!bg-green-700 !text-white text-lg px-8 py-6 shadow-2xl shadow-green-600/30 hover:shadow-green-600/50 hover:scale-105 transition-all duration-300"
                >
                  Start For Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Fine print */}
            <p className="text-sm text-zinc-500">
              No credit card required · 5 free workflows per month
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
