import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

/**
 * Rahmen für die Rechtstexte. Schmale Spalte statt der breiten Raster der
 * Startseite – Fließtext liest sich ab etwa 75 Zeichen Zeilenlänge schlecht.
 */
export function Rechtstext({
  titel,
  stand,
  children,
}: {
  titel: string;
  stand: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-[1520px] px-5 py-12 sm:px-8 sm:py-20">
          <div className="max-w-[70ch]">
            <h1 className="text-[clamp(1.75rem,3.4vw,3rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-foreground">
              {titel}
            </h1>
            <p className="mt-4 text-sm text-muted-foreground">Stand: {stand}</p>

            <div className="mt-12 flex flex-col gap-12">{children}</div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

export function Abschnitt({
  titel,
  children,
}: {
  titel: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-lg font-semibold tracking-[-0.02em] text-foreground sm:text-xl">
        {titel}
      </h2>
      <div className="mt-4 flex flex-col gap-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
        {children}
      </div>
    </section>
  );
}
