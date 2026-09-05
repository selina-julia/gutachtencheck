import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const GUTACHTEN_BUCKET = "gutachten";

/**
 * Supabase-Client mit Service-Role-Schlüssel. Ausschließlich serverseitig
 * verwenden — der Schlüssel umgeht jede Zugriffsregel und darf niemals in den
 * Browser gelangen.
 */
export function getSupabaseAdmin(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL oder SUPABASE_SERVICE_ROLE_KEY fehlt.",
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Alle Dateien eines Vorgangs liegen im Ordner der Stripe-Session. */
export function ordnerFuer(sessionId: string): string {
  return sessionId;
}

/**
 * Entschärft Dateinamen für den Objektpfad: Supabase erlaubt keine beliebigen
 * Zeichen, und ein Name aus Nutzerhand kann alles enthalten.
 */
export function saubererDateiname(name: string): string {
  const bereinigt = name
    .normalize("NFKD")
    .replace(/[^\w.\-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return bereinigt.slice(-120) || "datei";
}
