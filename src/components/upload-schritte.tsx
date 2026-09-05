"use client";

import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export const SCHRITTE = ["Unterlagen", "Schilderung", "Bestätigen"] as const;

export function Schrittanzeige({ aktiv }: { aktiv: number }) {
  return (
    <ol className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
      {SCHRITTE.map((name, index) => {
        const erledigt = index < aktiv;
        const laufend = index === aktiv;

        return (
          <li key={name} className="flex items-center gap-3">
            <span
              className="flex items-center gap-2"
              aria-current={laufend ? "step" : undefined}
            >
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                  erledigt && "bg-primary text-primary-foreground",
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
                  laufend ? "font-semibold text-foreground" : "text-muted-foreground",
                )}
              >
                {name}
              </span>
            </span>

            {index < SCHRITTE.length - 1 ? (
              <span
                aria-hidden="true"
                className={cn(
                  "hidden h-px w-8 sm:block",
                  erledigt ? "bg-primary" : "bg-border",
                )}
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
