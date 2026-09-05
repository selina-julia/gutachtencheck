import type { Mail } from "@/lib/email";
import type { HochgeladeneDatei } from "@/lib/vorgang";
import { produkte } from "@/lib/produkte";

function megabyte(byte: number): string {
  return `${(byte / 1024 / 1024).toLocaleString("de-AT", { maximumFractionDigits: 1 })} MB`;
}

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
</body>
</html>`;
}

export function unterlagenEingegangen(daten: {
  an: string;
  dateien: HochgeladeneDatei[];
}): Mail {
  const produkt = produkte["erst-einschaetzung"];
  const liste = daten.dateien
    .map((d) => `<li>${d.name} (${megabyte(d.groesseInByte)})</li>`)
    .join("");

  return {
    an: daten.an,
    betreff: "Ihre Unterlagen sind eingegangen",
    html: rahmen(`
      <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;">Ihre Unterlagen sind eingegangen</h1>
      <p style="margin:0 0 16px;font-size:15px;line-height:1.6;">
        Vielen Dank. Folgende Dateien liegen vor:
      </p>
      <ul style="margin:0 0 16px;padding-left:20px;font-size:15px;line-height:1.6;">${liste}</ul>
      <p style="margin:0;font-size:15px;line-height:1.6;">
        Die Bearbeitungszeit beträgt ${produkt.lieferzeit}. Ihre Kurzbewertung
        erhalten Sie anschließend per E-Mail. Falls noch etwas fehlt, melde ich
        mich vorher bei Ihnen.
      </p>
    `),
    text: [
      "Ihre Unterlagen sind eingegangen",
      "",
      "Vielen Dank. Folgende Dateien liegen vor:",
      ...daten.dateien.map((d) => `- ${d.name} (${megabyte(d.groesseInByte)})`),
      "",
      `Die Bearbeitungszeit beträgt ${produkt.lieferzeit}. Ihre Kurzbewertung erhalten Sie anschließend per E-Mail.`,
      "Falls noch etwas fehlt, melde ich mich vorher bei Ihnen.",
    ].join("\n"),
  };
}

export function unterlagenFuerBetreiber(daten: {
  an: string;
  kundenEmail: string | null;
  sessionId: string;
  dateien: (HochgeladeneDatei & { url: string | null })[];
}): Mail {
  const liste = daten.dateien
    .map((d) =>
      d.url
        ? `<li><a href="${d.url}">${d.name}</a> (${megabyte(d.groesseInByte)})</li>`
        : `<li>${d.name} (${megabyte(d.groesseInByte)}) — Link konnte nicht erzeugt werden</li>`,
    )
    .join("");

  return {
    an: daten.an,
    betreff: `Unterlagen eingegangen: ${daten.kundenEmail ?? daten.sessionId}`,
    html: rahmen(`
      <h1 style="margin:0 0 16px;font-size:22px;">Unterlagen eingegangen</h1>
      <p style="margin:0 0 8px;font-size:15px;line-height:1.6;">
        Kunde: ${daten.kundenEmail ?? "keine Adresse übermittelt"}<br>
        Vorgang: ${daten.sessionId}
      </p>
      <ul style="margin:0 0 16px;padding-left:20px;font-size:15px;line-height:1.6;">${liste}</ul>
      <p style="margin:0;font-size:13px;line-height:1.6;color:#6b7280;">
        Die Downloadlinks laufen in sieben Tagen ab. Danach sind die Dateien nur
        noch über das Supabase-Dashboard erreichbar.
      </p>
    `),
    text: [
      "Unterlagen eingegangen",
      "",
      `Kunde: ${daten.kundenEmail ?? "keine Adresse übermittelt"}`,
      `Vorgang: ${daten.sessionId}`,
      "",
      ...daten.dateien.map(
        (d) => `- ${d.name} (${megabyte(d.groesseInByte)})\n  ${d.url ?? "Link konnte nicht erzeugt werden"}`,
      ),
      "",
      "Die Downloadlinks laufen in sieben Tagen ab.",
    ].join("\n"),
  };
}
