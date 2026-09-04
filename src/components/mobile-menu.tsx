"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { hauptnavigation } from "@/lib/navigation";

/**
 * Springt zur Sprungmarke, sobald die Scroll-Sperre des Panels aufgehoben ist.
 * Solange das Panel offen ist, liegt der Body auf `overflow: hidden` bzw.
 * `position: fixed`, ein Sprung dorthin verpufft also.
 *
 * Der Fokus wandert anschließend auf den Zielabschnitt. Das ist nicht nur für
 * die Tastaturbedienung richtig, sondern nötig: Radix gibt den Fokus beim
 * Schließen sonst an den Menü-Button zurück, und der Browser scrollt dabei
 * wieder ganz nach oben.
 */
function springeZuMarke(auswahl: string) {
  const start = performance.now();

  const versuchen = () => {
    const stil = getComputedStyle(document.body);
    const gesperrt = stil.overflow === "hidden" || stil.position === "fixed";

    if (gesperrt && performance.now() - start < 1500) {
      requestAnimationFrame(versuchen);
      return;
    }

    const ziel = document.querySelector(auswahl);
    if (!ziel) return;

    const ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    ziel.scrollIntoView({ behavior: ruhig ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", auswahl);

    if (ziel instanceof HTMLElement) {
      ziel.setAttribute("tabindex", "-1");
      ziel.focus({ preventScroll: true });
      ziel.addEventListener("blur", () => ziel.removeAttribute("tabindex"), {
        once: true,
      });
    }
  };

  requestAnimationFrame(versuchen);
}

export function MobileMenu() {
  const [offen, setOffen] = useState(false);
  const springt = useRef(false);

  function beiKlick(event: React.MouseEvent, href: string) {
    setOffen(false);
    if (!href.startsWith("#")) return;

    event.preventDefault();
    springt.current = true;
    springeZuMarke(href);
  }

  return (
    <Sheet open={offen} onOpenChange={setOffen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Menü öffnen"
          className="-mr-2 flex size-10 shrink-0 items-center justify-center rounded-sm text-foreground/75 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring lg:hidden"
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        showCloseButton={false}
        className="p-5"
        onCloseAutoFocus={(event) => {
          // Sonst holt Radix den Fokus zurück auf den Menü-Button und der
          // Browser scrollt den gerade angesprungenen Abschnitt wieder weg.
          if (springt.current) {
            springt.current = false;
            event.preventDefault();
          }
        }}
      >
        <SheetHeader className="flex-row items-center justify-between gap-4 p-0">
          <SheetTitle className="text-xl font-bold tracking-[-0.03em] text-foreground">
            Gutachtencheck<span className="text-primary">.</span>
          </SheetTitle>
          <SheetClose asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="shrink-0 rounded-full bg-muted hover:bg-muted/80"
            >
              <X aria-hidden="true" />
              <span className="sr-only">Menü schließen</span>
            </Button>
          </SheetClose>
        </SheetHeader>

        <nav
          aria-label="Hauptnavigation"
          className="flex flex-col overflow-y-auto"
        >
          {hauptnavigation.map((punkt) => (
            <Link
              key={punkt.href}
              href={punkt.href}
              onClick={(event) => beiKlick(event, punkt.href)}
              className="border-b border-border py-4 text-base text-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {punkt.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
