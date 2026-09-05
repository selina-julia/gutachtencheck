import type { Mail } from "@/lib/email";
import { euro } from "@/lib/mails/bestellbestaetigung";
import { escape, mailRahmen, stil, textFuss } from "@/lib/mails/layout";
import { produkte } from "@/lib/produkte";
import type { HochgeladeneDatei } from "@/lib/vorgang";

function megabyte(byte: number): string {
  return `${(byte / 1024 / 1024).toLocaleString("de-AT", { maximumFractionDigits: 1 })} MB`;
}

function dateiTabelle(
  dateien: (HochgeladeneDatei & { url?: string | null })[],
): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;font-size:15px;line-height:1.7;border-collapse:collapse;">
    ${dateien
      .map((d) => {
        const name = d.url
          ? `<a href="${escape(d.url)}" style="color:#3860c2;">${escape(d.name)}</a>`
          : escape(d.name);
        return `<tr>
          <td style="padding:8px 12px 8px 0;border-top:1px solid #e5e7eb;word-break:break-all;">${name}</td>
          <td style="padding:8px 0;border-top:1px solid #e5e7eb;color:#6b7280;white-space:nowrap;text-align:right;">${megabyte(d.groesseInByte)}</td>
        </tr>`;
      })
      .join("")}
  </table>`;
}

export function unterlagenEingegangen(daten: {
  an: string;
  dateien: HochgeladeneDatei[];
}): Mail {
  const produkt = produkte["erst-einschaetzung"];
  const anzahl = daten.dateien.length;

  return {
    an: daten.an,
    betreff: "Ihre Unterlagen sind eingegangen",
    html: mailRahmen({
      vorschau: `${anzahl} ${anzahl === 1 ? "Datei" : "Dateien"} eingegangen. Die Bearbeitung läuft.`,
      inhalt: `
        <h1 style="${stil.h1}">Ihre Unterlagen sind eingegangen</h1>
        <p style="${stil.p}">
          Vielen Dank. ${anzahl === 1 ? "Folgende Datei liegt" : "Folgende Dateien liegen"} vor:
        </p>
        ${dateiTabelle(daten.dateien)}
        <p style="margin:24px 0 16px;font-size:15px;line-height:1.65;">
          Die Bearbeitungszeit beträgt ${escape(produkt.lieferzeit)} und läuft
          ab jetzt. Ihre Kurzbewertung erhalten Sie anschließend per E-Mail.
          Sollte etwas fehlen, melde ich mich vorher bei Ihnen.
        </p>
        <p style="${stil.leise}">
          Ihre Unterlagen werden ausschließlich zur Erfüllung dieses Auftrags
          verarbeitet, verschlüsselt auf Servern innerhalb der EU gespeichert und
          nach 24 Monaten automatisch gelöscht.
        </p>
      `,
    }),
    text: [
      "Ihre Unterlagen sind eingegangen",
      "",
      `Vielen Dank. ${anzahl === 1 ? "Folgende Datei liegt" : "Folgende Dateien liegen"} vor:`,
      ...daten.dateien.map((d) => `- ${d.name} (${megabyte(d.groesseInByte)})`),
      "",
      `Die Bearbeitungszeit beträgt ${produkt.lieferzeit} und läuft ab jetzt. Ihre`,
      "Kurzbewertung erhalten Sie anschließend per E-Mail. Sollte etwas fehlen,",
      "melde ich mich vorher bei Ihnen.",
      "",
      "Ihre Unterlagen werden ausschließlich zur Erfüllung dieses Auftrags",
      "verarbeitet, verschlüsselt auf Servern innerhalb der EU gespeichert und",
      "nach 24 Monaten automatisch gelöscht.",
      ...textFuss(),
    ].join("\n"),
  };
}

export function unterlagenFuerBetreiber(daten: {
  an: string;
  kundenEmail: string | null;
  sessionId: string;
  betragInCent?: number;
  dateien: (HochgeladeneDatei & { url: string | null })[];
}): Mail {
  const kopf: [string, string][] = [
    ["Kundin oder Kunde", daten.kundenEmail ?? "keine Adresse übermittelt"],
    ["Vorgang", daten.sessionId],
    ...(daten.betragInCent
      ? ([["Betrag", euro(daten.betragInCent)]] as [string, string][])
      : []),
  ];

  return {
    an: daten.an,
    betreff: `Unterlagen eingegangen: ${daten.kundenEmail ?? daten.sessionId}`,
    html: mailRahmen({
      vorschau: `${daten.dateien.length} Datei(en) zum Vorgang ${daten.sessionId}`,
      inhalt: `
        <h1 style="${stil.h1}">Unterlagen eingegangen</h1>
        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;font-size:15px;line-height:1.7;margin-bottom:20px;">
          ${kopf
            .map(
              ([b, w]) =>
                `<tr><td style="padding:2px 12px 2px 0;color:#6b7280;white-space:nowrap;">${escape(b)}</td><td style="word-break:break-all;">${escape(w)}</td></tr>`,
            )
            .join("")}
        </table>
        ${dateiTabelle(daten.dateien)}
        <p style="margin:24px 0 0;${stil.leise}">
          Die Downloadlinks laufen nach sieben Tagen ab. Sie gewähren ohne
          weitere Anmeldung Zugriff auf personenbezogene Daten — bitte nicht
          weiterleiten. Danach sind die Dateien über das Speicher-Dashboard
          erreichbar.
        </p>
      `,
    }),
    text: [
      "Unterlagen eingegangen",
      "",
      ...kopf.map(([b, w]) => `${b}: ${w}`),
      "",
      ...daten.dateien.flatMap((d) => [
        `${d.name} (${megabyte(d.groesseInByte)})`,
        `  ${d.url ?? "Link konnte nicht erzeugt werden"}`,
      ]),
      "",
      "Die Downloadlinks laufen nach sieben Tagen ab. Sie gewähren ohne weitere",
      "Anmeldung Zugriff auf personenbezogene Daten — bitte nicht weiterleiten.",
      ...textFuss(),
    ].join("\n"),
  };
}
