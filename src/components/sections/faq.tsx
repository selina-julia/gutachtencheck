import { Minus, Plus } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { fragen } from "@/lib/faq";

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-24 bg-background">
      <div className="mx-auto grid max-w-[1520px] gap-y-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-x-20">
        <h2 className="text-[clamp(1.75rem,3.4vw,3rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-foreground">
          Antworten zur
          <br />
          <span className="font-serif font-semibold italic text-brand-navy">
            Gutachtenprüfung
          </span>
        </h2>

        <Accordion
          type="single"
          collapsible
          defaultValue="frage-0"
          className="border-t border-border"
        >
          {fragen.map((eintrag, index) => (
            <AccordionItem
              key={eintrag.frage}
              value={`frage-${index}`}
              className="border-b border-border"
            >
              <AccordionTrigger className="items-center gap-4 py-6 hover:no-underline [&_[data-slot=accordion-trigger-icon]]:hidden">
                <span className="w-8 shrink-0 text-xs font-medium text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 text-base font-medium text-foreground sm:text-lg">
                  {eintrag.frage}
                </span>
                <span className="ml-4 flex size-9 shrink-0 items-center justify-center rounded-full border border-border text-foreground">
                  <Plus
                    className="size-4 group-aria-expanded/accordion-trigger:hidden"
                    aria-hidden="true"
                  />
                  <Minus
                    className="hidden size-4 group-aria-expanded/accordion-trigger:block"
                    aria-hidden="true"
                  />
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-6 sm:pl-12">
                <p className="max-w-[80ch] text-sm leading-relaxed text-muted-foreground">
                  {eintrag.antwort}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
