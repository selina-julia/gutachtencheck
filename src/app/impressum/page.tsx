import type { Metadata } from "next";

import { Abschnitt, Rechtstext } from "@/components/rechtstext";
import { anbieter } from "@/lib/anbieter";

export const metadata: Metadata = {
  title: "Impressum",
  description:
    "Offenlegung und Anbieterkennzeichnung nach § 5 ECG und § 25 MedienG.",
  alternates: { canonical: "/impressum" },
};

export default function ImpressumSeite() {
  return (
    <Rechtstext titel="Impressum" stand={anbieter.stand}>
      <Abschnitt titel="Diensteanbieter und Medieninhaber">
        <p>
          Angaben nach § 5 E-Commerce-Gesetz, § 14 Unternehmensgesetzbuch und
          § 25 Mediengesetz.
        </p>
        <address className="not-italic">
          {anbieter.name}
          <br />
          Geschäftsführer: {anbieter.geschaeftsfuehrer}
          <br />
          {anbieter.strasse}
          <br />
          {anbieter.plzOrt}
          <br />
          {anbieter.land}
        </address>
      </Abschnitt>

      <Abschnitt titel="Kontakt">
        <p>
          E-Mail:{" "}
          <a
            href={`mailto:${anbieter.email}`}
            className="text-primary underline underline-offset-4"
          >
            {anbieter.email}
          </a>
          <br />
          Telefon:{" "}
          <a
            href={`tel:${anbieter.telefonLink}`}
            className="text-primary underline underline-offset-4"
          >
            {anbieter.telefon}
          </a>
        </p>
      </Abschnitt>

      <Abschnitt titel="Unternehmensdaten">
        <p>
          Unternehmensgegenstand: Prüfung und Beurteilung von
          Versicherungsgutachten.
          <br />
          Umsatzsteuer-Identifikationsnummer: {anbieter.uid}
          <br />
          Firmenbuchnummer: {anbieter.firmenbuchnummer}
          <br />
          Firmenbuchgericht: {anbieter.firmenbuchgericht}
          <br />
          Sitz: {anbieter.plzOrt}
        </p>
      </Abschnitt>

      <Abschnitt titel="Berufsrechtliche Angaben">
        <p>
          Die Prüfungen führt {anbieter.sachverstaendiger} durch.
          Berufsbezeichnung: Allgemein beeideter und gerichtlich zertifizierter
          Sachverständiger, verliehen in Österreich.
        </p>
        <p>{anbieter.sachverstaendigenliste}</p>
        <p>
          Anwendbare Rechtsvorschriften: Bundesgesetz über den allgemein
          beeideten und gerichtlich zertifizierten Sachverständigen und
          Dolmetscher (SDG) sowie die Gewerbeordnung 1994, abrufbar über das
          Rechtsinformationssystem des Bundes unter{" "}
          <a
            href="https://www.ris.bka.gv.at"
            className="text-primary underline underline-offset-4"
          >
            ris.bka.gv.at
          </a>
          .
        </p>
        <p>
          Aufsichtsbehörde für die Gewerbeberechtigung: {anbieter.gewerbebehoerde}
          <br />
          Kammerzugehörigkeit: {anbieter.kammer}
        </p>
      </Abschnitt>

      <Abschnitt titel="Blattlinie">
        <p>
          Information über die Prüfung von Versicherungsgutachten durch einen
          unabhängigen Sachverständigen sowie Darstellung der angebotenen
          Leistungen.
        </p>
      </Abschnitt>

      <Abschnitt titel="Streitbeilegung">
        <p>
          Wir sind weder bereit noch verpflichtet, an
          Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
          teilzunehmen. Verbraucherinnen und Verbraucher können sich bei
          Streitigkeiten aus einem online geschlossenen Vertrag kostenlos an
          die Internet Ombudsstelle wenden:{" "}
          <a
            href="https://www.ombudsstelle.at"
            className="text-primary underline underline-offset-4"
          >
            ombudsstelle.at
          </a>
          .
        </p>
      </Abschnitt>

      <Abschnitt titel="Haftung für Inhalte und Links">
        <p>
          Die Inhalte dieser Seite werden mit Sorgfalt erstellt. Sie stellen
          allgemeine Information dar und ersetzen weder eine gutachterliche
          Beurteilung im Einzelfall noch eine Rechtsberatung. Für Inhalte
          externer Seiten, auf die verlinkt wird, ist ausschließlich deren
          jeweiliger Anbieter verantwortlich.
        </p>
      </Abschnitt>

      <Abschnitt titel="Urheberrecht">
        <p>
          Texte, Bilder und Gestaltung dieser Seite sind urheberrechtlich
          geschützt. Eine Verwendung außerhalb der gesetzlich zulässigen Fälle
          bedarf der vorherigen Zustimmung.
        </p>
      </Abschnitt>
    </Rechtstext>
  );
}
