import type Stripe from "stripe";

import { getStripe } from "@/lib/stripe";

/**
 * Stripe-Webhook. Die Signatur wird gegen den rohen Request-Body geprüft —
 * deshalb `request.text()` und kein `request.json()`.
 *
 * Lokal testen:
 *   stripe listen --forward-to localhost:3000/api/stripe/webhook
 *
 * Benötigte Events im Dashboard:
 *   checkout.session.completed
 *   checkout.session.async_payment_succeeded
 *   checkout.session.async_payment_failed
 *   checkout.session.expired
 */
function bearbeitungFreigeben(session: Stripe.Checkout.Session): void {
  // Ab hier gehört die Auslieferung hin: Rechnung erzeugen, Upload-Link
  // versenden, Vorgang anlegen. Solange es dafür weder Datenbank noch
  // Mailversand gibt, wird der Eingang nur protokolliert.
  //
  // Wenn das gebaut wird: Stripe stellt ein Event mehrfach zu. Die Auslieferung
  // muss also idempotent sein, etwa über die bereits gespeicherte session.id.
  console.info("[stripe] Zahlung bestätigt, Bearbeitung kann beginnen", {
    sessionId: session.id,
    betrag: session.amount_total,
    email: session.customer_details?.email,
    metadata: session.metadata,
  });
}

export async function POST(request: Request): Promise<Response> {
  const signatur = request.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signatur || !secret) {
    return new Response("Signatur oder STRIPE_WEBHOOK_SECRET fehlt", {
      status: 400,
    });
  }

  const rohkoerper = await request.text();
  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(rohkoerper, signatur, secret);
  } catch (fehler) {
    const meldung = fehler instanceof Error ? fehler.message : "unbekannt";
    return new Response(`Signaturprüfung fehlgeschlagen: ${meldung}`, {
      status: 400,
    });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;

      // Bei Zahlungsarten mit verzögerter Bestätigung ist die Session an
      // dieser Stelle abgeschlossen, das Geld aber noch nicht da. Laut
      // Briefing wird immer vor Bearbeitungsbeginn bezahlt — also erst
      // freigeben, wenn Stripe die Zahlung als bezahlt meldet.
      if (session.payment_status === "paid") {
        bearbeitungFreigeben(session);
      } else {
        console.info("[stripe] Bestellung eingegangen, Zahlung noch offen", {
          sessionId: session.id,
          paymentStatus: session.payment_status,
        });
      }
      break;
    }

    case "checkout.session.async_payment_succeeded": {
      bearbeitungFreigeben(event.data.object);
      break;
    }

    case "checkout.session.async_payment_failed": {
      console.warn("[stripe] Verzögerte Zahlung fehlgeschlagen", {
        sessionId: event.data.object.id,
        email: event.data.object.customer_details?.email,
      });
      break;
    }

    case "checkout.session.expired": {
      console.info("[stripe] Checkout abgelaufen, keine Zahlung erfolgt", {
        sessionId: event.data.object.id,
      });
      break;
    }

    default:
      break;
  }

  return Response.json({ received: true });
}
