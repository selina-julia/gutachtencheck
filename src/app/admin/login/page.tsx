import type { Metadata } from "next";

import { AnmeldeFormular } from "./anmelde-formular";

export const metadata: Metadata = {
  title: "Anmeldung",
  robots: { index: false, follow: false },
};

export default async function AnmeldeSeite({
  searchParams,
}: PageProps<"/admin/login">) {
  const { fehler } = await searchParams;

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-[26rem] flex-col justify-center px-5 py-16">
      <h1 className="text-2xl font-semibold tracking-[-0.03em] text-foreground">
        Anmeldung
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Sie erhalten einen Anmeldelink per E-Mail. Er ist einmalig gültig und
        läuft nach kurzer Zeit ab.
      </p>

      {fehler ? (
        <p
          role="alert"
          className="mt-6 rounded-lg border border-border bg-muted px-4 py-3 text-sm text-foreground"
        >
          Der Link war ungültig oder abgelaufen. Bitte fordern Sie einen neuen an.
        </p>
      ) : null}

      <AnmeldeFormular />
    </div>
  );
}
