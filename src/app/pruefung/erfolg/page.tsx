import type { Metadata } from "next";
import Link from "next/link";
import { CircleCheck } from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getStripe } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Zahlung bestätigt",
  robots: { index: false },
};

export default async function ErfolgSeite({
  searchParams,
}: PageProps<"/pruefung/erfolg">) {
  const { session_id: sessionId } = await searchParams;

  let bezahlt = false;
  let email: string | null = null;

  if (typeof sessionId === "string") {
    try {
      const session = await getStripe().checkout.sessions.retrieve(sessionId);
      bezahlt = session.payment_status === "paid";
      email = session.customer_details?.email ?? null;
    } catch {
      // Ungültige oder abgelaufene Session-ID: unten wird der neutrale
      // Hinweis ausgegeben statt einer Bestätigung, die nicht stimmt.
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-background">
          <div className="mx-auto max-w-[1520px] px-5 py-16 sm:px-8 sm:py-24">
            <div className="max-w-[60ch]">
              {bezahlt ? (
                <>
                  <CircleCheck
                    className="size-10 text-secondary"
                    aria-hidden="true"
                  />
                  <h1 className="mt-6 text-[clamp(1.75rem,4vw,3rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-foreground">
                    Zahlung eingegangen,{" "}
                    <span className="ml-[0.04em] font-serif font-semibold italic text-brand-navy">
                      vielen Dank
                    </span>
                  </h1>
                  <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                    Ihre Rechnung geht
                    {email ? (
                      <>
                        {" "}
                        an <span className="text-foreground">{email}</span>
                      </>
                    ) : (
                      " an die angegebene Adresse"
                    )}
                    . In derselben E-Mail finden Sie den Link, über den Sie Ihr
                    Gutachten und die zugehörigen Unterlagen hochladen. Die
                    Frist von drei Werktagen beginnt, sobald die Unterlagen
                    vollständig vorliegen.
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-[clamp(1.75rem,4vw,3rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-foreground">
                    Zahlung wird noch{" "}
                    <span className="ml-[0.04em] font-serif font-semibold italic text-brand-navy">
                      bestätigt
                    </span>
                  </h1>
                  <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                    Zu diesem Vorgang liegt noch keine bestätigte Zahlung vor.
                    Bei einigen Zahlungsarten dauert die Bestätigung einen
                    Moment. Sobald sie eingelangt ist, erhalten Sie die
                    Rechnung und den Upload-Link per E-Mail.
                  </p>
                </>
              )}

              <Link
                href="/"
                className="mt-10 inline-block rounded-sm text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                Zurück zur Startseite
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
