import { Ablauf } from "@/components/sections/ablauf";
import { CtaBanner } from "@/components/sections/cta-banner";
import { Faq } from "@/components/sections/faq";
import { Hero } from "@/components/sections/hero";
import { Pricing } from "@/components/sections/pricing";
import { Services } from "@/components/sections/services";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { produkte } from "@/lib/produkte";
import { getSiteUrl, siteBeschreibung, siteName } from "@/lib/site";

/**
 * Anbieter und Angebot als strukturierte Daten. Bewusst nur, was auf der Seite
 * auch tatsächlich steht – keine Adresse, keine Bewertungen, keine Kennzahlen,
 * die sich nicht belegen lassen.
 */
const anbieterDaten = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: siteName,
  url: getSiteUrl(),
  description: siteBeschreibung,
  serviceType: "Prüfung von Versicherungsgutachten",
  areaServed: { "@type": "Country", name: "Österreich" },
  availableLanguage: "de-AT",
  makesOffer: Object.values(produkte).map((produkt) => ({
    "@type": "Offer",
    name: produkt.name,
    description: produkt.beschreibung,
    price: (produkt.betragInCent / 100).toFixed(2),
    priceCurrency: "EUR",
    availability: "https://schema.org/InStock",
    url: `${getSiteUrl()}/#preise`,
  })),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(anbieterDaten) }}
      />
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Services />
        <Ablauf />
        <Pricing />
        <Faq />
        <CtaBanner />
      </main>
      <SiteFooter />
    </>
  );
}
