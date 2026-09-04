/**
 * Direkt kaufbare Leistungen. Beträge in Cent, brutto inklusive 20 % USt —
 * die Preisauszeichnung gegenüber Verbrauchern erfolgt laut Briefing brutto.
 * Der USt-Ausweis selbst steht auf der Rechnung, nicht im Stripe-Beleg.
 *
 * Pakete 2 und 3 stehen hier bewusst nicht: Sie laufen über Anfrage und
 * individuelles Festpreisangebot, also über Stripe Invoicing statt Checkout.
 */
export type Produkt = {
  id: string;
  name: string;
  beschreibung: string;
  betragInCent: number;
  lieferzeit: string;
  /** Ganzer Satz, weil "Lieferung in 3 Werktage" grammatikalisch falsch wäre. */
  lieferhinweis: string;
};

export const produkte = {
  "erst-einschaetzung": {
    id: "erst-einschaetzung",
    name: "Erst-Einschätzung",
    beschreibung:
      "Sichtung Ihres Versicherungsgutachtens durch einen allgemein beeideten und gerichtlich zertifizierten Sachverständigen, mit schriftlicher Kurzbewertung und Ampel-Aussage.",
    betragInCent: 14900,
    lieferzeit: "3 Werktage",
    lieferhinweis: "Lieferung in 3 Werktagen",
  },
} as const satisfies Record<string, Produkt>;

export type ProduktId = keyof typeof produkte;

export function istProduktId(wert: string): wert is ProduktId {
  return wert in produkte;
}
