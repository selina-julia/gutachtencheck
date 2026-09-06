import type { Metadata } from "next";
import Link from "next/link";
import { FileText, Inbox } from "lucide-react";

import { ladeAuftraege } from "@/lib/admin";
import { verlangeInhaber } from "@/lib/auth";
import { AbmeldeKnopf } from "./abmelde-knopf";

export const metadata: Metadata = {
  title: "Aufträge",
  robots: { index: false, follow: false },
};

function datum(wert: string): string {
  return new Date(wert).toLocaleDateString("de-AT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function euro(cent: number | null): string {
  if (cent === null) return "—";
  return (cent / 100).toLocaleString("de-AT", {
    style: "currency",
    currency: "EUR",
  });
}

export default async function AdminSeite() {
  const inhaber = await verlangeInhaber();
  const auftraege = await ladeAuftraege();

  return (
    <div className="mx-auto max-w-[1100px] px-5 py-10 sm:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.03em] text-foreground">
            Aufträge
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Angemeldet als {inhaber.email}
          </p>
        </div>
        <AbmeldeKnopf />
      </div>

      {auftraege.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-border p-10 text-center">
          <Inbox className="mx-auto size-7 text-muted-foreground" aria-hidden="true" />
          <p className="mt-3 text-sm text-muted-foreground">
            Noch keine Aufträge.
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[46rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="py-3 pr-4 font-medium">Datum</th>
                <th className="py-3 pr-4 font-medium">Kundin oder Kunde</th>
                <th className="py-3 pr-4 font-medium">Betrag</th>
                <th className="py-3 pr-4 font-medium">Unterlagen</th>
                <th className="py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {auftraege.map((auftrag) => (
                <tr key={auftrag.sessionId} className="border-b border-border">
                  <td className="py-4 pr-4 whitespace-nowrap text-muted-foreground">
                    {datum(auftrag.angelegtAm)}
                  </td>
                  <td className="py-4 pr-4 text-foreground">
                    {auftrag.email ?? "—"}
                  </td>
                  <td className="py-4 pr-4 whitespace-nowrap text-muted-foreground">
                    {euro(auftrag.betragInCent)}
                  </td>
                  <td className="py-4 pr-4 whitespace-nowrap">
                    {auftrag.unterlagenAm ? (
                      <span className="inline-flex items-center gap-1.5 text-foreground">
                        <FileText className="size-3.5 text-secondary" aria-hidden="true" />
                        übermittelt
                      </span>
                    ) : (
                      <span className="text-muted-foreground">ausstehend</span>
                    )}
                  </td>
                  <td className="py-4 text-right">
                    <Link
                      href={`/admin/${auftrag.sessionId}`}
                      className="rounded-sm text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                    >
                      Öffnen
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
