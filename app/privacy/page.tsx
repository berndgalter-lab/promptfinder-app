import Link from 'next/link';
import { ArrowLeft, Mail, Phone, Building2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-3xl px-4 py-20">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-lg text-zinc-400">How we handle your data</p>
          <p className="text-sm text-zinc-500 mt-2">Last updated: November 2025</p>
          <Link href="/datenschutz" className="text-sm text-blue-400 hover:text-blue-300 mt-2 inline-block">
            🇩🇪 Deutsche Version
          </Link>
        </div>

        <div className="prose prose-invert max-w-none space-y-10">
          
          {/* 1. Controller */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-blue-400" />
              1. Data Controller
            </h2>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 space-y-2 text-zinc-300">
              <p className="font-semibold text-white">BG Online Media UG (haftungsbeschränkt)</p>
              <p>Grünwiesenstraße 33</p>
              <p>74321 Bietigheim-Bissingen</p>
              <p>Germany</p>
              <div className="pt-3 border-t border-zinc-800 mt-3 space-y-1">
                <p>Represented by: Bernd Galter</p>
                <p>Commercial Register: HRB 774462, Stuttgart District Court</p>
                <p>VAT ID: DE331972080</p>
              </div>
              <div className="pt-3 border-t border-zinc-800 mt-3 space-y-1">
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <a href="mailto:support@prompt-finder.com" className="text-blue-400 hover:text-blue-300">
                    support@prompt-finder.com
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-400" />
                  +49 176 22372958
                </p>
              </div>
            </div>
          </section>

          {/* 2. Overview */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              2. Overview of Data Processing
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              PromptFinder is a platform for structured AI workflows. This overview summarizes 
              the types of data processed and the purposes of processing.
            </p>
            <div className="mt-4 space-y-3 text-zinc-300">
              <p><strong className="text-white">Types of data processed:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Account data (e.g., name, email address)</li>
                <li>Usage data (e.g., pages visited, workflows used)</li>
                <li>Meta/communication data (e.g., IP addresses, access times)</li>
                <li>Payment data (processed exclusively by our payment provider)</li>
              </ul>
            </div>
            <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-green-400 text-sm flex items-start gap-2">
                <Shield className="w-5 h-5 shrink-0 mt-0.5" />
                <span>
                  <strong>Important:</strong> Content you enter in workflow input fields 
                  (e.g., meeting notes, email drafts) is <strong>not</strong> stored on our 
                  servers. This data remains exclusively in your browser and is transmitted 
                  directly to the AI service you choose (e.g., ChatGPT).
                </span>
              </p>
            </div>
          </section>

          {/* 3. Legal Basis */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              3. Legal Basis
            </h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              We process personal data based on the following GDPR provisions:
            </p>
            <ul className="space-y-3 text-zinc-300">
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold shrink-0">Art. 6(1)(a)</span>
                <span><strong>Consent:</strong> You have given consent for processing.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold shrink-0">Art. 6(1)(b)</span>
                <span><strong>Contract:</strong> Processing is necessary for contract performance (e.g., providing the service, payment processing).</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold shrink-0">Art. 6(1)(f)</span>
                <span><strong>Legitimate Interests:</strong> Processing is necessary for our legitimate interests (e.g., security, fraud prevention, service improvement).</span>
              </li>
            </ul>
          </section>

          {/* 4. Data We Collect */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              4. Data We Collect
            </h2>
            
            <h3 className="text-xl font-medium text-white mt-6 mb-3">4.1 Account Data</h3>
            <p className="text-zinc-300 leading-relaxed">
              When you register, we collect:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4 mt-2 text-zinc-300">
              <li>Email address (required)</li>
              <li>Name (if provided)</li>
              <li>Profile picture (when signing in via Google)</li>
            </ul>
            <p className="text-zinc-400 text-sm mt-2">
              Legal basis: Art. 6(1)(b) GDPR (Contract performance)
            </p>

            <h3 className="text-xl font-medium text-white mt-6 mb-3">4.2 Usage Data</h3>
            <p className="text-zinc-300 leading-relaxed">
              To improve our service, we store:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4 mt-2 text-zinc-300">
              <li>Which workflows you use</li>
              <li>Which options you select in dropdown fields</li>
              <li>Favorited workflows</li>
              <li>Time of usage</li>
            </ul>
            <div className="mt-3 p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg">
              <p className="text-zinc-400 text-sm">
                <strong>We do NOT store:</strong> Free-text inputs, content from input fields, 
                meeting notes, email drafts, or any other personal content you enter in workflows.
              </p>
            </div>
            <p className="text-zinc-400 text-sm mt-2">
              Legal basis: Art. 6(1)(f) GDPR (Legitimate interests)
            </p>

            <h3 className="text-xl font-medium text-white mt-6 mb-3">4.3 Technical Data</h3>
            <p className="text-zinc-300 leading-relaxed">
              When you access our website, we automatically collect:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4 mt-2 text-zinc-300">
              <li>IP address (stored anonymously)</li>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Date and time of access</li>
              <li>Referrer URL</li>
            </ul>
            <p className="text-zinc-400 text-sm mt-2">
              Legal basis: Art. 6(1)(f) GDPR (Legitimate interests – security, stability)
            </p>

            <h3 className="text-xl font-medium text-white mt-6 mb-3">4.4 Anonymous Usage Statistics</h3>
            <p className="text-zinc-300 leading-relaxed">
              For visitors who are not logged in, we collect fully anonymous usage statistics:
            </p>
            <p className="text-zinc-300 leading-relaxed mt-2">
              <strong className="text-white">What we store:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4 mt-2 text-zinc-300">
              <li>Which workflow was used (workflow ID only)</li>
              <li>Date of usage</li>
              <li>Aggregated counter (+1 per usage)</li>
            </ul>
            <div className="mt-3 p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg">
              <p className="text-zinc-400 text-sm">
                <strong>We do NOT store:</strong> IP addresses, device information (browser, operating system), 
                cookies or session IDs, personal data, or individual usage histories. 
                It is technically impossible to associate this data with any individual.
              </p>
            </div>
            <p className="text-zinc-300 leading-relaxed mt-3">
              <strong className="text-white">Purpose:</strong> Improving our service, identifying popular workflows, and internal statistics.
            </p>
            <p className="text-zinc-400 text-sm mt-2">
              Legal basis: Art. 6(1)(f) GDPR (Legitimate interests). As no personal data is processed, 
              no consent is required.
            </p>
          </section>

          {/* 5. Cookies and LocalStorage */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              5. Cookies and Local Storage
            </h2>
            
            <h3 className="text-xl font-medium text-white mt-6 mb-3">5.1 Essential Cookies</h3>
            <p className="text-zinc-300 leading-relaxed">
              We use technically necessary cookies for:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4 mt-2 text-zinc-300">
              <li>Authentication and session management (Supabase Auth)</li>
              <li>Security features (CSRF protection)</li>
            </ul>
            <p className="text-zinc-400 text-sm mt-2">
              These cookies are essential for website operation and cannot be disabled. 
              Legal basis: Art. 6(1)(f) GDPR.
            </p>

            <h3 className="text-xl font-medium text-white mt-6 mb-3">5.2 Local Storage</h3>
            <p className="text-zinc-300 leading-relaxed">
              We use your browser&apos;s local storage to:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4 mt-2 text-zinc-300">
              <li>Save your progress in multi-step workflows</li>
              <li>Remember the current step if you leave the page</li>
            </ul>
            <p className="text-zinc-400 text-sm mt-2">
              This data remains exclusively in your browser and is not transmitted to our servers. 
              You can clear local storage at any time in your browser settings.
            </p>

            <h3 className="text-xl font-medium text-white mt-6 mb-3">5.3 No Tracking Cookies</h3>
            <p className="text-zinc-300 leading-relaxed">
              We do <strong>not</strong> use marketing or tracking cookies. We do not use Google Analytics. 
              We use Vercel Analytics, which is cookie-free and privacy-friendly (see Section 6.5).
            </p>
          </section>

          {/* 6. Service Providers */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              6. Service Providers
            </h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              We use the following service providers with whom we have data processing agreements:
            </p>

            <div className="space-y-4">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
                <h4 className="font-semibold text-white">Supabase Inc.</h4>
                <p className="text-zinc-400 text-sm mt-1">Authentication and Database</p>
                <p className="text-zinc-300 text-sm mt-2">
                  Server location: <strong>EU (Ireland)</strong><br />
                  Purpose: User accounts, data storage<br />
                  Privacy: <a href="https://supabase.com/privacy" className="text-blue-400 hover:text-blue-300" target="_blank" rel="noopener noreferrer">supabase.com/privacy</a>
                </p>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
                <h4 className="font-semibold text-white">Vercel Inc.</h4>
                <p className="text-zinc-400 text-sm mt-1">Web Hosting</p>
                <p className="text-zinc-300 text-sm mt-2">
                  Server location: <strong>EU</strong><br />
                  Purpose: Website hosting<br />
                  Privacy: <a href="https://vercel.com/legal/privacy-policy" className="text-blue-400 hover:text-blue-300" target="_blank" rel="noopener noreferrer">vercel.com/legal/privacy-policy</a>
                </p>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
                <h4 className="font-semibold text-white">LemonSqueezy LLC</h4>
                <p className="text-zinc-400 text-sm mt-1">Payment Processing</p>
                <p className="text-zinc-300 text-sm mt-2">
                  Purpose: Processing Pro subscriptions<br />
                  Payment data is processed exclusively by LemonSqueezy.<br />
                  We do not store credit card or bank details.<br />
                  Privacy: <a href="https://www.lemonsqueezy.com/privacy" className="text-blue-400 hover:text-blue-300" target="_blank" rel="noopener noreferrer">lemonsqueezy.com/privacy</a>
                </p>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
                <h4 className="font-semibold text-white">Hetzner Online GmbH</h4>
                <p className="text-zinc-400 text-sm mt-1">Email Hosting</p>
                <p className="text-zinc-300 text-sm mt-2">
                  Server location: <strong>Germany</strong><br />
                  Purpose: Processing email inquiries (support@prompt-finder.com)<br />
                  Privacy: <a href="https://www.hetzner.com/legal/privacy-policy" className="text-blue-400 hover:text-blue-300" target="_blank" rel="noopener noreferrer">hetzner.com/legal/privacy-policy</a>
                </p>
              </div>
            </div>

            <h3 className="text-xl font-medium text-white mt-6 mb-3">6.4 Fonts</h3>
            <p className="text-zinc-300 leading-relaxed">
              We use the fonts &quot;Geist&quot; and &quot;Geist Mono&quot;. These are 
              <strong> self-hosted</strong> and served from our own servers. There is no connection 
              to Google servers, and your IP address is not transmitted to Google.
            </p>

            <h3 className="text-xl font-medium text-white mt-6 mb-3">6.5 Analytics (Vercel Analytics)</h3>
            <p className="text-zinc-300 leading-relaxed">
              We use <strong>Vercel Analytics</strong>, provided by Vercel Inc., to monitor the performance, 
              stability and basic usage of our website. Vercel Analytics works without cookies and does not 
              create user profiles.
            </p>
            <p className="text-zinc-300 leading-relaxed mt-2">
              As part of this service, technical information such as the requested URL, referrer URL, 
              timestamp, user agent, approximate region and performance metrics may be processed in 
              aggregated form. This data is used exclusively for statistical evaluations and for improving 
              the stability and security of our service.
            </p>
            <p className="text-zinc-400 text-sm mt-2">
              Legal basis: Art. 6(1)(f) GDPR (legitimate interest in secure and efficient website operation).
            </p>
            <p className="text-zinc-300 text-sm mt-2">
              More information:{' '}
              <a 
                href="https://vercel.com/legal/privacy-policy"
                className="text-blue-400 hover:text-blue-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                vercel.com/legal/privacy-policy
              </a>
            </p>
          </section>

          {/* 7. Data Sharing */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              7. Data Sharing
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              We do <strong>not</strong> share your personal data with third parties unless:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-3 text-zinc-300">
              <li>You have given explicit consent (Art. 6(1)(a) GDPR)</li>
              <li>It is necessary for contract performance (Art. 6(1)(b) GDPR), e.g., payment processing</li>
              <li>There is a legal obligation (Art. 6(1)(c) GDPR)</li>
              <li>It is necessary for legitimate interests (Art. 6(1)(f) GDPR)</li>
            </ul>
            <p className="text-zinc-300 mt-4">
              <strong>We never sell your data to third parties.</strong>
            </p>
          </section>

          {/* 8. Data Retention */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              8. Data Retention
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              We retain personal data only as long as necessary for the respective purposes:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-3 text-zinc-300">
              <li><strong>Account data:</strong> Until account deletion</li>
              <li><strong>Usage data:</strong> 12 months after last activity</li>
              <li><strong>Technical logs:</strong> 30 days</li>
              <li><strong>Payment data:</strong> According to legal retention requirements (10 years)</li>
            </ul>
          </section>

          {/* 9. Your Rights */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              9. Your Rights
            </h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              Under GDPR, you have the following rights:
            </p>
            <ul className="space-y-3 text-zinc-300">
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold shrink-0">Art. 15</span>
                <span><strong>Access:</strong> You can request information about your stored data.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold shrink-0">Art. 16</span>
                <span><strong>Rectification:</strong> You can request correction of inaccurate data.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold shrink-0">Art. 17</span>
                <span><strong>Erasure:</strong> You can request deletion of your data (&quot;right to be forgotten&quot;).</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold shrink-0">Art. 18</span>
                <span><strong>Restriction:</strong> You can request restriction of processing.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold shrink-0">Art. 20</span>
                <span><strong>Portability:</strong> You can receive your data in a machine-readable format.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold shrink-0">Art. 21</span>
                <span><strong>Objection:</strong> You can object to the processing of your data.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold shrink-0">Art. 7(3)</span>
                <span><strong>Withdrawal:</strong> You can withdraw consent at any time.</span>
              </li>
            </ul>
            <p className="text-zinc-300 mt-4">
              To exercise your rights, contact us at:{' '}
              <a href="mailto:support@prompt-finder.com" className="text-blue-400 hover:text-blue-300">
                support@prompt-finder.com
              </a>
            </p>
          </section>

          {/* 10. Supervisory Authority */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              10. Right to Complain
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              You have the right to lodge a complaint with a supervisory authority if you believe 
              your data is being processed in violation of GDPR.
            </p>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 mt-4 text-zinc-300">
              <p className="font-semibold text-white">Supervisory Authority:</p>
              <p className="mt-2">Der Landesbeauftragte für den Datenschutz und die Informationsfreiheit Baden-Württemberg</p>
              <p>Lautenschlagerstraße 20</p>
              <p>70173 Stuttgart, Germany</p>
              <p className="mt-2">
                <a href="https://www.baden-wuerttemberg.datenschutz.de" className="text-blue-400 hover:text-blue-300" target="_blank" rel="noopener noreferrer">
                  www.baden-wuerttemberg.datenschutz.de
                </a>
              </p>
            </div>
          </section>

          {/* 11. SSL */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              11. SSL/TLS Encryption
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              This website uses SSL/TLS encryption for security. You can recognize an encrypted 
              connection by the &quot;https://&quot; prefix and the lock icon in your browser&apos;s address bar.
            </p>
          </section>

          {/* 12. Changes */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              12. Changes to This Policy
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              We reserve the right to update this privacy policy to comply with legal requirements 
              or to reflect changes to our services. The updated policy will apply to your next visit.
            </p>
          </section>

        </div>

        {/* Contact Box */}
        <div className="mt-12 p-6 bg-zinc-900/50 border border-zinc-800 rounded-lg">
          <h3 className="text-xl font-semibold text-white mb-4">Questions about privacy?</h3>
          <p className="text-zinc-300 mb-4">
            For questions about data collection, processing, or your rights, please contact:
          </p>
          <a 
            href="mailto:support@prompt-finder.com"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Mail className="w-4 h-4" />
            support@prompt-finder.com
          </a>
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
