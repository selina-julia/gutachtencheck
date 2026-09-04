/**
 * Basisangaben der Seite. Liegen bewusst getrennt vom Stripe-Modul, damit
 * Layout, Sitemap und robots.txt sie lesen können, ohne das Stripe-SDK in
 * ihren Modulgraphen zu ziehen.
 */
export const siteName = "Gutachtencheck";

export const siteBeschreibung =
  "Ihr Versicherungsgutachten unabhängig geprüft – von einem beeideten Sachverständigen. Fixpreis 149 €, Ergebnis in 3 Werktagen, österreichweit online.";

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}
