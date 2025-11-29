import Link from 'next/link';
import { ArrowLeft, Mail, Phone, Building2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-3xl px-4 py-20">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Datenschutzerklärung</h1>
          <p className="text-lg text-zinc-400">So gehen wir mit Ihren Daten um</p>
          <p className="text-sm text-zinc-500 mt-2">Stand: November 2025</p>
          <Link href="/privacy" className="text-sm text-blue-400 hover:text-blue-300 mt-2 inline-block">
            🇬🇧 English Version
          </Link>
        </div>

        <div className="prose prose-invert max-w-none space-y-10">
          
          {/* 1. Verantwortlicher */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-blue-400" />
              1. Verantwortlicher
            </h2>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 space-y-2 text-zinc-300">
              <p className="font-semibold text-white">BG Online Media (haftungsbeschränkt)</p>
              <p>Grünwiesenstraße 33</p>
              <p>74321 Bietigheim-Bissingen</p>
              <p>Deutschland</p>
              <div className="pt-3 border-t border-zinc-800 mt-3 space-y-1">
                <p>Vertreten durch: Bernd Galter</p>
                <p>Handelsregister: HRB 774462, Amtsgericht Stuttgart</p>
                <p>USt-IdNr.: DE331972080</p>
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

          {/* 2. Übersicht */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              2. Übersicht der Verarbeitungen
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              PromptFinder ist eine Plattform für strukturierte AI-Workflows. Die nachfolgende Übersicht 
              fasst die Arten der verarbeiteten Daten und die Zwecke ihrer Verarbeitung zusammen.
            </p>
            <div className="mt-4 space-y-3 text-zinc-300">
              <p><strong className="text-white">Arten der verarbeiteten Daten:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Bestandsdaten (z.B. Namen, E-Mail-Adressen)</li>
                <li>Nutzungsdaten (z.B. besuchte Seiten, verwendete Workflows)</li>
                <li>Meta-/Kommunikationsdaten (z.B. IP-Adressen, Zeitpunkt des Zugriffs)</li>
                <li>Zahlungsdaten (werden ausschließlich vom Zahlungsdienstleister verarbeitet)</li>
              </ul>
            </div>
            <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-green-400 text-sm flex items-start gap-2">
                <Shield className="w-5 h-5 shrink-0 mt-0.5" />
                <span>
                  <strong>Wichtig:</strong> Inhalte, die Sie in Workflow-Eingabefelder eingeben 
                  (z.B. Meeting-Notizen, E-Mail-Texte), werden <strong>nicht</strong> auf unseren 
                  Servern gespeichert. Diese Daten verbleiben ausschließlich in Ihrem Browser und 
                  werden direkt an den von Ihnen gewählten AI-Dienst (z.B. ChatGPT) übermittelt.
                </span>
              </p>
            </div>
          </section>

          {/* 3. Rechtsgrundlagen */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              3. Rechtsgrundlagen
            </h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              Nachfolgend erhalten Sie eine Übersicht der Rechtsgrundlagen der DSGVO, auf deren Basis 
              wir personenbezogene Daten verarbeiten:
            </p>
            <ul className="space-y-3 text-zinc-300">
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold shrink-0">Art. 6 (1) a</span>
                <span><strong>Einwilligung:</strong> Die betroffene Person hat ihre Einwilligung gegeben.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold shrink-0">Art. 6 (1) b</span>
                <span><strong>Vertragserfüllung:</strong> Die Verarbeitung ist für die Erfüllung eines Vertrags erforderlich (z.B. Bereitstellung des Dienstes, Zahlungsabwicklung).</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold shrink-0">Art. 6 (1) f</span>
                <span><strong>Berechtigte Interessen:</strong> Die Verarbeitung ist zur Wahrung unserer berechtigten Interessen erforderlich (z.B. Sicherheit, Betrugsprävention, Analyse zur Verbesserung des Dienstes).</span>
              </li>
            </ul>
          </section>

          {/* 4. Welche Daten wir erheben */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              4. Welche Daten wir erheben
            </h2>
            
            <h3 className="text-xl font-medium text-white mt-6 mb-3">4.1 Kontodaten</h3>
            <p className="text-zinc-300 leading-relaxed">
              Bei der Registrierung erheben wir:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4 mt-2 text-zinc-300">
              <li>E-Mail-Adresse (Pflichtfeld)</li>
              <li>Name (falls angegeben)</li>
              <li>Profilbild (bei Anmeldung über Google)</li>
            </ul>
            <p className="text-zinc-400 text-sm mt-2">
              Rechtsgrundlage: Art. 6 (1) b DSGVO (Vertragserfüllung)
            </p>

            <h3 className="text-xl font-medium text-white mt-6 mb-3">4.2 Nutzungsdaten</h3>
            <p className="text-zinc-300 leading-relaxed">
              Zur Verbesserung unseres Dienstes speichern wir:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4 mt-2 text-zinc-300">
              <li>Welche Workflows Sie verwenden</li>
              <li>Welche Optionen Sie in Dropdown-Feldern auswählen</li>
              <li>Favorisierte Workflows</li>
              <li>Zeitpunkt der Nutzung</li>
            </ul>
            <div className="mt-3 p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg">
              <p className="text-zinc-400 text-sm">
                <strong>Wir speichern NICHT:</strong> Freitext-Eingaben, Inhalte aus Eingabefeldern, 
                Meeting-Notizen, E-Mail-Texte oder andere persönliche Inhalte, die Sie in Workflows eingeben.
              </p>
            </div>
            <p className="text-zinc-400 text-sm mt-2">
              Rechtsgrundlage: Art. 6 (1) f DSGVO (Berechtigte Interessen)
            </p>

            <h3 className="text-xl font-medium text-white mt-6 mb-3">4.3 Technische Daten</h3>
            <p className="text-zinc-300 leading-relaxed">
              Bei jedem Zugriff werden automatisch erfasst:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4 mt-2 text-zinc-300">
              <li>IP-Adresse (anonymisiert gespeichert)</li>
              <li>Browsertyp und -version</li>
              <li>Betriebssystem</li>
              <li>Datum und Uhrzeit des Zugriffs</li>
              <li>Referrer-URL</li>
            </ul>
            <p className="text-zinc-400 text-sm mt-2">
              Rechtsgrundlage: Art. 6 (1) f DSGVO (Berechtigte Interessen – Sicherheit, Stabilität)
            </p>
          </section>

          {/* 5. Cookies und LocalStorage */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              5. Cookies und LocalStorage
            </h2>
            
            <h3 className="text-xl font-medium text-white mt-6 mb-3">5.1 Notwendige Cookies</h3>
            <p className="text-zinc-300 leading-relaxed">
              Wir verwenden technisch notwendige Cookies für:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4 mt-2 text-zinc-300">
              <li>Authentifizierung und Session-Verwaltung (Supabase Auth)</li>
              <li>Sicherheitsfunktionen (CSRF-Schutz)</li>
            </ul>
            <p className="text-zinc-400 text-sm mt-2">
              Diese Cookies sind für den Betrieb der Website unbedingt erforderlich und können nicht 
              deaktiviert werden. Rechtsgrundlage: Art. 6 (1) f DSGVO.
            </p>

            <h3 className="text-xl font-medium text-white mt-6 mb-3">5.2 LocalStorage</h3>
            <p className="text-zinc-300 leading-relaxed">
              Wir nutzen den LocalStorage Ihres Browsers, um:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4 mt-2 text-zinc-300">
              <li>Ihren Fortschritt in mehrstufigen Workflows zu speichern</li>
              <li>Den aktuellen Schritt zu merken, falls Sie die Seite verlassen</li>
            </ul>
            <p className="text-zinc-400 text-sm mt-2">
              Diese Daten verbleiben ausschließlich in Ihrem Browser und werden nicht an unsere Server 
              übermittelt. Sie können den LocalStorage jederzeit in Ihren Browser-Einstellungen löschen.
            </p>

            <h3 className="text-xl font-medium text-white mt-6 mb-3">5.3 Keine Tracking-Cookies</h3>
            <p className="text-zinc-300 leading-relaxed">
              Wir verwenden <strong>keine</strong> Marketing- oder Tracking-Cookies. Es findet kein 
              Tracking durch Drittanbieter wie Google Analytics statt.
            </p>
          </section>

          {/* 6. Auftragsverarbeiter */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              6. Auftragsverarbeiter und Drittanbieter
            </h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              Wir setzen folgende Dienstleister ein, mit denen Auftragsverarbeitungsverträge (AVV) bestehen:
            </p>

            <div className="space-y-4">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
                <h4 className="font-semibold text-white">Supabase Inc.</h4>
                <p className="text-zinc-400 text-sm mt-1">Authentifizierung und Datenbank</p>
                <p className="text-zinc-300 text-sm mt-2">
                  Serverstandort: <strong>EU (Irland)</strong><br />
                  Zweck: Benutzerkonten, Datenspeicherung<br />
                  Datenschutz: <a href="https://supabase.com/privacy" className="text-blue-400 hover:text-blue-300" target="_blank" rel="noopener noreferrer">supabase.com/privacy</a>
                </p>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
                <h4 className="font-semibold text-white">Vercel Inc.</h4>
                <p className="text-zinc-400 text-sm mt-1">Webhosting</p>
                <p className="text-zinc-300 text-sm mt-2">
                  Serverstandort: <strong>EU</strong><br />
                  Zweck: Bereitstellung der Website<br />
                  Datenschutz: <a href="https://vercel.com/legal/privacy-policy" className="text-blue-400 hover:text-blue-300" target="_blank" rel="noopener noreferrer">vercel.com/legal/privacy-policy</a>
                </p>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
                <h4 className="font-semibold text-white">LemonSqueezy LLC</h4>
                <p className="text-zinc-400 text-sm mt-1">Zahlungsabwicklung</p>
                <p className="text-zinc-300 text-sm mt-2">
                  Zweck: Abwicklung von Pro-Abonnements<br />
                  Zahlungsdaten werden ausschließlich von LemonSqueezy verarbeitet.<br />
                  Wir speichern keine Kreditkarten- oder Bankdaten.<br />
                  Datenschutz: <a href="https://www.lemonsqueezy.com/privacy" className="text-blue-400 hover:text-blue-300" target="_blank" rel="noopener noreferrer">lemonsqueezy.com/privacy</a>
                </p>
              </div>
            </div>

            <h3 className="text-xl font-medium text-white mt-6 mb-3">6.4 Schriftarten</h3>
            <p className="text-zinc-300 leading-relaxed">
              Wir verwenden die Schriftarten &quot;Geist&quot; und &quot;Geist Mono&quot;. Diese werden 
              <strong> lokal von unserem Server</strong> ausgeliefert (Self-Hosting). Es findet keine 
              Verbindung zu Google-Servern statt und Ihre IP-Adresse wird nicht an Google übertragen.
            </p>
          </section>

          {/* 7. Datenweitergabe */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              7. Datenweitergabe
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              Wir geben Ihre personenbezogenen Daten <strong>nicht</strong> an Dritte weiter, es sei denn:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-3 text-zinc-300">
              <li>Sie haben ausdrücklich eingewilligt (Art. 6 (1) a DSGVO)</li>
              <li>Es ist zur Vertragserfüllung erforderlich (Art. 6 (1) b DSGVO), z.B. Zahlungsabwicklung</li>
              <li>Es besteht eine gesetzliche Verpflichtung (Art. 6 (1) c DSGVO)</li>
              <li>Es ist zur Wahrung berechtigter Interessen erforderlich (Art. 6 (1) f DSGVO)</li>
            </ul>
            <p className="text-zinc-300 mt-4">
              <strong>Wir verkaufen Ihre Daten niemals an Dritte.</strong>
            </p>
          </section>

          {/* 8. Speicherdauer */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              8. Speicherdauer
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              Wir speichern personenbezogene Daten nur so lange, wie es für die jeweiligen Zwecke 
              erforderlich ist:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-3 text-zinc-300">
              <li><strong>Kontodaten:</strong> Bis zur Löschung Ihres Kontos</li>
              <li><strong>Nutzungsdaten:</strong> 12 Monate nach letzter Aktivität</li>
              <li><strong>Technische Logs:</strong> 30 Tage</li>
              <li><strong>Zahlungsdaten:</strong> Gemäß gesetzlicher Aufbewahrungspflichten (10 Jahre)</li>
            </ul>
          </section>

          {/* 9. Ihre Rechte */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              9. Ihre Rechte
            </h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              Nach der DSGVO stehen Ihnen folgende Rechte zu:
            </p>
            <ul className="space-y-3 text-zinc-300">
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold shrink-0">Art. 15</span>
                <span><strong>Auskunftsrecht:</strong> Sie können Auskunft über Ihre bei uns gespeicherten Daten verlangen.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold shrink-0">Art. 16</span>
                <span><strong>Berichtigung:</strong> Sie können die Berichtigung unrichtiger Daten verlangen.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold shrink-0">Art. 17</span>
                <span><strong>Löschung:</strong> Sie können die Löschung Ihrer Daten verlangen (&quot;Recht auf Vergessenwerden&quot;).</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold shrink-0">Art. 18</span>
                <span><strong>Einschränkung:</strong> Sie können die Einschränkung der Verarbeitung verlangen.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold shrink-0">Art. 20</span>
                <span><strong>Datenübertragbarkeit:</strong> Sie können Ihre Daten in einem maschinenlesbaren Format erhalten.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold shrink-0">Art. 21</span>
                <span><strong>Widerspruch:</strong> Sie können der Verarbeitung Ihrer Daten widersprechen.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold shrink-0">Art. 7 (3)</span>
                <span><strong>Widerruf:</strong> Sie können eine erteilte Einwilligung jederzeit widerrufen.</span>
              </li>
            </ul>
            <p className="text-zinc-300 mt-4">
              Zur Ausübung Ihrer Rechte wenden Sie sich bitte an:{' '}
              <a href="mailto:support@prompt-finder.com" className="text-blue-400 hover:text-blue-300">
                support@prompt-finder.com
              </a>
            </p>
          </section>

          {/* 10. Beschwerderecht */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              10. Beschwerderecht bei der Aufsichtsbehörde
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              Unbeschadet eines anderweitigen verwaltungsrechtlichen oder gerichtlichen Rechtsbehelfs 
              steht Ihnen das Recht auf Beschwerde bei einer Aufsichtsbehörde zu, wenn Sie der Ansicht 
              sind, dass die Verarbeitung Ihrer Daten gegen die DSGVO verstößt.
            </p>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 mt-4 text-zinc-300">
              <p className="font-semibold text-white">Zuständige Aufsichtsbehörde:</p>
              <p className="mt-2">Der Landesbeauftragte für den Datenschutz und die Informationsfreiheit Baden-Württemberg</p>
              <p>Lautenschlagerstraße 20</p>
              <p>70173 Stuttgart</p>
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
              11. SSL-/TLS-Verschlüsselung
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              Diese Website nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher 
              Inhalte eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie 
              daran, dass die Adresszeile des Browsers von &quot;http://&quot; auf &quot;https://&quot; wechselt und an dem 
              Schloss-Symbol in Ihrer Browserzeile.
            </p>
          </section>

          {/* 12. Änderungen */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              12. Änderungen dieser Datenschutzerklärung
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den aktuellen 
              rechtlichen Anforderungen entspricht oder um Änderungen unserer Leistungen umzusetzen. 
              Für Ihren erneuten Besuch gilt dann die neue Datenschutzerklärung.
            </p>
          </section>

          {/* 13. Verbraucherstreitbeilegung */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              13. Verbraucherstreitbeilegung
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer 
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>

        </div>

        {/* Contact Box */}
        <div className="mt-12 p-6 bg-zinc-900/50 border border-zinc-800 rounded-lg">
          <h3 className="text-xl font-semibold text-white mb-4">Fragen zum Datenschutz?</h3>
          <p className="text-zinc-300 mb-4">
            Bei Fragen zur Erhebung, Verarbeitung oder Nutzung Ihrer personenbezogenen Daten wenden Sie sich bitte an:
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
              Zurück zur Startseite
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

