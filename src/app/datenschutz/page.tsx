import type { Metadata } from "next";

import { Abschnitt, Rechtstext } from "@/components/rechtstext";
import { anbieter } from "@/lib/anbieter";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description:
    "Welche personenbezogenen Daten beim Besuch dieser Seite und bei einer Beauftragung verarbeitet werden, auf welcher Rechtsgrundlage und wie lange.",
  alternates: { canonical: "/datenschutz" },
};

export default function DatenschutzSeite() {
  return (
    <Rechtstext titel="Datenschutzerklärung" stand={anbieter.stand}>
      <Abschnitt titel="Verantwortlicher">
        <p>
          Verantwortlich für die Verarbeitung personenbezogener Daten im Sinne
          der Datenschutz-Grundverordnung (DSGVO) ist:
        </p>
        <address className="not-italic">
          {anbieter.name}
          <br />
          {anbieter.strasse}
          <br />
          {anbieter.plzOrt}
          <br />
          {anbieter.land}
          <br />
          E-Mail: {anbieter.email}
        </address>
        <p>
          Ein Datenschutzbeauftragter ist nicht bestellt, weil die
          Voraussetzungen des Art 37 DSGVO nicht vorliegen.
        </p>
      </Abschnitt>

      <Abschnitt titel="Aufruf der Website">
        <p>
          Beim Aufruf dieser Seite überträgt Ihr Browser technisch notwendige
          Daten an den Server unseres Hosting-Anbieters, insbesondere IP-Adresse,
          Datum und Uhrzeit, aufgerufene Adresse, übertragene Datenmenge sowie
          Browser- und Betriebssystemkennung. Diese Server-Protokolle sind für
          den Betrieb und die Sicherheit der Seite erforderlich.
        </p>
        <p>
          Rechtsgrundlage ist unser berechtigtes Interesse an einem sicheren und
          störungsfreien Betrieb nach Art 6 Abs 1 lit f DSGVO. Die Protokolle
          werden nach kurzer Zeit gelöscht und nicht mit anderen Daten
          zusammengeführt.
        </p>
        <p>
          Als Auftragsverarbeiter nach Art 28 DSGVO ist eingebunden:{" "}
          {anbieter.hoster}
        </p>
      </Abschnitt>

      <Abschnitt titel="Keine Analyse, keine Werbung, keine Einbindung Dritter">
        <p>
          Diese Seite verwendet keine Analyse- oder Trackingwerkzeuge, keine
          Werbenetzwerke und keine Social-Media-Plugins. Es werden keine Profile
          über Ihr Verhalten gebildet.
        </p>
        <p>
          Die verwendeten Schriften werden mit der Seite ausgeliefert und nicht
          von einem fremden Server nachgeladen. Beim Betrachten der Seite
          entsteht dadurch keine Verbindung zu Google oder einem anderen
          Drittanbieter.
        </p>
        <p>
          Wir setzen selbst keine Cookies, die Ihrer Einwilligung bedürften.
          Deshalb gibt es auf dieser Seite auch kein Einwilligungsbanner.
        </p>
      </Abschnitt>

      <Abschnitt titel="Beauftragung und Zahlung über Stripe">
        <p>
          Für die Bezahlung nutzen wir Stripe. Wenn Sie eine Leistung kaufen,
          werden Sie auf eine von Stripe betriebene Bezahlseite weitergeleitet.
          Ihren Namen, Ihre E-Mail-Adresse, die Rechnungsadresse und die
          Zahlungsdaten geben Sie dort direkt bei Stripe ein. Vollständige
          Kartendaten erreichen unseren Server zu keinem Zeitpunkt.
        </p>
        <p>
          Von Stripe erhalten wir anschließend die Angaben, die wir zur
          Erfüllung des Vertrags und zur Rechnungslegung benötigen: Name,
          E-Mail-Adresse, Rechnungsadresse, Betrag, Zahlungsstatus und
          Zeitpunkt. Zusätzlich wird zum Zahlungsvorgang vermerkt, dass Sie den
          Allgemeinen Geschäftsbedingungen und dem vorzeitigen Beginn der
          Leistung zugestimmt haben, samt Zeitpunkt der Zustimmung. Dieser
          Vermerk dient dem Nachweis nach dem Fern- und
          Auswärtsgeschäfte-Gesetz.
        </p>
        <p>
          Rechtsgrundlage ist die Erfüllung des Vertrags nach Art 6 Abs 1 lit b
          DSGVO sowie, was die steuerliche Aufbewahrung betrifft, die Erfüllung
          einer rechtlichen Verpflichtung nach Art 6 Abs 1 lit c DSGVO.
        </p>
        <p>
          Anbieter ist Stripe Payments Europe Limited, 1 Grand Canal Street
          Lower, Grand Canal Dock, Dublin, Irland. Eine Übermittlung an die
          Stripe, Inc. in den Vereinigten Staaten ist möglich; die Einzelheiten
          und die dafür herangezogenen Garantien beschreibt Stripe in seiner
          Datenschutzerklärung unter{" "}
          <a
            href="https://stripe.com/at/privacy"
            className="text-primary underline underline-offset-4"
          >
            stripe.com/at/privacy
          </a>
          .
        </p>
      </Abschnitt>

      <Abschnitt titel="Prüfung Ihres Gutachtens">
        <p>
          Die Unterlagen, die Sie zur Prüfung übermitteln – insbesondere das
          Gutachten der Versicherung und Ihre Schilderung des Schadens –
          verarbeiten wir ausschließlich zur Erbringung der beauftragten
          Leistung. Rechtsgrundlage ist Art 6 Abs 1 lit b DSGVO.
        </p>
        <p>
          Solche Unterlagen können besondere Kategorien personenbezogener Daten
          enthalten, etwa Gesundheitsdaten nach einem Personenschaden. Soweit
          das der Fall ist, verarbeiten wir sie nur, soweit dies zur
          Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen
          erforderlich ist (Art 9 Abs 2 lit f DSGVO). Übermitteln Sie bitte nur
          Unterlagen, die für die Beurteilung tatsächlich benötigt werden.
        </p>
        <p>
          Eine Weitergabe an Dritte erfolgt nicht, es sei denn, Sie beauftragen
          uns ausdrücklich damit, etwa gegenüber Ihrer Rechtsvertretung oder
          Ihrem Rechtsschutzversicherer.
        </p>
      </Abschnitt>

      <Abschnitt titel="Kontaktaufnahme">
        <p>
          Wenn Sie uns per E-Mail schreiben, verarbeiten wir Ihre Angaben zur
          Beantwortung Ihrer Anfrage. Rechtsgrundlage ist Art 6 Abs 1 lit b
          DSGVO, wenn die Anfrage der Anbahnung eines Vertrags dient,
          andernfalls unser berechtigtes Interesse an der Beantwortung nach
          Art 6 Abs 1 lit f DSGVO.
        </p>
      </Abschnitt>

      <Abschnitt titel="Speicherdauer">
        <p>
          Daten zu einem abgeschlossenen Auftrag bewahren wir sieben Jahre auf,
          soweit sie Bücher, Belege oder Aufzeichnungen im Sinne des § 132
          Bundesabgabenordnung betreffen. Unterlagen, die für die Prüfung
          übermittelt wurden und keiner Aufbewahrungspflicht unterliegen,
          löschen wir, sobald der Auftrag abgeschlossen ist und keine Ansprüche
          mehr daraus zu erwarten sind. Anfragen, die zu keinem Auftrag führen,
          löschen wir, sobald der Vorgang erledigt ist.
        </p>
      </Abschnitt>

      <Abschnitt titel="Ihre Rechte">
        <p>
          Sie haben das Recht auf Auskunft über die zu Ihrer Person
          verarbeiteten Daten, auf Berichtigung, auf Löschung, auf
          Einschränkung der Verarbeitung sowie auf Datenübertragbarkeit. Gegen
          Verarbeitungen, die auf einem berechtigten Interesse beruhen, können
          Sie jederzeit Widerspruch erheben. Wenden Sie sich dafür formlos an{" "}
          {anbieter.email}.
        </p>
        <p>
          Eine automatisierte Entscheidungsfindung einschließlich Profiling
          findet nicht statt. Die Beurteilung Ihres Gutachtens trifft ein
          Mensch.
        </p>
        <p>
          Wenn Sie der Ansicht sind, dass die Verarbeitung Ihrer Daten gegen die
          DSGVO verstößt, können Sie sich bei der Aufsichtsbehörde beschweren.
          In Österreich ist das die Österreichische Datenschutzbehörde,
          Barichgasse 40–42, 1030 Wien,{" "}
          <a
            href="https://www.dsb.gv.at"
            className="text-primary underline underline-offset-4"
          >
            dsb.gv.at
          </a>
          .
        </p>
      </Abschnitt>
    </Rechtstext>
  );
}
