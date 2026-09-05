import "server-only";

import Stripe from "stripe";

/**
 * Stripe-Client für den Server. Der Schlüssel wird bewusst erst beim Aufruf
 * gelesen, damit der Build ohne gesetzte Umgebungsvariablen durchläuft und
 * der Fehler dort auftritt, wo er hingehört: beim Bezahlvorgang.
 */
export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;

  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY fehlt. Schlüssel aus dem Stripe-Testmodus in .env.local eintragen.",
    );
  }

  return new Stripe(key);
}
