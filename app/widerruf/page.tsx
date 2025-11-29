import Link from 'next/link';
import { ArrowLeft, AlertTriangle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function WiderrufPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-3xl px-4 py-20">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Widerrufsbelehrung</h1>
          <p className="text-lg text-zinc-400">Right of Withdrawal</p>
          <Link href="/cancellation" className="text-sm text-blue-400 hover:text-blue-300 mt-2 inline-block">
            🇬🇧 English Version
          </Link>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">

          {/* Wichtiger Hinweis */}
          <section className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h2 className="text-lg font-semibold text-amber-500 mt-0 mb-2">
                  Wichtiger Hinweis zu digitalen Inhalten
                </h2>
                <p className="text-zinc-300 text-sm mb-0">
                  PromptFinder ist ein digitaler Dienst, der sofort nach dem Kauf bereitgestellt wird. 
                  Mit Ihrer Zustimmung zur sofortigen Vertragsausführung und Ihrer Bestätigung, dass Sie 
                  damit Ihr Widerrufsrecht verlieren, erlischt das Widerrufsrecht bei Vertragsschluss.
                </p>
              </div>
            </div>
          </section>

          {/* Widerrufsrecht */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Widerrufsrecht</h2>
            <p className="text-zinc-300 leading-relaxed">
              Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.
            </p>
            <p className="text-zinc-300 leading-relaxed mt-3">
              Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsschlusses.
            </p>
            <p className="text-zinc-300 leading-relaxed mt-3">
              Um Ihr Widerrufsrecht auszuüben, müssen Sie uns:
            </p>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 mt-3 text-zinc-300">
              <p className="font-semibold text-white">BG Online Media (haftungsbeschränkt)</p>
              <p>Grünwiesenstraße 33</p>
              <p>74321 Bietigheim-Bissingen</p>
              <p>Deutschland</p>
              <p className="mt-2">E-Mail: support@prompt-finder.com</p>
            </div>
            <p className="text-zinc-300 leading-relaxed mt-3">
              mittels einer eindeutigen Erklärung (z.B. ein mit der Post versandter Brief oder E-Mail) 
              über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Sie können dafür das 
              beigefügte Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.
            </p>
            <p className="text-zinc-300 leading-relaxed mt-3">
              Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung 
              des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.
            </p>
          </section>

          {/* Folgen des Widerrufs */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Folgen des Widerrufs</h2>
            <p className="text-zinc-300 leading-relaxed">
              Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen 
              erhalten haben, unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, 
              an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist. Für diese 
              Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion 
              eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart; in keinem 
              Fall werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.
            </p>
          </section>

          {/* Ausschluss bei digitalen Inhalten */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Vorzeitiges Erlöschen des Widerrufsrechts
            </h2>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div className="text-zinc-300">
                  <p>
                    Das Widerrufsrecht erlischt bei einem Vertrag über die Lieferung von <strong>nicht auf 
                    einem körperlichen Datenträger befindlichen digitalen Inhalten</strong>, wenn der 
                    Unternehmer mit der Ausführung des Vertrags begonnen hat, nachdem der Verbraucher:
                  </p>
                  <ol className="list-decimal list-inside mt-3 space-y-2">
                    <li>ausdrücklich zugestimmt hat, dass der Unternehmer mit der Ausführung des Vertrags vor Ablauf der Widerrufsfrist beginnt, und</li>
                    <li>seine Kenntnis davon bestätigt hat, dass er durch seine Zustimmung mit Beginn der Ausführung des Vertrags sein Widerrufsrecht verliert.</li>
                  </ol>
                  <p className="mt-3 text-sm text-zinc-400">
                    Diese Zustimmung wird im Bestellprozess eingeholt.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Muster-Widerrufsformular */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Muster-Widerrufsformular</h2>
            <p className="text-zinc-400 text-sm mb-3">
              (Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses Formular aus und senden Sie es zurück.)
            </p>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 text-zinc-300 space-y-3">
              <p>An:<br />
                BG Online Media (haftungsbeschränkt)<br />
                Grünwiesenstraße 33<br />
                74321 Bietigheim-Bissingen<br />
                E-Mail: support@prompt-finder.com
              </p>
              <p>
                Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über 
                den Kauf der folgenden Waren (*) / die Erbringung der folgenden Dienstleistung (*)
              </p>
              <p>— Bestellt am (*) / erhalten am (*)</p>
              <p>— Name des/der Verbraucher(s)</p>
              <p>— Anschrift des/der Verbraucher(s)</p>
              <p>— Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier)</p>
              <p>— Datum</p>
              <p className="text-zinc-500 text-sm">(*) Unzutreffendes streichen.</p>
            </div>
          </section>

          {/* Freiwillige Geld-zurück-Garantie */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Unsere 30-Tage Geld-zurück-Garantie</h2>
            <p className="text-zinc-300 leading-relaxed">
              Unabhängig vom gesetzlichen Widerrufsrecht bieten wir Ihnen eine freiwillige 
              <strong> 30-Tage Geld-zurück-Garantie</strong>. Wenn Sie mit unserem Service nicht 
              zufrieden sind, erstatten wir Ihnen den Kaufpreis innerhalb von 30 Tagen nach dem Kauf – 
              ohne Angabe von Gründen.
            </p>
            <p className="text-zinc-300 leading-relaxed mt-3">
              Kontaktieren Sie uns einfach unter{' '}
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
              Zurück zur Startseite
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

