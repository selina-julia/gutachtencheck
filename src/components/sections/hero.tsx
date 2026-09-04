import { ArrowUpRight } from "lucide-react";

import { BestellDialog } from "@/components/bestell-dialog";
import { DuotoneImage } from "@/components/duotone-image";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="bg-background">
      <div className="relative mx-auto grid max-w-[1520px] gap-y-10 px-5 pb-12 pt-6 sm:px-8 sm:pb-16 lg:grid-cols-[minmax(0,21rem)_minmax(0,1fr)] lg:gap-x-20 lg:pt-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-12 -top-16 hidden h-[52rem] w-[46rem] bg-[radial-gradient(circle,var(--color-border)_1px,transparent_1px)] bg-[size:14px_14px] [mask-image:linear-gradient(to_bottom_right,black,transparent_72%)] lg:block"
        />

        <div className="relative lg:col-start-2 lg:row-start-1">
          <h1 className="max-w-[20ch] text-[clamp(1.625rem,4.4vw,3.5rem)] font-semibold leading-[1.1] tracking-[-0.03em] hyphens-auto text-foreground">
            Ihr Versicherungsgutachten, unabhängig{" "}
            <span className="ml-[0.04em] font-serif font-semibold italic">
              geprüft.
            </span>
          </h1>

          <p className="mt-6 max-w-[54ch] text-base leading-relaxed text-muted-foreground sm:mt-8 sm:text-lg">
            Das Gutachten, das über Ihre Entschädigung entscheidet, stammt vom
            Sachverständigen der Versicherung. Ich prüfe es – unabhängig,
            ausschließlich online und österreichweit.
          </p>

          <BestellDialog>
            <Button className="mt-8 h-12 w-full rounded-full py-0 pl-6 pr-2 text-sm font-semibold sm:w-auto">
              Erst-Einschätzung kaufen
              <span className="ml-3 flex size-8 items-center justify-center rounded-full bg-primary-foreground">
                <ArrowUpRight
                  className="size-4 text-primary"
                  aria-hidden="true"
                />
              </span>
            </Button>
          </BestellDialog>
        </div>

        <div className="relative lg:col-start-1 lg:row-start-1 lg:pt-3">
          <p className="relative max-w-[15rem] text-sm leading-relaxed text-muted-foreground">
            Allgemein beeideter und gerichtlich zertifizierter Sachverständiger
            {"\u00A0"}· seit 2009{"\u00A0"}· über 6.000 Versicherungsgutachten
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1520px] px-5 pb-14 sm:px-8 sm:pb-20">
        <DuotoneImage
          className="aspect-4/3 w-full bg-brand-tint sm:aspect-[1916/821]"
          src="/images/hero.png"
          alt="Sachverständiger prüft ein Versicherungsgutachten am Laptop."
          width={1916}
          height={821}
          priority
          sizes="(min-width: 1520px) 1456px, 100vw"
        />
      </div>
    </section>
  );
}
