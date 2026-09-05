import { anbieter } from "@/lib/anbieter";
import { getSiteUrl } from "@/lib/site";

/** Schützt vor kaputtem Markup, wenn Werte aus Nutzerhand eingesetzt werden. */
export function escape(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

const FARBE_TEXT = "#111827";
const FARBE_LEISE = "#6b7280";
const FARBE_MARKE = "#3860c2";
const FARBE_LINIE = "#e5e7eb";

/** Pflichtangaben nach ECG §5, gespeist aus denselben Daten wie das Impressum. */
function anbieterZeilen(): string[] {
  return [
    `${anbieter.name}, Geschäftsführer ${anbieter.geschaeftsfuehrer}`,
    `${anbieter.strasse}, ${anbieter.plzOrt}, ${anbieter.land}`,
    [anbieter.email, anbieter.telefon].filter(Boolean).join(" · "),
    [anbieter.firmenbuchnummer, `UID ${anbieter.uid}`]
      .filter(Boolean)
      .join(" · "),
  ].filter(Boolean);
}

/**
 * Gemeinsame Hülle aller Mails. Tabellenlayout und Inline-Styles, weil
 * E-Mail-Clients kaum modernes CSS unterstützen.
 *
 * Der Fuß enthält die Anbieterkennzeichnung nach ECG §5, den Hinweis auf die
 * Datenschutzerklärung und die Rechtsgrundlage der Verarbeitung — bei einer
 * Auftragsbestätigung ist das Art. 6 Abs. 1 lit. b DSGVO, also die Erfüllung
 * des Vertrags. Deshalb gibt es hier auch keinen Abmeldelink: Diese Nachricht
 * ist kein Newsletter, sondern Teil der Abwicklung.
 */
export function mailRahmen(optionen: {
  /** Zeile für die Vorschau in der Posteingangsliste. */
  vorschau: string;
  inhalt: string;
}): string {
  const url = getSiteUrl();

  return `<!doctype html>
<html lang="de-AT">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <title>Gutachtencheck</title>
</head>
<body style="margin:0;padding:0;background:#f4f6fb;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escape(optionen.vorschau)}</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fb;">
    <tr><td align="center" style="padding:32px 16px;">

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid ${FARBE_LINIE};border-radius:14px;">
        <tr><td style="padding:32px 32px 0;">
          <a href="${url}" style="text-decoration:none;font-family:Helvetica,Arial,sans-serif;font-size:17px;font-weight:bold;letter-spacing:-0.3px;color:${FARBE_TEXT};">Gutachtencheck<span style="color:${FARBE_MARKE};">.</span></a>
        </td></tr>
        <tr><td style="padding:24px 32px 32px;font-family:Helvetica,Arial,sans-serif;color:${FARBE_TEXT};">
          ${optionen.inhalt}
        </td></tr>
      </table>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
        <tr><td style="padding:20px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:1.7;color:${FARBE_LEISE};">
          ${anbieterZeilen().map((z) => `<div>${escape(z)}</div>`).join("")}
          <div style="margin-top:12px;">
            Diese Nachricht gehört zur Abwicklung Ihres Auftrags. Wir verarbeiten
            Ihre Daten auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO. Näheres in der
            <a href="${url}/datenschutz" style="color:${FARBE_LEISE};">Datenschutzerklärung</a>
            und im <a href="${url}/impressum" style="color:${FARBE_LEISE};">Impressum</a>.
          </div>
        </td></tr>
      </table>

    </td></tr>
  </table>
</body>
</html>`;
}

/** Fuß für die Textfassung — dieselben Pflichtangaben. */
export function textFuss(): string[] {
  const url = getSiteUrl();
  return [
    "",
    "—",
    ...anbieterZeilen(),
    "",
    "Diese Nachricht gehört zur Abwicklung Ihres Auftrags. Wir verarbeiten Ihre",
    "Daten auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO.",
    `Datenschutzerklärung: ${url}/datenschutz`,
    `Impressum: ${url}/impressum`,
  ];
}

export const stil = {
  h1: `margin:0 0 16px;font-size:21px;line-height:1.3;font-weight:bold;color:${FARBE_TEXT};`,
  h2: `margin:28px 0 10px;font-size:15px;font-weight:bold;color:${FARBE_TEXT};`,
  p: `margin:0 0 16px;font-size:15px;line-height:1.65;color:${FARBE_TEXT};`,
  leise: `margin:0;font-size:13px;line-height:1.6;color:${FARBE_LEISE};`,
  knopf: `display:inline-block;padding:13px 26px;border-radius:999px;background:${FARBE_MARKE};color:#ffffff;font-size:15px;font-weight:bold;text-decoration:none;`,
  linie: `border:0;border-top:1px solid ${FARBE_LINIE};margin:28px 0;`,
} as const;
