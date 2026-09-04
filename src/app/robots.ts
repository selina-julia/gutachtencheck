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

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        /* Die Erfolgsseite trägt bereits noindex, hier kommt der Crawler gar
           nicht erst hin – sie ist ohne Stripe-Session ohnehin inhaltsleer. */
        disallow: "/pruefung/",
      },
      ...kiCrawler.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: "/pruefung/",
      })),
    ],
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
