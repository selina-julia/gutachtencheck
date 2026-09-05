import type { Mail } from "@/lib/email";
import { produkte } from "@/lib/produkte";
import { getSiteUrl } from "@/lib/site";

function euro(cent: number): string {
  return (cent / 100).toLocaleString("de-AT", {
    style: "currency",
    currency: "EUR",
  });
}

/** Sehr schlichtes Markup: E-Mail-Clients unterstützen kaum modernes CSS. */
function rahmen(inhalt: string): string {
  return `<!doctype html>
<html lang="de-AT">
<body style="margin:0;padding:24px;background:#f4f6fb;font-family:Helvetica,Arial,sans-serif;color:#111827;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;">
    <tr><td style="padding:32px;">
      <p style="margin:0 0 24px;font-size:18px;font-weight:bold;">Gutachtencheck<span style="color:#3860c2;">.</span></p>
      ${inhalt}
    </td></tr>
  </table>
  <p style="max-width:560px;margin:16px auto 0;font-size:12px;line-height:1.6;color:#6b7280;">
    Diese Nachricht wurde automatisch versendet. Antworten auf diese Adresse werden nicht gelesen.
  </p>
</body>
</html>`;
}

export function bestellbestaetigung(daten: {
  an: string;
  betragInCent: number;
  uploadUrl: string;
}): Mail {
  const produkt = produkte["erst-einschaetzung"];
  const betrag = euro(daten.betragInCent);

  const html = rahmen(`
    <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;">Ihre Zahlung ist eingegangen</h1>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;">
      Vielen Dank für Ihre Beauftragung der <strong>${produkt.name}</strong> über ${betrag} inkl. USt.
    </p>
    <h2 style="margin:24px 0 8px;font-size:16px;">Ihr nächster Schritt</h2>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;">
      Laden Sie Ihre Unterlagen über den folgenden Link hoch. Die Übertragung ist
      verschlüsselt, die Speicherung erfolgt DSGVO-konform auf Servern in der EU.
    </p>
    <p style="margin:0 0 24px;">
      <a href="${daten.uploadUrl}" style="display:inline-block;padding:12px 24px;border-radius:999px;background:#3860c2;color:#ffffff;font-size:15px;font-weight:bold;text-decoration:none;">Unterlagen hochladen</a>
    </p>
    <h2 style="margin:24px 0 8px;font-size:16px;">Was ich brauche</h2>
    <ul style="margin:0 0 16px;padding-left:20px;font-size:15px;line-height:1.6;">
      <li>Das Gutachten der Versicherung als PDF</li>
      <li>Eine kurze Schilderung des Schadens in wenigen Sätzen</li>
    </ul>
    <p style="margin:0;font-size:15px;line-height:1.6;">
      Die Bearbeitungszeit beträgt ${produkt.lieferzeit} und beginnt, sobald Ihre
      Unterlagen vollständig vorliegen. Die Rechnung erhalten Sie in einer
      separaten E-Mail.
    </p>
  `);

  const text = [
    "Ihre Zahlung ist eingegangen",
    "",
    `Vielen Dank für Ihre Beauftragung der ${produkt.name} über ${betrag} inkl. USt.`,
    "",
    "Ihr nächster Schritt: Laden Sie Ihre Unterlagen hier hoch (verschlüsselt, DSGVO-konform):",
    daten.uploadUrl,
    "",
    "Was ich brauche:",
    "- Das Gutachten der Versicherung als PDF",
    "- Eine kurze Schilderung des Schadens in wenigen Sätzen",
    "",
    `Die Bearbeitungszeit beträgt ${produkt.lieferzeit} und beginnt, sobald Ihre Unterlagen vollständig vorliegen.`,
    "Die Rechnung erhalten Sie in einer separaten E-Mail.",
    "",
    "Diese Nachricht wurde automatisch versendet.",
  ].join("\n");

  return {
    an: daten.an,
    betreff: `${produkt.name}: Ihre Zahlung ist eingegangen`,
    html,
    text,
  };
}

export function betreiberBenachrichtigung(daten: {
  an: string;
  kundenEmail: string | null;
  betragInCent: number;
  sessionId: string;
}): Mail {
  const produkt = produkte["erst-einschaetzung"];
  const zeilen = [
    `Produkt: ${produkt.name}`,
    `Betrag: ${euro(daten.betragInCent)}`,
    `Kunde: ${daten.kundenEmail ?? "keine Adresse übermittelt"}`,
    `Stripe-Session: ${daten.sessionId}`,
  ];

  return {
    an: daten.an,
    betreff: `Neue Bestellung: ${produkt.name}`,
    html: rahmen(`
      <h1 style="margin:0 0 16px;font-size:22px;">Neue Bestellung</h1>
      <ul style="margin:0 0 16px;padding-left:20px;font-size:15px;line-height:1.6;">
        ${zeilen.map((z) => `<li>${z}</li>`).join("")}
      </ul>
      <p style="margin:0;font-size:15px;line-height:1.6;">
        <a href="${getSiteUrl()}">Zur Website</a>
      </p>
    `),
    text: ["Neue Bestellung", "", ...zeilen].join("\n"),
  };
}
