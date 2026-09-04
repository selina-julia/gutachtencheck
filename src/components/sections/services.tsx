import Link from "next/link";
import { ArrowDown, FileText, Gauge, Layers, ShieldCheck } from "lucide-react";

import { DuotoneImage } from "@/components/duotone-image";
import { Button } from "@/components/ui/button";

const leistungen = [
  {
    icon: Gauge,
    label: "Erst-Einschätzung",
    beschreibung:
      "Ampelbewertung Ihres Gutachtens, drei bis fünf konkret benannte Auffälligkeiten und eine Empfehlung zum weiteren Vorgehen.",
    hervorgehoben: true,
  },
  {
    icon: FileText,
    label: "Gutachterliche Stellungnahme",
    beschreibung:
      "Positionsprüfung, Bewertungsmethodik, beziffertes Ergebnis und ein Formulierungsvorschlag für Ihr Schreiben an die Versicherung.",
    hervorgehoben: false,
  },
  {
    icon: Layers,
    label: "Vertiefte Prüfung",
    beschreibung:
      "Für große und gewerbliche Schäden: mehrere Gutachten im Vergleich, Unterversicherung, Betriebsunterbrechung, Videobesprechung.",
    hervorgehoben: false,
  },
  {
    icon: ShieldCheck,
    label: "Deckungsprüfung",
    beschreibung:
      "Wenn die Versicherung ganz oder teilweise ablehnt: Prüfung der technischen Voraussetzungen, an die Ihr Bedingungswerk die Deckung knüpft.",
    hervorgehoben: false,
  },
];

export function Services() {
  return (
    <section
      id="leistungen"
      className="scroll-mt-24 bg-background"
    >
      <div className="mx-auto max-w-[1520px] px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-y-8 lg:grid-cols-2 lg:items-start lg:gap-x-20">
          <h2 className="text-[clamp(1.75rem,3.4vw,3rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-foreground">
            Vier Wege,
            <br />
            <span className="font-serif font-semibold italic text-brand-navy">
              Ihnen zu helfen
            </span>
          </h2>

          <div className="max-w-[52ch]">
            <p className="text-base leading-relaxed text-muted-foreground">
              Ob Sie nur ein ungutes Gefühl haben oder bereits ein
              Ablehnungsschreiben in der Hand halten - für jede dieser Lagen
              gibt es eine Prüfung im passenden Umfang.
            </p>

            <Button
              asChild
              className="mt-6 h-12 w-full rounded-full border border-border bg-background py-0 pl-6 pr-2 text-sm font-semibold text-foreground hover:bg-muted sm:w-auto"
            >
              <Link href="#ablauf">
                So funktioniert&rsquo;s
                <span className="ml-3 flex size-8 items-center justify-center rounded-full bg-brand-tint">
                  <ArrowDown
                    className="size-4 text-primary"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:gap-8 xl:mt-16">
          <DuotoneImage
            className="h-full min-h-[20rem] rounded-2xl bg-brand-tint lg:min-h-0"
            src="/images/services.png"
            alt="Sachverständiger bespricht ein Gutachten mit einer Kundin."
            width={1536}
            height={1024}
            sizes="(min-width: 1024px) 672px, 100vw"
          />

          <ul className="grid gap-6 sm:grid-cols-2 lg:gap-8">
            {leistungen.map((leistung) => {
              const Icon = leistung.icon;
              return (
                <li
                  key={leistung.label}
                  className={
                    leistung.hervorgehoben
                      ? "flex flex-col rounded-2xl bg-brand-navy p-6 text-primary-foreground"
                      : "flex flex-col rounded-2xl border border-border bg-background p-6"
                  }
                >
                  <span
                    className={
                      leistung.hervorgehoben
                        ? "flex size-11 items-center justify-center rounded-xl bg-primary-foreground/15"
                        : "flex size-11 items-center justify-center rounded-xl bg-brand-tint"
                    }
                  >
                    <Icon
                      className={
                        leistung.hervorgehoben
                          ? "size-5 text-primary-foreground"
                          : "size-5 text-primary"
                      }
                      aria-hidden="true"
                    />
                  </span>

                  <h3 className="mt-5 text-base font-semibold tracking-[-0.01em]">
                    {leistung.label}
                  </h3>
                  <p
                    className={
                      leistung.hervorgehoben
                        ? "mt-2 text-sm leading-relaxed text-primary-foreground/85"
                        : "mt-2 text-sm leading-relaxed text-muted-foreground"
                    }
                  >
                    {leistung.beschreibung}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
