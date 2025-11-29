import Link from 'next/link';
import { ArrowLeft, Mail, Phone, Building2, FileText, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-3xl px-4 py-20">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Impressum</h1>
          <p className="text-lg text-zinc-400">Legal Notice</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-10">
          
          {/* Angaben gemäß § 5 TMG */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-blue-400" />
              Angaben gemäß § 5 TMG
            </h2>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 space-y-2 text-zinc-300">
              <p className="font-semibold text-white text-lg">BG Online Media (haftungsbeschränkt)</p>
              <p>Grünwiesenstraße 33</p>
              <p>74321 Bietigheim-Bissingen</p>
              <p>Deutschland</p>
            </div>
          </section>

          {/* Vertreten durch */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Vertreten durch
            </h2>
            <p className="text-zinc-300">
              Geschäftsführer: Bernd Galter
            </p>
          </section>

          {/* Kontakt */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Kontakt
            </h2>
            <div className="space-y-3 text-zinc-300">
              <p className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-400" />
                <span>+49 176 22372958</span>
              </p>
              <p className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-400" />
                <a href="mailto:support@prompt-finder.com" className="text-blue-400 hover:text-blue-300">
                  support@prompt-finder.com
                </a>
              </p>
            </div>
          </section>

          {/* Handelsregister */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-400" />
              Handelsregister
            </h2>
            <div className="space-y-2 text-zinc-300">
              <p><strong>Registergericht:</strong> Amtsgericht Stuttgart</p>
              <p><strong>Registernummer:</strong> HRB 774462</p>
            </div>
          </section>

          {/* Umsatzsteuer-ID */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Umsatzsteuer-ID
            </h2>
            <p className="text-zinc-300">
              Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
              <strong className="text-white">DE331972080</strong>
            </p>
          </section>

          {/* EU-Streitschlichtung */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
              <Scale className="w-6 h-6 text-blue-400" />
              EU-Streitschlichtung
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
              <a 
                href="https://ec.europa.eu/consumers/odr/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300"
              >
                https://ec.europa.eu/consumers/odr/
              </a>
            </p>
            <p className="text-zinc-300 mt-3">
              Unsere E-Mail-Adresse finden Sie oben im Impressum.
            </p>
          </section>

          {/* Verbraucherstreitbeilegung */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Verbraucherstreitbeilegung / Universalschlichtungsstelle
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer 
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>

          {/* Haftung für Inhalte */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Haftung für Inhalte
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten 
              nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als 
              Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde 
              Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige 
              Tätigkeit hinweisen.
            </p>
            <p className="text-zinc-300 leading-relaxed mt-3">
              Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den 
              allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch 
              erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei 
              Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend 
              entfernen.
            </p>
          </section>

          {/* Haftung für Links */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Haftung für Links
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen 
              Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. 
              Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der 
              Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf 
              mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der 
              Verlinkung nicht erkennbar.
            </p>
            <p className="text-zinc-300 leading-relaxed mt-3">
              Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete 
              Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von 
              Rechtsverletzungen werden wir derartige Links umgehend entfernen.
            </p>
          </section>

          {/* Urheberrecht */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Urheberrecht
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen 
              dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art 
              der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen 
              Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind 
              nur für den privaten, nicht kommerziellen Gebrauch gestattet.
            </p>
            <p className="text-zinc-300 leading-relaxed mt-3">
              Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die 
              Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche 
              gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, 
              bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen 
              werden wir derartige Inhalte umgehend entfernen.
            </p>
          </section>

        </div>

        {/* Links zu anderen rechtlichen Seiten */}
        <div className="mt-12 p-6 bg-zinc-900/50 border border-zinc-800 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Weitere rechtliche Informationen</h3>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy" className="text-blue-400 hover:text-blue-300">
              Privacy Policy (EN)
            </Link>
            <span className="text-zinc-600">•</span>
            <Link href="/datenschutz" className="text-blue-400 hover:text-blue-300">
              Datenschutzerklärung (DE)
            </Link>
            <span className="text-zinc-600">•</span>
            <Link href="/terms" className="text-blue-400 hover:text-blue-300">
              Terms of Service
            </Link>
          </div>
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

