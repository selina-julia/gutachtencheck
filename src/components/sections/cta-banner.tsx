import { ArrowUpRight } from "lucide-react";

import { BestellDialog } from "@/components/bestell-dialog";
import { Button } from "@/components/ui/button";

export function CtaBanner() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-[1520px] px-5 pb-16 sm:px-8 sm:pb-24">
        <div className="relative isolate overflow-hidden rounded-3xl bg-primary px-6 py-16 text-center sm:px-10 sm:py-24">
          {/* Lichtschein rechts. Er endet bei 65 %, damit der Text durchgehend
              auf dem dunkleren Blau steht und lesbar bleibt. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_120%_at_105%_50%,var(--color-brand-light)_0%,transparent_62%)]"
          />

          <div className="relative mx-auto max-w-[52ch]">
            <h2 className="text-[clamp(1.75rem,3.6vw,3rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-primary-foreground text-balance">
              Zweifeln Sie an Ihrem Gutachten?
            </h2>
            <p className="mx-auto mt-5 max-w-[56ch] text-base leading-relaxed text-primary-foreground/85">
              Beginnen Sie mit der Erst-Einschätzung: 149 € Fixpreis, Ergebnis
              in drei Werktagen, mit klarer Ampel-Aussage. Passt Ihr Fall nicht
              zu meinem Angebot, sage ich Ihnen das offen und kostenfrei.
            </p>
            <BestellDialog>
              <Button className="mt-9 h-12 w-full rounded-full bg-background py-0 pl-6 pr-2 text-sm font-semibold text-primary hover:bg-background/90 sm:w-auto">
                Erst-Einschätzung kaufen
                <span className="ml-3 flex size-8 items-center justify-center rounded-full bg-primary">
                  <ArrowUpRight
                    className="size-4 text-primary-foreground"
                    aria-hidden="true"
                  />
                </span>
              </Button>
            </BestellDialog>
          </div>
        </div>
      </div>
    </section>
  );
}
