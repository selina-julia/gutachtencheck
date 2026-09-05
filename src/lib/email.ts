import "server-only";

import { Resend } from "resend";

/**
 * Resend-Client. Der Schlüssel wird erst beim Aufruf gelesen, damit der Build
 * ohne gesetzte Umgebungsvariablen durchläuft.
 */
function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;

  if (!key) {
    throw new Error(
      "RESEND_API_KEY fehlt. Schlüssel aus dem Resend-Dashboard in .env.local eintragen.",
    );
  }

  return new Resend(key);
}

function getAbsender(): string {
  return (
    process.env.RESEND_FROM ??
    "Gutachtencheck <noreply@gutachtencheck.online>"
  );
}

export type Mail = {
  an: string;
  betreff: string;
  html: string;
  /** Reine Textfassung. Ohne sie landen Mails eher im Spam. */
  text: string;
};

export async function sendeMail({ an, betreff, html, text }: Mail) {
  const { data, error } = await getResend().emails.send({
    from: getAbsender(),
    to: an,
    subject: betreff,
    html,
    text,
  });

  if (error) {
    throw new Error(`Resend hat die Mail abgelehnt: ${error.message}`);
  }

  return data;
}
