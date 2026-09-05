"use client";

import { Check, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

export const SCHRITTE = ["Unterlagen", "Schilderung", "Bestätigen"] as const;

/**
 * Kopfleiste des Uploads. Linksbündig statt zentriert, damit sie als Leiste
 * über der Arbeitsfläche liest und nicht als eigenes Element mitten im Bild.
 */
export function Schrittanzeige({ aktiv }: { aktiv: number }) {
  return (
    <ol className="flex flex-wrap items-center gap-y-2">
      {SCHRITTE.map((name, index) => {
        const erledigt = index < aktiv;
        const laufend = index === aktiv;

        return (
          <li key={name} className="flex items-center">
            <span
              className="flex items-center gap-2"
              aria-current={laufend ? "step" : undefined}
            >
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                  erledigt && "bg-brand-tint text-primary",
                  laufend && "bg-primary text-primary-foreground",
                  !erledigt && !laufend && "bg-muted text-muted-foreground",
                )}
              >
                {erledigt ? (
                  <Check className="size-3.5" aria-hidden="true" />
                ) : (
                  index + 1
                )}
              </span>
              <span
                className={cn(
                  "text-sm",
                  laufend
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {name}
              </span>
            </span>

            {index < SCHRITTE.length - 1 ? (
              <ChevronRight
                aria-hidden="true"
                className="mx-3 size-4 shrink-0 text-muted-foreground/50"
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
