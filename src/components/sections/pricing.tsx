import Link from "next/link";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";

const pakete = [
  {
    name: "Erst-Einschätzung",
    kurz: "Wenn Sie ein ungutes Gefühl haben, es aber fachlich nicht festmachen können.",
    preis: "149 €",
    zusatz: ["inkl. USt", "Lieferung in 3 Werktagen"],
    cta: "Erst-Einschätzung kaufen",
    href: "/pruefung/erst-einschaetzung",
    hervorgehoben: false,
    badge: null,
    badgeTon: null,
    leistungen: [
      "Sichtung des Gutachtens durch einen beeideten Sachverständigen",
      "Schriftliche Kurzbewertung mit klarer Ampel-Aussage",
      "Drei bis fünf konkret benannte Auffälligkeiten",
      "Empfehlung zum weiteren Vorgehen",
      "Einschätzung, ob ein Nachforderungspotenzial besteht",
    ],
  },
  {
    name: "Gutachterliche Stellungnahme",
    kurz: "Der klassische Fall: ein strittiger Betrag ab rund 5.000 €.",
    preis: "ab 490 €",
    zusatz: ["inkl. USt", "Lieferung in 5–7 Werktagen"],
    cta: "Festpreis anfragen",
    href: "/anfrage/stellungnahme",
    hervorgehoben: true,
    badge: "Am häufigsten beauftragt",
    badgeTon: "primary" as const,
    leistungen: [
      "Positionsprüfung: Mengen, Massen, Einheitspreise, Nebenleistungen",
      "Prüfung der Bewertungsmethodik: Neuwert, Zeitwert, Abzug neu für alt",
      "Abgleich mit ÖNORMEN und anerkannten Regeln der Technik",
      "Prüfung von Schadensursache und Kausalität",
      "Hinweis auf mögliche Unterversicherung",
      "Beantwortung von bis zu fünf Einzelfragen",
      "Beziffertes Ergebnis und Formulierungsvorschlag an die Versicherung",
    ],
  },
  {
    name: "Vertiefte Prüfung",
    kurz: "Große Brandschäden, gewerbliche Fälle oder widersprüchliche Gutachten.",
    preis: "ab 1.200 €",
    zusatz: ["inkl. USt", "Lieferzeit nach Vereinbarung"],
    cta: "Festpreis anfragen",
    href: "/anfrage/vertiefte-pruefung",
    hervorgehoben: false,
    badge: null,
    badgeTon: null,
    leistungen: [
      "Alles aus der Gutachterlichen Stellungnahme",
      "Mehrere Gutachten und Gegengutachten im Vergleich",
      "Sanierungskonzept, Substanzfragen, Ausführungsvarianten",
      "Unterversicherung inklusive Berechnung der Auswirkung",
      "Betriebsunterbrechungs- und Folgeschäden",
      "Kausalitäts- und Obliegenheitsfragen, Fragen ohne Mengenbegrenzung",
      "Videobesprechung über 45 Minuten, Deckungsprüfung enthalten",
    ],
  },
  {
    name: "Deckungsprüfung",
    kurz: "Wenn die Versicherung ganz oder teilweise abgelehnt hat.",
    preis: "290 €",
    zusatz: [
      "inkl. USt, nur als Zubuchung zur Gutachterlichen Stellungnahme",
      "einzeln beauftragt 390 €",
    ],
    cta: "Deckungsprüfung anfragen",
    href: "/anfrage/deckungspruefung",
    hervorgehoben: false,
    badge: "Zusatzmodul",
    badgeTon: "neutral" as const,
    leistungen: [
      "Herausarbeitung der technischen Tatbestandsmerkmale Ihres Vertrags",
      "Prüfung Merkmal für Merkmal, nachvollziehbar begründet",
      "Technische Überprüfung der herangezogenen Ablehnungsgründe",
      "Auswertung amtlicher Wetterdaten, soweit einschlägig",
      "Prüfung einer behaupteten Unterversicherung",
      "Bei Obliegenheitsverletzung: Soll-Ist-Vergleich",
    ],
  },
];

