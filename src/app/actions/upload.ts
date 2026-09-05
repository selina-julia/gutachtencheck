"use server";

import { revalidatePath } from "next/cache";

import { sendeMail } from "@/lib/email";
import {
  unterlagenEingegangen,
  unterlagenFuerBetreiber,
} from "@/lib/mails/unterlagen";
import {
  DOKUMENTE_BUCKET,
  getSupabaseAdmin,
  ordnerFuer,
  saubererDateiname,
} from "@/lib/supabase";
import {
  ladeBezahltenVorgang,
  ladeDateien,
  registriereVorgang,
  speichereBeschreibung,
} from "@/lib/vorgang";

export type UploadZiel =
  | { ok: true; pfad: string }
  | { ok: false; fehler: string };

/**
 * Prüft die Zahlung, trägt den Vorgang ein und gibt den Zielpfad zurück. Der
 * Browser lädt anschließend direkt in den Bucket — an unserem Server vorbei,
 * der bei Vercel nur 4,5 MB pro Anfrage annehmen würde.
 *
 * Freigeschaltet wird der Upload nicht durch einen Token, sondern durch den
 * Eintrag in der Vorgangstabelle: Die Storage-Regel lässt Schreibzugriffe nur
 * in Ordner zu, die dort stehen. Die Session-ID vom Client wird deshalb bei
 * jedem Aufruf neu gegen Stripe geprüft.
 */
export async function erzeugeUploadZiel(
  sessionId: string,
  dateiname: string,
): Promise<UploadZiel> {
  const vorgang = await ladeBezahltenVorgang(sessionId);
  if (!vorgang) {
    return { ok: false, fehler: "Zu diesem Link liegt keine bezahlte Bestellung vor." };
  }

  await registriereVorgang(vorgang.sessionId);

  return {
    ok: true,
    pfad: `${ordnerFuer(vorgang.sessionId)}/${saubererDateiname(dateiname)}`,
  };
}

/**
 * Schließt die Übermittlung ab: speichert die Schilderung des Schadens am
 * Vorgang, bestätigt dem Kunden den Eingang und schickt dem Sachverständigen
 * die Downloadlinks samt Schilderung.
 */
export async function meldeUnterlagenEingegangen(
  sessionId: string,
  beschreibung: string,
): Promise<{ ok: boolean }> {
  const vorgang = await ladeBezahltenVorgang(sessionId);
  if (!vorgang) return { ok: false };

  const text = beschreibung.trim();
  if (text.length > 0) {
    await speichereBeschreibung(sessionId, text);
  }

  const dateien = await ladeDateien(sessionId);
  if (dateien.length === 0) return { ok: false };

  if (vorgang.email) {
    await sendeMail(unterlagenEingegangen({ an: vorgang.email, dateien }));
  }

  const betreiber = process.env.BETREIBER_EMAIL;
  if (betreiber) {
    // Downloadlinks laufen nach sieben Tagen ab. Ein signierter Link ist ein
    // Schlüssel — er soll nicht dauerhaft in einem Postfach liegen bleiben.
    const supabase = getSupabaseAdmin();
    const mitLinks = await Promise.all(
      dateien.map(async (datei) => {
        const { data } = await supabase.storage
          .from(DOKUMENTE_BUCKET)
          .createSignedUrl(`${ordnerFuer(sessionId)}/${datei.name}`, 60 * 60 * 24 * 7);
        return { ...datei, url: data?.signedUrl ?? null };
      }),
    );

    await sendeMail(
      unterlagenFuerBetreiber({
        an: betreiber,
        kundenEmail: vorgang.email,
        sessionId,
        beschreibung: text,
        dateien: mitLinks,
      }),
    );
  }

  revalidatePath(`/upload/${sessionId}`);
  return { ok: true };
}
