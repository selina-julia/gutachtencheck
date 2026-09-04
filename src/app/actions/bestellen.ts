"use server";

import { redirect } from "next/navigation";

import { produkte } from "@/lib/produkte";
import { getSiteUrl, getStripe } from "@/lib/stripe";

export type BestellFehler = { fehler: string } | undefined;

export async function bestellen(
  _vorherigerZustand: BestellFehler,
  formData: FormData,
): Promise<BestellFehler> {
  const agb = formData.get("agb") === "on";
  const fagg = formData.get("fagg") === "on";

  // Beides ist laut Briefing zwingend und darf nicht vorausgewählt sein. Die
  // Prüfung steht hier zusätzlich zum required-Attribut, weil ein Client-
  // Attribut allein keine Zustimmung belegt.
  if (!agb || !fagg) {
    return {
      fehler:
        "Bitte bestätigen Sie beide Punkte, damit die Bearbeitung beginnen kann.",
    };
  }

  const produkt = produkte["erst-einschaetzung"];
  const zugestimmtAm = new Date().toISOString();
  const stripe = getStripe();
  const siteUrl = getSiteUrl();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    locale: "de",
    billing_address_collection: "required",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: produkt.betragInCent,
          product_data: {
            name: produkt.name,
            description: produkt.beschreibung,
          },
        },
      },
    ],
    // Protokoll der Zustimmung. Bis es eine Datenbank gibt, liegt der Nachweis
    // damit unveränderlich am Zahlungsvorgang.
    metadata: {
      produkt: produkt.id,
      agb_zugestimmt: "ja",
      fagg_vorzeitiger_beginn_zugestimmt: "ja",
      zugestimmt_am: zugestimmtAm,
    },
    success_url: `${siteUrl}/pruefung/erfolg?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/#preise`,
  });

  if (!session.url) {
    return { fehler: "Stripe hat keine Checkout-Adresse zurückgegeben." };
  }

  redirect(session.url);
}
