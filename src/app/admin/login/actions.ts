"use server";

import { istErlaubt } from "@/lib/auth";
import { getSiteUrl } from "@/lib/site";
import { createAuthClient } from "@/lib/supabase-auth/server";

export type AnmeldeZustand =
  | { art: "leer" }
  | { art: "gesendet"; an: string }
  | { art: "fehler"; meldung: string };

export async function sendeAnmeldelink(
  _vorher: AnmeldeZustand,
  formData: FormData,
): Promise<AnmeldeZustand> {
  const email = String(formData.get("email") ?? "").trim();

  // Auf eine unbekannte Adresse antworten wir gleich wie auf eine bekannte.
  // Sonst verrät das Formular, welche Adressen Zugang haben.
  if (!istErlaubt(email)) {
    return { art: "gesendet", an: email };
  }

  const supabase = await createAuthClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      // Kein Anlegen neuer Konten über das Formular.
      shouldCreateUser: false,
      emailRedirectTo: `${getSiteUrl()}/auth/callback`,
    },
  });

  if (error) {
    return { art: "fehler", meldung: "Der Link konnte nicht gesendet werden." };
  }

  return { art: "gesendet", an: email };
}
