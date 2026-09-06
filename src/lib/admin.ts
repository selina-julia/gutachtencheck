import "server-only";

import { DOKUMENTE_BUCKET, getSupabaseAdmin } from "@/lib/supabase";

export type Auftrag = {
  sessionId: string;
  angelegtAm: string;
  email: string | null;
  betragInCent: number | null;
  schilderung: string | null;
  unterlagenAm: string | null;
};

type Zeile = {
  session_id: string;
  created_at: string;
  customer_email: string | null;
  amount_total: number | null;
  damage_description: string | null;
  documents_submitted_at: string | null;
};

function zuAuftrag(zeile: Zeile): Auftrag {
  return {
    sessionId: zeile.session_id,
    angelegtAm: zeile.created_at,
    email: zeile.customer_email,
    betragInCent: zeile.amount_total,
    schilderung: zeile.damage_description,
    unterlagenAm: zeile.documents_submitted_at,
  };
}

/** Reads with the service role: orders stay closed to the Data API. */
export async function ladeAuftraege(): Promise<Auftrag[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error || !data) return [];
  return (data as Zeile[]).map(zuAuftrag);
}

export async function ladeAuftrag(sessionId: string): Promise<Auftrag | null> {
  const { data, error } = await getSupabaseAdmin()
    .from("orders")
    .select("*")
    .eq("session_id", sessionId)
    .maybeSingle();

  if (error || !data) return null;
  return zuAuftrag(data as Zeile);
}

export type AdminDatei = {
  name: string;
  groesseInByte: number;
  hochgeladenAm: string;
  url: string | null;
};

/**
 * Download links are minted per view and expire after fifteen minutes. A signed
 * link needs no login, so it should not outlive the page it was shown on.
 */
export async function ladeDateienMitLinks(
  sessionId: string,
): Promise<AdminDatei[]> {
  const supabase = getSupabaseAdmin();
  const speicher = supabase.storage.from(DOKUMENTE_BUCKET);

  const { data, error } = await speicher.list(sessionId, { limit: 100 });
  if (error || !data) return [];

  return Promise.all(
    data
      .filter((eintrag) => eintrag.id !== null)
      .map(async (eintrag) => {
        const { data: signiert } = await speicher.createSignedUrl(
          `${sessionId}/${eintrag.name}`,
          60 * 15,
        );
        return {
          name: eintrag.name,
          groesseInByte: Number(eintrag.metadata?.size ?? 0),
          hochgeladenAm: eintrag.created_at ?? "",
          url: signiert?.signedUrl ?? null,
        };
      }),
  );
}