export function Pricing() {
  return (
    <section id="preise" className="scroll-mt-24 bg-background">
      <div className="mx-auto max-w-[1520px] px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-y-8 lg:grid-cols-2 lg:items-start lg:gap-x-20">
          <h2 className="text-[clamp(1.75rem,3.4vw,3rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-foreground">
            Sie zahlen einen Festpreis,
            <br />
            <span className="font-serif font-semibold italic text-muted-foreground">
              kein Erfolgshonorar
            </span>
          </h2>

          <p className="max-w-[52ch] text-base leading-relaxed text-muted-foreground">
            Meine Vergütung ist vom Ergebnis unabhängig – nur so behält die
            Beurteilung ihren Wert, auch wenn sie einmal zu Ihren Ungunsten
            ausfällt. Die Erst-Einschätzung kaufen Sie direkt, für die übrigen
            Pakete erhalten Sie innerhalb von 24 Stunden ein verbindliches
            Festpreisangebot.
          </p>
        </div>

        <ul className="mt-12 grid gap-6 md:grid-cols-2 xl:mt-16 xl:grid-cols-4">
          {pakete.map((paket) => (
            <li
              key={paket.name}
              className={
                paket.hervorgehoben
                  ? "flex flex-col rounded-2xl border-2 border-primary bg-background p-6"
                  : "flex flex-col rounded-2xl border border-border bg-background p-6"
              }
            >
              <div className="flex min-h-6 items-start">
                {paket.badge ? (
                  <span
                    className={
                      paket.badgeTon === "primary"
                        ? "rounded-full bg-brand-tint px-3 py-1 text-xs font-semibold text-primary"
                        : "rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground"
                    }
                  >
                    {paket.badge}
                  </span>
                ) : null}
              </div>

              {/* Feste Blockhöhe statt Mindesthöhe je Zeile — so sitzt der
                  Kurztext dicht am Titel und die Karten bleiben trotzdem auf
                  einer Linie, auch wenn ein Titel zweizeilig umbricht. */}
              <div className="mt-4 min-h-[7rem]">
                <h3 className="text-lg font-semibold tracking-[-0.02em] text-foreground">
                  {paket.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {paket.kurz}
                </p>
              </div>

              <div className="mt-6">
                <p className="whitespace-nowrap text-3xl font-semibold tracking-[-0.03em] text-foreground">
                  {paket.preis}
                </p>
                <p className="mt-2 min-h-[3.25rem] text-xs leading-snug text-muted-foreground">
                  {paket.zusatz.map((zeile) => (
                    <span key={zeile} className="block">
                      {zeile}
                    </span>
                  ))}
                </p>
              </div>

              <Button
                asChild
                className={
                  paket.hervorgehoben
                    ? "mt-6 h-11 w-full rounded-full text-sm font-semibold"
                    : "mt-6 h-11 w-full rounded-full bg-foreground text-sm font-semibold text-background hover:bg-foreground/90"
                }
              >
                <Link href={paket.href}>{paket.cta}</Link>
              </Button>

              <ul className="mt-6 flex flex-col gap-3 border-t border-border pt-6">
                {paket.leistungen.map((leistung) => (
                  <li key={leistung} className="flex gap-2.5">
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <span className="text-sm leading-relaxed text-muted-foreground">
                      {leistung}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <p className="mt-8 max-w-[80ch] text-sm leading-relaxed text-muted-foreground">
          Beauftragen Sie innerhalb von 30 Tagen die Gutachterliche
          Stellungnahme, werden die 149 € der Erst-Einschätzung vollständig
          angerechnet. Bei strittigen Beträgen unter rund 3.000 € rate ich von
          den größeren Paketen in der Regel ab – den Hinweis bekommen Sie von
          mir, bevor Sie etwas bezahlen. Die Deckungsprüfung ist in der
          Vertieften Prüfung bereits enthalten.
        </p>
      </div>
    </section>
  );
}
