import type Stripe from "stripe";

import { sendeMail } from "@/lib/email";
import {
  bestellbestaetigung,
  betreiberBenachrichtigung,
} from "@/lib/mails/bestellbestaetigung";
import { getSiteUrl } from "@/lib/site";
import { getStripe } from "@/lib/stripe";
import { registriereVorgang } from "@/lib/vorgang";

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
/**
 * Prüft über den PaymentIntent, ob für diesen Vorgang schon eine Bestätigung
 * rausging. Stripe stellt Events mehrfach zu, und ohne Datenbank ist Stripe
 * selbst der einzige verlässliche Speicher dafür.
 */
async function bereitsBestaetigt(
  stripe: Stripe,
  paymentIntentId: string,
): Promise<boolean> {
  const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
  return pi.metadata?.bestaetigung_gesendet === "ja";
}

async function bearbeitungFreigeben(
  session: Stripe.Checkout.Session,
): Promise<void> {
  const stripe = getStripe();
  const email = session.customer_details?.email ?? null;

  // Schaltet den Upload für diesen Ordner frei und hält fest, wer bestellt
  // hat — sonst bräuchte die Auftragsliste einen Stripe-Aufruf je Zeile.
  await registriereVorgang(session.id, {
    email,
    betragInCent: session.amount_total,
  });
  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : (session.payment_intent?.id ?? null);

  if (paymentIntentId && (await bereitsBestaetigt(stripe, paymentIntentId))) {
    console.info("[stripe] Bestätigung lag bereits vor, übersprungen", {
      sessionId: session.id,
    });
    return;
  }

  if (email) {
    await sendeMail(
      bestellbestaetigung({
        an: email,
        betragInCent: session.amount_total ?? 0,
        uploadUrl: `${getSiteUrl()}/upload/${session.id}`,
      }),
    );
  } else {
    console.warn("[stripe] Keine Kundenadresse, keine Bestätigung versendet", {
      sessionId: session.id,
    });
  }

  const betreiber = process.env.BETREIBER_EMAIL;
  if (betreiber) {
    await sendeMail(
      betreiberBenachrichtigung({
        an: betreiber,
        kundenEmail: email,
        betragInCent: session.amount_total ?? 0,
        sessionId: session.id,
      }),
    );
  }

  // Erst nach dem Versand markieren. Bricht die Markierung ab, verschickt ein
  // Wiederholungsversuch die Mail ein zweites Mal — das ist das kleinere Übel
  // gegenüber einer Bestellung, die gar keine Bestätigung bekommt.
  if (paymentIntentId) {
    await stripe.paymentIntents.update(paymentIntentId, {
      metadata: {
        bestaetigung_gesendet: "ja",
        bestaetigt_am: new Date().toISOString(),
      },
    });
  }

  console.info("[stripe] Zahlung bestätigt, Bestätigung versendet", {
    sessionId: session.id,
    email,
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
        await bearbeitungFreigeben(session);
      } else {
        console.info("[stripe] Bestellung eingegangen, Zahlung noch offen", {
          sessionId: session.id,
          paymentStatus: session.payment_status,
        });
      }
      break;
    }

    case "checkout.session.async_payment_succeeded": {
      await bearbeitungFreigeben(event.data.object);
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
