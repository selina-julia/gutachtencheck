import type { Metadata } from "next";
import Link from "next/link";
import { CircleCheck, TriangleAlert } from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { UploadFormular } from "@/components/upload-formular";
import {
  ladeBezahltenVorgang,
  ladeDateien,
  registriereVorgang,
} from "@/lib/vorgang";

export const metadata: Metadata = {
  title: "Unterlagen hochladen",
  robots: { index: false },
};

function megabyte(byte: number): string {
  return `${(byte / 1024 / 1024).toLocaleString("de-AT", { maximumFractionDigits: 1 })} MB`;
}

export default async function UploadSeite({
  params,
}: PageProps<"/upload/[session]">) {
  const { session } = await params;
  const vorgang = await ladeBezahltenVorgang(session);

  // Auch hier registrieren, nicht nur im Webhook: lokal läuft oft kein
  // `stripe listen`, und ohne Eintrag wäre der Upload gesperrt.
  if (vorgang) await registriereVorgang(vorgang.sessionId);

  const dateien = vorgang ? await ladeDateien(session) : [];

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-background">
          <div className="mx-auto max-w-[1520px] px-5 py-12 sm:px-8 sm:py-16">
            {!vorgang ? (
              <div className="max-w-[60ch]">
                <TriangleAlert className="size-8 text-muted-foreground" aria-hidden="true" />
                <h1 className="mt-6 text-[clamp(1.75rem,4vw,3rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-foreground">
                  Dieser Link ist nicht{" "}
                  <span className="ml-[0.04em] font-serif font-semibold italic text-brand-navy">
                    gültig
                  </span>
                </h1>
                <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                  Zu diesem Link liegt keine bezahlte Bestellung vor. Bitte
                  öffnen Sie den Link aus Ihrer Bestätigungsmail. Wenn Sie ihn
                  nicht finden, melden Sie sich bei mir — dann schicke ich ihn
                  Ihnen erneut.
                </p>
                <Link
                  href="/kontakt"
                  className="mt-8 inline-block rounded-sm text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
                >
                  Kontakt aufnehmen
                </Link>
              </div>
            ) : (
              <div className="grid gap-y-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:gap-x-20">
                <div>
                  <h1 className="max-w-[20ch] text-[clamp(1.75rem,4vw,3rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-foreground">
                    Ihre Unterlagen{" "}
                    <span className="ml-[0.04em] font-serif font-semibold italic text-brand-navy">
                      hochladen
                    </span>
                  </h1>
                  <p className="mt-6 max-w-[58ch] text-base leading-relaxed text-muted-foreground">
                    Die Übertragung ist verschlüsselt, die Dateien liegen auf
                    Servern in der EU und sind für niemanden außer mir
                    zugänglich. Die Bearbeitungszeit beginnt, sobald alles
                    vollständig vorliegt.
                  </p>

                  <div className="mt-10">
                    <UploadFormular
                      sessionId={vorgang.sessionId}
                      hatBereitsDateien={dateien.length > 0}
                    />
                  </div>
                </div>

                <aside className="rounded-2xl border border-border p-6 lg:sticky lg:top-8 lg:self-start">
                  <h2 className="text-base font-semibold text-foreground">
                    Was ich brauche
                  </h2>
                  <ul className="mt-4 flex flex-col gap-3">
                    {[
                      "Das Gutachten der Versicherung als PDF",
                      "Eine kurze Schilderung des Schadens in wenigen Sätzen",
                    ].map((punkt) => (
                      <li key={punkt} className="flex gap-2.5">
                        <CircleCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                        <span className="text-sm leading-relaxed text-muted-foreground">
                          {punkt}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {dateien.length > 0 ? (
                    <div className="mt-6 border-t border-border pt-6">
                      <h2 className="text-base font-semibold text-foreground">
                        Bereits übermittelt
                      </h2>
                      <ul className="mt-4 flex flex-col gap-2">
                        {dateien.map((datei) => (
                          <li key={datei.name} className="text-sm text-muted-foreground">
                            <span className="block truncate text-foreground">
                              {datei.name}
                            </span>
                            {megabyte(datei.groesseInByte)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </aside>
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
