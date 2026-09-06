"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sendeAnmeldelink, type AnmeldeZustand } from "./actions";

const ANFANG: AnmeldeZustand = { art: "leer" };

export function AnmeldeFormular() {
  const [zustand, formAction, laeuft] = useActionState(
    sendeAnmeldelink,
    ANFANG,
  );

  if (zustand.art === "gesendet") {
    return (
      <p className="mt-8 rounded-lg border border-border p-4 text-sm leading-relaxed text-muted-foreground">
        Wenn für <span className="text-foreground">{zustand.an}</span> ein Zugang
        besteht, ist der Anmeldelink unterwegs. Prüfen Sie auch den Spam-Ordner.
      </p>
    );
  }

  return (
    <form action={formAction} className="mt-8">
      <Label htmlFor="email">E-Mail-Adresse</Label>
      <Input
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        required
        className="mt-2"
        placeholder="name@beispiel.at"
      />

      {zustand.art === "fehler" ? (
        <p role="alert" className="mt-3 text-sm font-medium text-destructive">
          {zustand.meldung}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={laeuft}
        className="mt-6 h-12 w-full rounded-full text-sm font-semibold"
      >
        {laeuft ? "Wird gesendet …" : "Anmeldelink anfordern"}
      </Button>
    </form>
  );
}
