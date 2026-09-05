import { GUTACHTEN_BUCKET, getSupabaseAdmin } from "@/lib/supabase";

/**
 * Löscht Unterlagen nach Ablauf der Aufbewahrungsfrist. Das Briefing nennt
 * 24 Monate; als Stichtag dient das Upload-Datum. Der tatsächliche Abschluss
 * liegt danach, die Frist greift damit eher früher als später — bei
 * Schadens- und Vertragsdaten die richtige Richtung.
 *
 * Wird von Vercel Cron aufgerufen (siehe vercel.json). Vercel schickt dabei
 * `Authorization: Bearer $CRON_SECRET`.
 */
const AUFBEWAHRUNG_MONATE = 24;

export async function GET(request: Request): Promise<Response> {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return new Response("CRON_SECRET ist nicht gesetzt", { status: 500 });
  }
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Nicht berechtigt", { status: 401 });
  }

  const stichtag = new Date();
  stichtag.setMonth(stichtag.getMonth() - AUFBEWAHRUNG_MONATE);

  const supabase = getSupabaseAdmin();
  const speicher = supabase.storage.from(GUTACHTEN_BUCKET);

  const { data: ordner, error: ordnerFehler } = await speicher.list("", {
    limit: 1000,
  });

  if (ordnerFehler) {
    return new Response(`Ordner konnten nicht gelesen werden: ${ordnerFehler.message}`, {
      status: 502,
    });
  }

  const zuLoeschen: string[] = [];

  for (const eintrag of ordner ?? []) {
    // Ordner haben keine id; echte Dateien auf oberster Ebene gibt es nicht.
    if (eintrag.id !== null) continue;

    const { data: dateien } = await speicher.list(eintrag.name, { limit: 1000 });

    for (const datei of dateien ?? []) {
      if (datei.id === null) continue;
      const erstellt = datei.created_at ? new Date(datei.created_at) : null;
      if (erstellt && erstellt < stichtag) {
        zuLoeschen.push(`${eintrag.name}/${datei.name}`);
      }
    }
  }

  if (zuLoeschen.length === 0) {
    return Response.json({ geprueft: ordner?.length ?? 0, geloescht: 0 });
  }

  const { error: loeschFehler } = await speicher.remove(zuLoeschen);
  if (loeschFehler) {
    return new Response(`Löschen fehlgeschlagen: ${loeschFehler.message}`, {
      status: 502,
    });
  }

  // Nachvollziehbarkeit: Die Datenschutzerklärung nennt die Frist, dieses
  // Protokoll belegt ihre Einhaltung.
  console.info("[aufraeumen] Unterlagen nach Ablauf der Frist gelöscht", {
    stichtag: stichtag.toISOString(),
    anzahl: zuLoeschen.length,
    pfade: zuLoeschen,
  });

  return Response.json({
    geprueft: ordner?.length ?? 0,
    geloescht: zuLoeschen.length,
    stichtag: stichtag.toISOString(),
  });
}
