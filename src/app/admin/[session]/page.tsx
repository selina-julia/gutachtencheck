import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download } from "lucide-react";

import { ladeAuftrag, ladeDateienMitLinks } from "@/lib/admin";
import { verlangeInhaber } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Auftrag",
  robots: { index: false, follow: false },
};

function zeitpunkt(wert: string | null): string {
  if (!wert) return "—";
  return new Date(wert).toLocaleString("de-AT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function megabyte(byte: number): string {
  return `${(byte / 1024 / 1024).toLocaleString("de-AT", { maximumFractionDigits: 1 })} MB`;
}

export default async function AuftragSeite({
  params,
}: PageProps<"/admin/[session]">) {
  await verlangeInhaber();

  const { session } = await params;
  const auftrag = await ladeAuftrag(session);
  if (!auftrag) notFound();

  const dateien = await ladeDateienMitLinks(session);

  return (
    <div className="mx-auto max-w-[1100px] px-5 py-10 sm:px-8">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 rounded-sm text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Alle Aufträge
      </Link>

      <h1 className="mt-6 text-2xl font-semibold tracking-[-0.03em] text-foreground">
        {auftrag.email ?? "Auftrag"}
      </h1>

      <dl className="mt-6 grid gap-x-8 gap-y-4 text-sm sm:grid-cols-2">
        {[
          ["Eingegangen", zeitpunkt(auftrag.angelegtAm)],
          [
            "Betrag",
            auftrag.betragInCent === null
              ? "—"
              : (auftrag.betragInCent / 100).toLocaleString("de-AT", {
                  style: "currency",
                  currency: "EUR",
                }),
          ],
          ["Unterlagen übermittelt", zeitpunkt(auftrag.unterlagenAm)],
          ["Vorgang", auftrag.sessionId],
        ].map(([bezeichnung, wert]) => (
          <div key={bezeichnung}>
            <dt className="text-muted-foreground">{bezeichnung}</dt>
            <dd className="mt-0.5 break-all text-foreground">{wert}</dd>
          </div>
        ))}
      </dl>

      <section className="mt-10">
        <h2 className="text-base font-semibold text-foreground">
          Schilderung des Schadens
        </h2>
        <p className="mt-3 max-w-[70ch] text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
          {auftrag.schilderung ?? "Noch keine Schilderung übermittelt."}
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-base font-semibold text-foreground">Unterlagen</h2>

        {dateien.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Noch keine Dateien übermittelt.
          </p>
        ) : (
          <ul className="mt-4 flex flex-col divide-y divide-border border-y border-border">
            {dateien.map((datei) => (
              <li
                key={datei.name}
                className="flex flex-wrap items-center justify-between gap-3 py-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm text-foreground">{datei.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {megabyte(datei.groesseInByte)} · {zeitpunkt(datei.hochgeladenAm)}
                  </p>
                </div>
                {datei.url ? (
                  <a
                    href={datei.url}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-sm text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                  >
                    <Download className="size-4" aria-hidden="true" />
                    Herunterladen
                  </a>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Link nicht verfügbar
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}

        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          Die Downloadlinks gelten fünfzehn Minuten und werden beim Aufruf dieser
          Seite neu erzeugt. Sie geben ohne Anmeldung Zugriff — bitte nicht
          weiterleiten.
        </p>
      </section>
    </div>
  );
}
