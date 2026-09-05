"use client";

import { useRef, useState } from "react";
import { ArrowLeft, CircleCheck, CircleX, Paperclip, Upload } from "lucide-react";
import * as tus from "tus-js-client";

import {
  erzeugeUploadZiel,
  meldeUnterlagenEingegangen,
} from "@/app/actions/upload";
import { Button } from "@/components/ui/button";
import { Schrittanzeige } from "@/components/upload-schritte";
import { Label } from "@/components/ui/label";

const MAX_BYTE = 50 * 1024 * 1024;
const MAX_VERSUCHE = 20;
const MIN_BESCHREIBUNG = 20;

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
  const [schritt, setSchritt] = useState(0);
  const [eintraege, setEintraege] = useState<Eintrag[]>([]);
  const [beschreibung, setBeschreibung] = useState("");
  const [laeuft, setLaeuft] = useState(false);
  const [uebermittelt, setUebermittelt] = useState(false);
  const [fehler, setFehler] = useState<string | undefined>();
  const feldRef = useRef<HTMLInputElement>(null);

  function aktualisiere(index: number, teil: Partial<Eintrag>) {
    setEintraege((vorher) =>
      vorher.map((e, i) => (i === index ? { ...e, ...teil } : e)),
    );
  }

  function beiAuswahl(dateien: FileList | null) {
    if (!dateien) return;
    const neue = Array.from(dateien).map<Eintrag>((datei) => ({
      datei,
      zustand: datei.size > MAX_BYTE ? "fehler" : "wartend",
      fortschritt: 0,
      meldung:
        datei.size > MAX_BYTE
          ? `Zu groß: ${megabyte(datei.size)}. Zulässig sind bis zu ${megabyte(MAX_BYTE)} pro Datei.`
          : undefined,
    }));
    setEintraege((vorher) => [...vorher, ...neue]);
    void starteUploads(neue.length);
  }

  /** Lädt sofort hoch, damit die Wartezeit in Schritt 2 mitläuft. */
  async function starteUploads(anzahlNeu: number) {
    setLaeuft(true);

    const alle = await new Promise<Eintrag[]>((auf) =>
      setEintraege((vorher) => {
        auf(vorher);
        return vorher;
      }),
    );
    const beginn = alle.length - anzahlNeu;

    for (let index = beginn; index < alle.length; index += 1) {
      const eintrag = alle[index];
      if (!eintrag || eintrag.zustand === "fehler") continue;

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
      } catch (problem) {
        aktualisiere(index, {
          zustand: "fehler",
          meldung:
            problem instanceof Error
              ? problem.message
              : "Der Upload ist fehlgeschlagen.",
        });
      }
    }

    setLaeuft(false);
  }

  async function uebermitteln() {
    setLaeuft(true);
    setFehler(undefined);

    const ergebnis = await meldeUnterlagenEingegangen(sessionId, beschreibung);
    if (ergebnis.ok) {
      setUebermittelt(true);
    } else {
      setFehler(
        "Die Übermittlung ist fehlgeschlagen. Bitte versuchen Sie es erneut.",
      );
    }

    setLaeuft(false);
  }

  const fertigeDateien = eintraege.filter((e) => e.zustand === "fertig");
  const beschreibungReicht = beschreibung.trim().length >= MIN_BESCHREIBUNG;

  if (uebermittelt) {
    return (
      <div className="rounded-2xl border border-border p-8 text-center">
        <CircleCheck className="mx-auto size-8 text-secondary" aria-hidden="true" />
        <h2 className="mt-4 text-lg font-semibold text-foreground">
          Ihre Unterlagen sind angekommen
        </h2>
        <p className="mx-auto mt-2 max-w-[46ch] text-sm leading-relaxed text-muted-foreground">
          Sie erhalten gleich eine Bestätigung per E-Mail. Ab jetzt läuft die
          Bearbeitungszeit von drei Werktagen. Fehlt noch etwas, melde ich mich
          vorher bei Ihnen.
        </p>
      </div>
    );
  }

  return (
    <div>
      <Schrittanzeige aktiv={schritt} />

      <div className="mt-10">
        {schritt === 0 ? (
          <>
            <input
              ref={feldRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.heic,.heif,.doc,.docx,.xls,.xlsx"
              onChange={(ereignis) => {
                beiAuswahl(ereignis.target.files);
                ereignis.target.value = "";
              }}
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
                Das Gutachten der Versicherung als PDF, dazu Fotos oder weitere
                Unterlagen, sofern vorhanden.
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
                    className="rounded-xl border border-border p-4 text-left"
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

            {hatBereitsDateien && eintraege.length === 0 ? (
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Sie haben bereits Unterlagen übermittelt. Weitere Dateien können
                Sie jederzeit ergänzen.
              </p>
            ) : null}
          </>
        ) : null}

        {schritt === 1 ? (
          <div className="text-left">
            <Label htmlFor="beschreibung" className="text-base font-semibold">
              Was ist passiert?
            </Label>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Schildern Sie den Schaden in wenigen Sätzen: Was ist passiert, wann,
              und worüber sind Sie mit der Versicherung uneinig? Das hilft mir,
              die richtigen Stellen im Gutachten zuerst anzusehen.
            </p>
            <textarea
              id="beschreibung"
              value={beschreibung}
              onChange={(ereignis) => setBeschreibung(ereignis.target.value)}
              rows={7}
              className="mt-4 w-full rounded-xl border border-border bg-background p-4 text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              placeholder="Im März ist nach einem Sturm Wasser über das Dach eingedrungen …"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              {beschreibung.trim().length < MIN_BESCHREIBUNG
                ? `Noch mindestens ${MIN_BESCHREIBUNG - beschreibung.trim().length} Zeichen.`
                : `${beschreibung.trim().length} Zeichen`}
            </p>
          </div>
        ) : null}

        {schritt === 2 ? (
          <div className="rounded-2xl border border-border p-6 text-left">
            <h2 className="text-base font-semibold text-foreground">
              Das übermittle ich
            </h2>

            <ul className="mt-4 flex flex-col gap-2 border-b border-border pb-4">
              {fertigeDateien.map((eintrag, index) => (
                <li
                  key={`${eintrag.datei.name}-${index}`}
                  className="flex justify-between gap-4 text-sm"
                >
                  <span className="truncate text-foreground">
                    {eintrag.datei.name}
                  </span>
                  <span className="shrink-0 text-muted-foreground">
                    {megabyte(eintrag.datei.size)}
                  </span>
                </li>
              ))}
            </ul>

            <h3 className="mt-4 text-sm font-semibold text-foreground">
              Schilderung
            </h3>
            <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
              {beschreibung.trim()}
            </p>
          </div>
        ) : null}
      </div>

      {fehler ? (
        <p role="alert" className="mt-6 text-center text-sm font-medium text-destructive">
          {fehler}
        </p>
      ) : null}

      <div className="mt-8 flex flex-col-reverse items-center justify-between gap-3 sm:flex-row">
        {schritt > 0 ? (
          <Button
            type="button"
            variant="ghost"
            onClick={() => setSchritt((s) => s - 1)}
            disabled={laeuft}
            className="h-11 rounded-full px-5 text-sm font-semibold"
          >
            <ArrowLeft className="mr-1.5 size-4" aria-hidden="true" />
            Zurück
          </Button>
        ) : (
          <span className="hidden sm:block" />
        )}

        {schritt < 2 ? (
          <Button
            type="button"
            onClick={() => setSchritt((s) => s + 1)}
            disabled={
              laeuft ||
              (schritt === 0 && fertigeDateien.length === 0) ||
              (schritt === 1 && !beschreibungReicht)
            }
            className="h-12 w-full rounded-full px-7 text-sm font-semibold sm:w-auto"
          >
            {laeuft && schritt === 0 ? "Wird hochgeladen …" : "Weiter"}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={uebermitteln}
            disabled={laeuft}
            className="h-12 w-full rounded-full px-7 text-sm font-semibold sm:w-auto"
          >
            {laeuft ? "Wird übermittelt …" : "Unterlagen übermitteln"}
          </Button>
        )}
      </div>
    </div>
  );
}
