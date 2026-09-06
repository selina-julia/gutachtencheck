import type { Metadata } from "next";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";

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
    <section className="h-full bg-background">
          <div className="mx-auto flex h-full max-w-[1520px] flex-col px-5 py-6 sm:px-8 sm:py-8">
            {!vorgang ? (
              <div className="mx-auto flex max-w-[52ch] flex-1 flex-col justify-center text-center">
                <TriangleAlert className="mx-auto size-8 text-muted-foreground" aria-hidden="true" />
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
              <div className="min-h-0 flex-1">
                <UploadFormular
                  sessionId={vorgang.sessionId}
                  bereitsDateien={dateien}
                />
              </div>
            )}
      </div>
    </section>
  );
}
