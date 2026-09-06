import "server-only";

import { getStripe } from "@/lib/stripe";
import { DOKUMENTE_BUCKET, getSupabaseAdmin, ordnerFuer } from "@/lib/supabase";

export type Vorgang = {
  sessionId: string;
  email: string | null;
  betragInCent: number;
};

export type HochgeladeneDatei = {
  name: string;
  groesseInByte: number;
  hochgeladenAm: string;
};

/**
 * Lädt den Vorgang zur Stripe-Session — aber nur, wenn tatsächlich bezahlt
 * wurde. Die Session-ID ist der einzige Schlüssel zum Upload, deshalb wird sie
 * bei jedem Zugriff neu gegen Stripe geprüft und nie dem Client geglaubt.
 */
export async function ladeBezahltenVorgang(
  sessionId: string,
): Promise<Vorgang | null> {
  if (!sessionId.startsWith("cs_")) return null;

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") return null;

    return {
      sessionId: session.id,
      email: session.customer_details?.email ?? null,
      betragInCent: session.amount_total ?? 0,
    };
  } catch {
    return null;
  }
}

/**
 * Trägt den bezahlten Vorgang ein. Die Storage-Regel erlaubt Uploads nur in
 * Ordner, die hier stehen — ohne Eintrag lehnt der Speicher jeden Chunk ab.
 */
export async function registriereVorgang(
  sessionId: string,
  daten?: { email?: string | null; betragInCent?: number | null },
): Promise<void> {
  const { error } = await getSupabaseAdmin()
    .from("orders")
    .upsert(
      {
        session_id: sessionId,
        ...(daten?.email !== undefined ? { customer_email: daten.email } : {}),
        ...(daten?.betragInCent !== undefined
          ? { amount_total: daten.betragInCent }
          : {}),
      },
      { onConflict: "session_id" },
    );

  if (error) {
    throw new Error(`Vorgang konnte nicht registriert werden: ${error.message}`);
  }
}

/** Schilderung des Schadens am Vorgang ablegen und den Eingang festhalten. */
export async function speichereBeschreibung(
  sessionId: string,
  beschreibung: string,
): Promise<void> {
  const { error } = await getSupabaseAdmin()
    .from("orders")
    .update({
      damage_description: beschreibung,
      documents_submitted_at: new Date().toISOString(),
    })
    .eq("session_id", sessionId);

  if (error) {
    throw new Error(`Schilderung konnte nicht gespeichert werden: ${error.message}`);
  }
}

export async function ladeDateien(
  sessionId: string,
): Promise<HochgeladeneDatei[]> {
  const { data, error } = await getSupabaseAdmin()
    .storage.from(DOKUMENTE_BUCKET)
    .list(ordnerFuer(sessionId), { limit: 100, sortBy: { column: "created_at", order: "asc" } });

  if (error || !data) return [];

  return data
    .filter((eintrag) => eintrag.id !== null)
    .map((eintrag) => ({
      name: eintrag.name,
      groesseInByte: Number(eintrag.metadata?.size ?? 0),
      hochgeladenAm: eintrag.created_at ?? "",
    }));
}
