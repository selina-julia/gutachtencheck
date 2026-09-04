"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Beobachtet eine Media Query. Auf dem Server gibt es kein `window`, deshalb
 * liefert der Server-Snapshot immer `false` — gerendert wird dort also die
 * Mobil-Variante, und nach der Hydration übernimmt der echte Wert.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (aendere: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", aendere);
      return () => mql.removeEventListener("change", aendere);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
