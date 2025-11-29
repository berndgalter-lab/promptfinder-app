import Link from 'next/link';
import { ArrowLeft, AlertTriangle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CancellationPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-3xl px-4 py-20">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Right of Withdrawal</h1>
          <p className="text-lg text-zinc-400">Cancellation Policy</p>
          <Link href="/widerruf" className="text-sm text-blue-400 hover:text-blue-300 mt-2 inline-block">
            🇩🇪 Deutsche Version
          </Link>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">

          {/* Important Notice */}
          <section className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h2 className="text-lg font-semibold text-amber-500 mt-0 mb-2">
                  Important Notice for Digital Content
                </h2>
                <p className="text-zinc-300 text-sm mb-0">
                  PromptFinder is a digital service that is provided immediately after purchase. 
                  By consenting to immediate contract execution and confirming that you thereby lose 
                  your right of withdrawal, the right of withdrawal expires upon conclusion of the contract.
                </p>
              </div>
            </div>
          </section>

          {/* Right of Withdrawal */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Right of Withdrawal</h2>
            <p className="text-zinc-300 leading-relaxed">
              You have the right to withdraw from this contract within fourteen days without giving any reason.
            </p>
            <p className="text-zinc-300 leading-relaxed mt-3">
              The withdrawal period is fourteen days from the day of the conclusion of the contract.
            </p>
            <p className="text-zinc-300 leading-relaxed mt-3">
              To exercise your right of withdrawal, you must inform us:
            </p>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 mt-3 text-zinc-300">
              <p className="font-semibold text-white">BG Online Media (haftungsbeschränkt)</p>
              <p>Grünwiesenstraße 33</p>
              <p>74321 Bietigheim-Bissingen</p>
              <p>Germany</p>
              <p className="mt-2">Email: support@prompt-finder.com</p>
            </div>
            <p className="text-zinc-300 leading-relaxed mt-3">
              of your decision to withdraw from this contract by a clear statement (e.g., a letter sent 
              by post or e-mail). You may use the attached model withdrawal form, but it is not obligatory.
            </p>
            <p className="text-zinc-300 leading-relaxed mt-3">
              To meet the withdrawal deadline, it is sufficient for you to send your communication 
              concerning your exercise of the right of withdrawal before the withdrawal period has expired.
            </p>
          </section>

          {/* Effects of Withdrawal */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Effects of Withdrawal</h2>
            <p className="text-zinc-300 leading-relaxed">
              If you withdraw from this contract, we shall reimburse all payments received from you, 
              without undue delay and in any event not later than fourteen days from the day on which 
              we are informed about your decision to withdraw from this contract. We will carry out such 
              reimbursement using the same means of payment as you used for the initial transaction, 
              unless you have expressly agreed otherwise; in any event, you will not incur any fees as 
              a result of such reimbursement.
            </p>
          </section>

          {/* Expiry for Digital Content */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Premature Expiry of the Right of Withdrawal
            </h2>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div className="text-zinc-300">
                  <p>
                    The right of withdrawal expires for contracts for the supply of <strong>digital content 
                    which is not supplied on a tangible medium</strong> if the trader has begun performance 
                    after the consumer:
                  </p>
                  <ol className="list-decimal list-inside mt-3 space-y-2">
                    <li>has expressly consented to the trader beginning performance before the expiry of the withdrawal period, and</li>
                    <li>has acknowledged that they thereby lose their right of withdrawal.</li>
                  </ol>
                  <p className="mt-3 text-sm text-zinc-400">
                    This consent is obtained during the checkout process.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Model Withdrawal Form */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Model Withdrawal Form</h2>
            <p className="text-zinc-400 text-sm mb-3">
              (Complete and return this form only if you wish to withdraw from the contract.)
            </p>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 text-zinc-300 space-y-3">
              <p>To:<br />
                BG Online Media (haftungsbeschränkt)<br />
                Grünwiesenstraße 33<br />
                74321 Bietigheim-Bissingen<br />
                Germany<br />
                Email: support@prompt-finder.com
              </p>
              <p>
                I/We (*) hereby give notice that I/We (*) withdraw from my/our (*) contract of sale 
                of the following goods (*) / for the provision of the following service (*)
              </p>
              <p>— Ordered on (*) / received on (*)</p>
              <p>— Name of consumer(s)</p>
              <p>— Address of consumer(s)</p>
              <p>— Signature of consumer(s) (only if this form is notified on paper)</p>
              <p>— Date</p>
              <p className="text-zinc-500 text-sm">(*) Delete as appropriate.</p>
            </div>
          </section>

          {/* Voluntary Money-Back Guarantee */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Our 30-Day Money-Back Guarantee</h2>
            <p className="text-zinc-300 leading-relaxed">
              Regardless of the statutory right of withdrawal, we offer you a voluntary 
              <strong> 30-day money-back guarantee</strong>. If you are not satisfied with our service, 
              we will refund the purchase price within 30 days of purchase – no questions asked.
            </p>
            <p className="text-zinc-300 leading-relaxed mt-3">
              Simply contact us at{' '}
              <a href="mailto:support@prompt-finder.com" className="text-blue-400 hover:text-blue-300">
                support@prompt-finder.com
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

