import type { Mail } from "@/lib/email";
import { escape, mailRahmen, stil, textFuss } from "@/lib/mails/layout";
import { produkte } from "@/lib/produkte";

export function euro(cent: number): string {
  return (cent / 100).toLocaleString("de-AT", {
    style: "currency",
    currency: "EUR",
  });
}

export function bestellbestaetigung(daten: {
  an: string;
  betragInCent: number;
  uploadUrl: string;
}): Mail {
  const produkt = produkte["erst-einschaetzung"];
  const betrag = euro(daten.betragInCent);

  const html = mailRahmen({
    vorschau: `Zahlung über ${betrag} eingegangen. Jetzt Unterlagen hochladen.`,
    inhalt: `
      <h1 style="${stil.h1}">Ihre Zahlung ist eingegangen</h1>
      <p style="${stil.p}">
        Vielen Dank für Ihren Auftrag. Sie haben die <strong>${escape(produkt.name)}</strong>
        über ${betrag} inklusive Umsatzsteuer beauftragt.
      </p>

      <h2 style="${stil.h2}">Ihr nächster Schritt</h2>
      <p style="${stil.p}">
        Laden Sie Ihre Unterlagen über den folgenden Link hoch. Die Übertragung
        ist verschlüsselt, gespeichert wird auf Servern innerhalb der EU.
      </p>
      <p style="margin:0 0 24px;">
        <a href="${escape(daten.uploadUrl)}" style="${stil.knopf}">Unterlagen hochladen</a>
      </p>
      <p style="${stil.leise}">
        Falls der Knopf nicht funktioniert:<br>
        <a href="${escape(daten.uploadUrl)}" style="color:#6b7280;word-break:break-all;">${escape(daten.uploadUrl)}</a>
      </p>

      <hr style="${stil.linie}">

      <h2 style="margin-top:0;${stil.h2}">Was ich benötige</h2>
      <ul style="margin:0 0 16px;padding-left:20px;font-size:15px;line-height:1.7;">
        <li>Das Gutachten der Versicherung als PDF</li>
        <li>Eine kurze Schilderung des Schadens in wenigen Sätzen</li>
      </ul>
      <p style="${stil.p}">
        Die Bearbeitungszeit beträgt ${escape(produkt.lieferzeit)} und beginnt,
        sobald Ihre Unterlagen vollständig vorliegen. Die Rechnung erhalten Sie
        gesondert per E-Mail.
      </p>
      <p style="${stil.leise}">
        Der Link ist persönlich und führt zu Ihren Unterlagen. Bitte geben Sie
        ihn nicht weiter.
      </p>
    `,
  });

  const text = [
    "Ihre Zahlung ist eingegangen",
    "",
    `Vielen Dank für Ihren Auftrag. Sie haben die ${produkt.name} über ${betrag}`,
    "inklusive Umsatzsteuer beauftragt.",
    "",
    "IHR NÄCHSTER SCHRITT",
    "Laden Sie Ihre Unterlagen über den folgenden Link hoch. Die Übertragung ist",
    "verschlüsselt, gespeichert wird auf Servern innerhalb der EU.",
    "",
    daten.uploadUrl,
    "",
    "WAS ICH BENÖTIGE",
    "- Das Gutachten der Versicherung als PDF",
    "- Eine kurze Schilderung des Schadens in wenigen Sätzen",
    "",
    `Die Bearbeitungszeit beträgt ${produkt.lieferzeit} und beginnt, sobald Ihre`,
    "Unterlagen vollständig vorliegen. Die Rechnung erhalten Sie gesondert.",
    "",
    "Der Link ist persönlich und führt zu Ihren Unterlagen. Bitte geben Sie ihn",
    "nicht weiter.",
    ...textFuss(),
  ].join("\n");

  return {
    an: daten.an,
    betreff: `Auftragsbestätigung: ${produkt.name}`,
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
  const zeilen: [string, string][] = [
    ["Leistung", produkt.name],
    ["Betrag", euro(daten.betragInCent)],
    ["Kundin oder Kunde", daten.kundenEmail ?? "keine Adresse übermittelt"],
    ["Vorgang", daten.sessionId],
  ];

  return {
    an: daten.an,
    betreff: `Neue Bestellung: ${produkt.name}`,
    html: mailRahmen({
      vorschau: `${produkt.name}, ${euro(daten.betragInCent)}`,
      inhalt: `
        <h1 style="${stil.h1}">Neue Bestellung</h1>
        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;font-size:15px;line-height:1.7;">
          ${zeilen
            .map(
              ([bezeichnung, wert]) =>
                `<tr><td style="padding:2px 12px 2px 0;color:#6b7280;white-space:nowrap;">${escape(bezeichnung)}</td><td style="word-break:break-all;">${escape(wert)}</td></tr>`,
            )
            .join("")}
        </table>
        <p style="margin:20px 0 0;${stil.leise}">
          Die Unterlagen folgen, sobald sie hochgeladen wurden.
        </p>
      `,
    }),
    text: [
      "Neue Bestellung",
      "",
      ...zeilen.map(([b, w]) => `${b}: ${w}`),
      "",
      "Die Unterlagen folgen, sobald sie hochgeladen wurden.",
      ...textFuss(),
    ].join("\n"),
  };
}
