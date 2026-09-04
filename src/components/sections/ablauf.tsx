import { ArrowUpRight, Check, FileText } from "lucide-react";

import { BestellDialog } from "@/components/bestell-dialog";
import { Button } from "@/components/ui/button";

/**
 * Die drei Illustrationen sind bewusst reines Markup statt Bilddateien: Sie
 * zeigen Ausschnitte der Leistung selbst, skalieren mit der Schriftgröße und
 * bleiben bei einer Textänderung automatisch aktuell.
 */

function BildUpload() {
  return (
    <div aria-hidden="true" className="flex h-full items-center justify-center">
      <div className="relative w-52">
        {/* Zweites Blatt, das oben hervorschaut – deutet den Stapel an, den
            Kundinnen und Kunden tatsächlich hochladen, ohne die Karte zu
            kippen. */}
        <div className="absolute inset-x-4 -top-3 h-12 rounded-xl border border-border bg-background/60" />

        <div className="relative rounded-xl border border-border bg-background p-4 shadow-md">
          <div className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-tint">
              <FileText className="size-4 text-primary" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-foreground">
                Gutachten.pdf
              </p>
              <p className="text-[0.6875rem] text-muted-foreground">2,4 MB</p>
            </div>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-4/5 rounded-full bg-primary" />
          </div>
        </div>
      </div>
    </div>
  );
}

const positionen = [
  { label: "Mengen & Massen", versatz: "ml-0" },
  { label: "Einheitspreise", versatz: "ml-6" },
  { label: "Neuwert / Zeitwert", versatz: "ml-3" },
  { label: "ÖNORM-Abgleich", versatz: "ml-9" },
];

function BildPruefung() {
  return (
    <div
      aria-hidden="true"
      className="flex h-full flex-col justify-center gap-2"
    >
      {positionen.map((position, index) => (
        <div
          key={position.label}
          className={`flex w-fit items-center gap-2.5 rounded-lg border border-border bg-background py-1.5 pl-2 pr-3 shadow-sm ${position.versatz}`}
        >
          <span className="flex size-5 items-center justify-center rounded-md bg-brand-tint">
            <Check className="size-3 text-primary" />
          </span>
          <span className="whitespace-nowrap text-xs font-medium text-foreground">
            {position.label}
          </span>
          <span className="text-xs tabular-nums text-muted-foreground">
            {index + 1}
          </span>
        </div>
      ))}
    </div>
  );
}

function BildErgebnis() {
  return (
    <div aria-hidden="true" className="flex h-full items-center justify-center">
      <div className="w-56 rounded-xl border border-border bg-background p-4 shadow-md">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-foreground">
            Kurzbewertung
          </p>
          {/* Ampel. Gelb hat keinen Marken-Token, weil es sonst nirgends
              vorkommt – hier steht es für das Ergebnis, nicht für die Marke. */}
          <div className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-destructive/25" />
            <span className="size-2.5 rounded-full bg-[oklch(0.79_0.15_84)]" />
            <span className="size-2 rounded-full bg-secondary/25" />
          </div>
        </div>

        <div className="mt-3 space-y-1.5">
          <div className="h-2 w-full rounded-full bg-muted" />
          <div className="h-2 w-11/12 rounded-full bg-muted" />
          <div className="h-2 w-3/5 rounded-full bg-muted" />
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
          <span className="text-[0.6875rem] text-muted-foreground">
            Auffälligkeiten
          </span>
          <span className="rounded-full bg-brand-tint px-2 py-0.5 text-[0.6875rem] font-semibold text-primary">
            4 benannt
          </span>
        </div>
      </div>
    </div>
  );
}

const schritte = [
  {
    label: "Schritt 1",
    titel: "Unterlagen hochladen",
    text: "Für die Erst-Einschätzung genügen das Gutachten der Versicherung als PDF und eine kurze Schilderung des Schadens. Verschlüsselt, DSGVO-konform, auch direkt vom Handy.",
    Bild: BildUpload,
  },
  {
    label: "Schritt 2",
    titel: "Prüfung durch den Sachverständigen",
    text: "Ich sichte das Gutachten persönlich – als allgemein beeideter und gerichtlich zertifizierter Sachverständiger. Geprüft wird, was sich aus den Unterlagen fachlich ableiten lässt.",
    Bild: BildPruefung,
  },
  {
    label: "Schritt 3",
    titel: "Ergebnis in drei Werktagen",
    text: "Sie erhalten eine schriftliche Kurzbewertung mit klarer Ampel-Aussage, drei bis fünf konkret benannte Auffälligkeiten und eine Empfehlung zum weiteren Vorgehen.",
    Bild: BildErgebnis,
  },
];

export function Ablauf() {
  return (
    <section id="ablauf" className="scroll-mt-24 bg-background">
      <div className="mx-auto max-w-[1520px] px-5 py-16 sm:px-8 sm:py-24">
        {/* Der Tint sitzt im Container, nicht in der Section – gleiche Kante
            wie das Bild unter dem Hero und der CTA-Banner. */}
        <div className="rounded-3xl bg-brand-tint/50 px-6 py-14 sm:px-10 sm:py-16">
          <div className="grid gap-y-8 lg:grid-cols-2 lg:items-start lg:gap-x-20">
            <h2 className="text-[clamp(1.75rem,3.4vw,3rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-foreground">
              Gutachten prüfen lassen
              <br />
              <span className="font-serif font-semibold italic text-brand-navy">
                in drei Schritten
              </span>
            </h2>

            <p className="max-w-[52ch] text-base leading-relaxed text-muted-foreground">
              Der ganze Vorgang läuft online und ohne Besichtigungstermin. Sie
              laden hoch, was Sie haben – alles Weitere übernehme ich. Passt Ihr
              Fall nicht zu meinem Angebot, sage ich Ihnen das offen und
              kostenfrei, bevor Sie etwas bezahlen.
            </p>
          </div>

          <ul className="mt-12 grid gap-6 md:grid-cols-3 xl:gap-8">
            {schritte.map((schritt) => {
              const Bild = schritt.Bild;
              return (
                <li
                  key={schritt.label}
                  className="flex flex-col rounded-2xl border border-border bg-background p-5"
                >
                  {/* Bühne für die Illustration: heller Grund mit weichem
                      Lichtschein, damit die weißen Karten darauf abheben. */}
                  <div className="relative isolate h-56 overflow-hidden rounded-xl bg-brand-tint px-5">
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_40%,var(--color-background)_0%,transparent_70%)]"
                    />
                    <div className="relative h-full">
                      <Bild />
                    </div>
                  </div>

                  <div className="mt-6 px-1 pb-1">
                    <p className="text-xs font-semibold tracking-[0.02em] text-primary">
                      {schritt.label}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold tracking-[-0.02em] text-foreground">
                      {schritt.titel}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {schritt.text}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>

          <BestellDialog>
            <Button className="mt-10 h-12 w-full rounded-full py-0 pl-6 pr-2 text-sm font-semibold sm:w-auto">
              Erst-Einschätzung kaufen
              <span className="ml-3 flex size-8 items-center justify-center rounded-full bg-primary-foreground">
                <ArrowUpRight className="size-4 text-primary" aria-hidden="true" />
              </span>
            </Button>
          </BestellDialog>
        </div>
      </div>
    </section>
  );
}
