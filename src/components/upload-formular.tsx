"use client";

import { useRef, useState } from "react";
import { CircleCheck, CircleX, Paperclip, Upload } from "lucide-react";
import * as tus from "tus-js-client";

import {
  erzeugeUploadZiel,
  meldeUnterlagenEingegangen,
} from "@/app/actions/upload";
import { Button } from "@/components/ui/button";

const MAX_BYTE = 50 * 1024 * 1024;
const MAX_VERSUCHE = 20;

type Zustand = "wartend" | "laeuft" | "fertig" | "fehler";

type Eintrag = {
  datei: File;
  zustand: Zustand;
  fortschritt: number;
  meldung?: string;
};

function megabyte(byte: number): string {
  return `${(byte / 1024 / 1024).toLocaleString("de-AT", { maximumFractionDigits: 1 })} MB`;
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

/**
 * Wiederaufnehmbarer Upload über das TUS-Protokoll. Der Browser lädt direkt in
 * den Bucket; erlaubt ist das nur, weil eine Storage-Regel den Ordner gegen die
 * Tabelle der bezahlten Vorgänge prüft.
 *
 * Die Chunk-Größe von 6 MB gibt Supabase vor und darf nicht verändert werden.
 * `tus-js-client` merkt sich den Fortschritt im localStorage — bricht die
 * Verbindung ab, setzt der nächste Versuch dort wieder an.
 */
function ladeHoch(
  pfad: string,
  datei: File,
  beiFortschritt: (prozent: number) => void,
  beiHinweis: (text: string | undefined) => void,
): Promise<void> {
  return new Promise((erfuellen, ablehnen) => {
    let versuche = 0;

    const upload = new tus.Upload(datei, {
      endpoint: `${SUPABASE_URL}/storage/v1/upload/resumable`,
      chunkSize: 6 * 1024 * 1024,
      headers: {
        apikey: SUPABASE_KEY,
        authorization: `Bearer ${SUPABASE_KEY}`,
      },
      metadata: {
        bucketName: "documents",
        objectName: pfad,
        contentType: datei.type || "application/octet-stream",
      },
      removeFingerprintOnSuccess: true,
      onProgress: (geladen, gesamt) => {
        beiHinweis(undefined);
        beiFortschritt(Math.round((geladen / gesamt) * 100));
      },
      onSuccess: () => erfuellen(),
      onError: (fehler) => {
        versuche += 1;
        if (versuche > MAX_VERSUCHE) {
          ablehnen(fehler);
          return;
        }

        // Bei Netzfehlern versucht tus-js-client von sich aus nichts weiter.
        // Wir warten, bis der Browser wieder online ist, und starten neu — der
        // Upload setzt dann an der zuletzt bestätigten Stelle fort.
        const weiter = () => {
          beiHinweis("Verbindung wieder da, wird fortgesetzt …");
          upload.start();
        };

        if (!navigator.onLine) {
          beiHinweis("Keine Verbindung. Der Upload wird automatisch fortgesetzt.");
          window.addEventListener("online", weiter, { once: true });
        } else {
          beiHinweis("Verbindung gestört, neuer Versuch …");
          window.setTimeout(weiter, 2000);
        }
      },
    });

    // Einen früher abgebrochenen Upload derselben Datei fortsetzen, auch wenn
    // die Seite zwischendurch neu geladen wurde.
    upload
      .findPreviousUploads()
      .then((frueher) => {
        if (frueher.length > 0) upload.resumeFromPreviousUpload(frueher[0]);
        upload.start();
      })
      .catch(() => upload.start());
  });
}

export function UploadFormular({
  sessionId,
  hatBereitsDateien,
}: {
  sessionId: string;
  hatBereitsDateien: boolean;
}) {
  const [eintraege, setEintraege] = useState<Eintrag[]>([]);
  const [laeuft, setLaeuft] = useState(false);
  const [fertig, setFertig] = useState(false);
  const feldRef = useRef<HTMLInputElement>(null);

  function aktualisiere(index: number, teil: Partial<Eintrag>) {
    setEintraege((vorher) =>
      vorher.map((e, i) => (i === index ? { ...e, ...teil } : e)),
    );
  }

  function beiAuswahl(dateien: FileList | null) {
    if (!dateien) return;
    setFertig(false);
    setEintraege(
      Array.from(dateien).map((datei) => ({
        datei,
        zustand: datei.size > MAX_BYTE ? "fehler" : "wartend",
        fortschritt: 0,
        meldung:
          datei.size > MAX_BYTE
            ? `Zu groß: ${megabyte(datei.size)}. Zulässig sind bis zu ${megabyte(MAX_BYTE)} pro Datei.`
            : undefined,
      })),
    );
  }

  async function starten() {
    setLaeuft(true);
    let mindestensEine = false;

    for (const [index, eintrag] of eintraege.entries()) {
      if (eintrag.zustand === "fehler") continue;

      aktualisiere(index, { zustand: "laeuft", fortschritt: 0 });

      const ziel = await erzeugeUploadZiel(sessionId, eintrag.datei.name);
      if (!ziel.ok) {
        aktualisiere(index, { zustand: "fehler", meldung: ziel.fehler });
        continue;
      }

      try {
        await ladeHoch(
          ziel.pfad,
          eintrag.datei,
          (prozent) => aktualisiere(index, { fortschritt: prozent }),
          (text) => aktualisiere(index, { meldung: text }),
        );
        aktualisiere(index, { zustand: "fertig", fortschritt: 100 });
        mindestensEine = true;
      } catch (fehler) {
        aktualisiere(index, {
          zustand: "fehler",
          meldung:
            fehler instanceof Error ? fehler.message : "Der Upload ist fehlgeschlagen.",
        });
      }
    }

    if (mindestensEine) {
      await meldeUnterlagenEingegangen(sessionId);
      setFertig(true);
    }

    setLaeuft(false);
  }

  const bereit = eintraege.some((e) => e.zustand === "wartend");

  if (fertig) {
    return (
      <div className="rounded-2xl border border-border p-6 text-center">
        <CircleCheck className="mx-auto size-8 text-secondary" aria-hidden="true" />
        <h2 className="mt-4 text-lg font-semibold text-foreground">
          Ihre Unterlagen sind angekommen
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Sie erhalten gleich eine Bestätigung per E-Mail. Ab jetzt läuft die
          Bearbeitungszeit von drei Werktagen. Fehlt noch etwas, melde ich mich
          vorher bei Ihnen.
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setEintraege([]);
            setFertig(false);
          }}
          className="mx-auto mt-6 h-11 rounded-full px-6 text-sm font-semibold"
        >
          Weitere Datei hinzufügen
        </Button>
      </div>
    );
  }

  return (
    <div>
      <input
        ref={feldRef}
        type="file"
        multiple
        accept=".pdf,.jpg,.jpeg,.png,.heic,.heif,.doc,.docx,.xls,.xlsx"
        onChange={(ereignis) => beiAuswahl(ereignis.target.files)}
        className="sr-only"
      />

      <button
        type="button"
        onClick={() => feldRef.current?.click()}
        className="flex w-full flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-brand-tint/40 px-6 py-12 text-center transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <Upload className="size-6 text-primary" aria-hidden="true" />
        <span className="text-base font-semibold text-foreground">
          Dateien auswählen
        </span>
        <span className="max-w-[44ch] text-sm leading-relaxed text-muted-foreground">
          Das Gutachten der Versicherung als PDF und eine kurze Schilderung des
          Schadens in wenigen Sätzen.
        </span>
        <span className="max-w-[44ch] text-xs leading-relaxed text-muted-foreground/80">
          PDF, JPG, PNG, HEIC und Office-Dateien, bis {megabyte(MAX_BYTE)} pro
          Datei. Mehrere Dateien auf einmal sind möglich.
        </span>
      </button>

      {eintraege.length > 0 ? (
        <ul className="mt-6 flex flex-col gap-3">
          {eintraege.map((eintrag, index) => (
            <li
              key={`${eintrag.datei.name}-${index}`}
              className="rounded-xl border border-border p-4"
            >
              <div className="flex items-start gap-3">
                {eintrag.zustand === "fertig" ? (
                  <CircleCheck className="mt-0.5 size-4 shrink-0 text-secondary" aria-hidden="true" />
                ) : eintrag.zustand === "fehler" ? (
                  <CircleX className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden="true" />
                ) : (
                  <Paperclip className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-foreground">
                    {eintrag.datei.name}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {eintrag.meldung ?? megabyte(eintrag.datei.size)}
                  </p>
                </div>
              </div>

              {eintrag.zustand === "laeuft" ? (
                <div
                  role="progressbar"
                  aria-valuenow={eintrag.fortschritt}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Upload von ${eintrag.datei.name}`}
                  className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted"
                >
                  <div
                    className="h-full bg-primary transition-[width] duration-200"
                    style={{ width: `${eintrag.fortschritt}%` }}
                  />
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-6 flex justify-center">
        <Button
          type="button"
          disabled={!bereit || laeuft}
          onClick={starten}
          className="h-12 w-full rounded-full px-7 text-sm font-semibold sm:w-auto"
        >
          {laeuft ? "Wird hochgeladen …" : "Unterlagen übermitteln"}
        </Button>
      </div>

      {hatBereitsDateien && eintraege.length === 0 ? (
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Sie haben bereits Unterlagen übermittelt. Weitere Dateien können Sie
          jederzeit ergänzen.
        </p>
      ) : null}
    </div>
  );
}
