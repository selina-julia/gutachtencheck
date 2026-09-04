"use client";

import { useActionState, useState } from "react";
import { Check, X } from "lucide-react";

import { bestellen, type BestellFehler } from "@/app/actions/bestellen";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@/components/ui/responsive-dialog";
import { Label } from "@/components/ui/label";
import { produkte } from "@/lib/produkte";

const anfangszustand: BestellFehler = undefined;

const enthalten = [
  "Schriftliche Kurzbewertung mit klarer Ampel-Aussage",
  "Drei bis fünf konkret benannte Auffälligkeiten",
  "Empfehlung zum weiteren Vorgehen",
];

export function BestellDialog({
  children,
}: {
  /** Auslöser des Dialogs, etwa ein Button aus der Preiskarte. */
  children: React.ReactNode;
}) {
  const [offen, setOffen] = useState(false);
  const [zustand, formAction, laeuft] = useActionState(
    bestellen,
    anfangszustand,
  );
  const produkt = produkte["erst-einschaetzung"];

  return (
    <ResponsiveDialog open={offen} onOpenChange={setOffen}>
      <ResponsiveDialogTrigger asChild>{children}</ResponsiveDialogTrigger>
      <ResponsiveDialogContent showCloseButton={false} className="sm:max-w-xl">
        <ResponsiveDialogHeader>
          <div className="flex items-start justify-between gap-4">
            <ResponsiveDialogTitle className="text-xl tracking-[-0.02em]">
              {produkt.name} kaufen
            </ResponsiveDialogTitle>
            <ResponsiveDialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="-mt-1 shrink-0 rounded-full bg-muted hover:bg-muted/80"
              >
                <X aria-hidden="true" />
                <span className="sr-only">Dialog schließen</span>
              </Button>
            </ResponsiveDialogClose>
          </div>
          <ResponsiveDialogDescription className="text-foreground">
            Sichtung Ihres Gutachtens durch einen allgemein beeideten und
            gerichtlich zertifizierten Sachverständigen.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <Card>
          <CardContent>
            <p className="text-2xl font-semibold tracking-[-0.03em] text-foreground">
              {(produkt.betragInCent / 100).toLocaleString("de-AT", {
                style: "currency",
                currency: "EUR",
              })}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              inkl. USt · {produkt.lieferhinweis}
            </p>
          </CardContent>
          <CardFooter className="border-t bg-background [.border-t]:pt-4">
            <ul className="flex w-full flex-col gap-2">
              {enthalten.map((punkt) => (
                <li key={punkt} className="flex gap-2.5">
                  <Check
                    className="mt-0.5 size-4 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <span className="text-sm leading-relaxed text-foreground">
                    {punkt}
                  </span>
                </li>
              ))}
            </ul>
          </CardFooter>
        </Card>

        <form action={formAction}>
          <fieldset className="flex flex-col gap-4">
            <legend className="sr-only">Zustimmungen</legend>

            <div className="flex items-start gap-3">
              <Checkbox
                id="agb"
                name="agb"
                aria-required="true"
                className="mt-0.5 border-muted-foreground"
              />
              <Label
                htmlFor="agb"
                className="text-sm leading-relaxed font-normal text-foreground"
              >
                <span>
                  Ich habe die{" "}
                  <a
                    href="/agb"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground underline underline-offset-2"
                  >
                    AGB
                  </a>{" "}
                  und die{" "}
                  <a
                    href="/datenschutz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground underline underline-offset-2"
                  >
                    Datenschutzerklärung
                  </a>{" "}
                  gelesen und stimme ihnen zu.
                  <span aria-hidden="true" className="ml-0.5 text-destructive">
                    *
                  </span>
                </span>
              </Label>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="fagg"
                name="fagg"
                aria-required="true"
                className="mt-0.5 border-muted-foreground"
              />
              <Label
                htmlFor="fagg"
                className="text-sm leading-relaxed font-normal text-foreground"
              >
                <span>
                  Ich verlange ausdrücklich, dass mit der Prüfung vor Ablauf der
                  14-tägigen Rücktrittsfrist begonnen wird, und weiß, dass ich
                  mein Rücktrittsrecht mit vollständiger Erbringung verliere.
                  <span aria-hidden="true" className="ml-0.5 text-destructive">
                    *
                  </span>
                </span>
              </Label>
            </div>
          </fieldset>

          {zustand?.fehler ? (
            <p role="alert" className="mt-4 text-sm font-medium text-destructive">
              {zustand.fehler}
            </p>
          ) : null}

          <p className="mt-5 text-xs leading-relaxed text-foreground">
            <span aria-hidden="true" className="text-destructive">*</span>{" "}
            Beides ist gesetzlich erforderlich, bevor die Bearbeitung beginnen
            darf. Die Zahlung wird über Stripe abgewickelt. Nach dem Zahlungseingang
            erhalten Sie Rechnung und Upload-Link per E-Mail.
          </p>

          <ResponsiveDialogFooter className="mt-6 bg-background">
            <ResponsiveDialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-full px-6 text-sm font-semibold"
              >
                Abbrechen
              </Button>
            </ResponsiveDialogClose>
            <Button
              type="submit"
              disabled={laeuft}
              className="h-11 rounded-full px-6 text-sm font-semibold"
            >
              {laeuft ? "Weiterleitung zu Stripe …" : "Weiter zur Zahlung"}
            </Button>
          </ResponsiveDialogFooter>
        </form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
