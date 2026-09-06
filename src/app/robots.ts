import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/site";

/**
 * Die Crawler der KI-Anbieter werden ausdrücklich zugelassen. Ohne Eintrag
 * gilt zwar ohnehin die allgemeine Regel, aber GPTBot und Google-Extended
 * werden von vielen Vorlagen pauschal gesperrt – die explizite Erlaubnis
 * macht die Entscheidung sichtbar und überlebt einen Vorlagenwechsel.
 *
 * Google-Extended steuert nur die Verwendung in Gemini und den AI Overviews,
 * nicht die normale Google-Suche. OAI-SearchBot und ChatGPT-User holen
 * Seiten für Antworten mit Quellenangabe, GPTBot sammelt Trainingsdaten.
 */
const kiCrawler = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "meta-externalagent",
  "Bytespider",
  "CCBot",
];

const gesperrt = ["/pruefung/", "/upload/", "/admin/", "/auth/"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        /* Erfolgs- und Upload-Seite tragen bereits noindex, hier kommt der
           Crawler gar nicht erst hin – ohne Stripe-Session sind sie ohnehin
           inhaltsleer. Die Verwaltung ist zusätzlich durch Anmeldung
           geschützt, steht aber trotzdem hier: kein Grund, sie zu erwähnen. */
        disallow: gesperrt,
      },
      ...kiCrawler.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: gesperrt,
      })),
    ],
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
