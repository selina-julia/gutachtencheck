import { ablaufSchritte } from "@/lib/ablauf";
import { anbieter } from "@/lib/anbieter";
import { fragen } from "@/lib/faq";
import { produkte } from "@/lib/produkte";
import { getSiteUrl, siteBeschreibung, siteName } from "@/lib/site";

/**
 * Strukturierte Daten als ein zusammenhängender Graph statt als lose Einzel-
 * blöcke. Die Knoten verweisen über @id aufeinander – erst dadurch ist für eine
 * Maschine erkennbar, dass Angebot, Ablauf und Fragen zu demselben Anbieter
 * gehören und die Prüfung von einer bestimmten Person durchgeführt wird.
 *
 * Ausgezeichnet wird ausschließlich, was auf der Seite oder im Impressum auch
 * wirklich steht. Keine Bewertungen, keine Fallzahlen, keine Zertifikate ohne
 * Beleg – erfundene Auszeichnungen sind ein Risiko und kein Ranking-Vorteil.
 */
export function baueDatenGraph() {
  const url = getSiteUrl();

  const ids = {
    website: `${url}/#website`,
    anbieter: `${url}/#anbieter`,
    person: `${url}/#sachverstaendiger`,
    leistung: `${url}/#leistung`,
    ablauf: `${url}/#ablauf-howto`,
    faq: `${url}/#faq`,
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": ids.website,
        url,
        name: siteName,
        description: siteBeschreibung,
        inLanguage: "de-AT",
        publisher: { "@id": ids.anbieter },
      },
      {
        "@type": "ProfessionalService",
        "@id": ids.anbieter,
        name: siteName,
        legalName: anbieter.name,
        url,
        description: siteBeschreibung,
        email: anbieter.email,
        telephone: anbieter.telefon,
        vatID: anbieter.uid,
        address: {
          "@type": "PostalAddress",
          streetAddress: anbieter.strasse,
          postalCode: anbieter.plzOrt.split(" ")[0],
          addressLocality: anbieter.plzOrt.split(" ").slice(1).join(" "),
          addressCountry: "AT",
        },
        areaServed: { "@type": "Country", name: "Österreich" },
        availableLanguage: "de-AT",
        priceRange: "€€",
        employee: { "@id": ids.person },
        makesOffer: Object.values(produkte).map((produkt) => ({
          "@type": "Offer",
          name: produkt.name,
          description: produkt.beschreibung,
          price: (produkt.betragInCent / 100).toFixed(2),
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
          url: `${url}/#preise`,
          deliveryLeadTime: {
            "@type": "QuantitativeValue",
            value: 3,
            unitCode: "DAY",
          },
          itemOffered: { "@id": ids.leistung },
        })),
      },
      {
        "@type": "Person",
        "@id": ids.person,
        name: anbieter.sachverstaendiger,
        jobTitle:
          "Allgemein beeideter und gerichtlich zertifizierter Sachverständiger",
        worksFor: { "@id": ids.anbieter },
        knowsAbout: [
          "Versicherungsgutachten",
          "Brandschaden",
          "Wasserschaden",
          "Sturmschaden",
          "Unterversicherung",
          "Zeitwert und Neuwert",
          "Deckungsprüfung",
        ],
      },
      {
        "@type": "Service",
        "@id": ids.leistung,
        name: "Prüfung von Versicherungsgutachten",
        serviceType: "Unabhängige Begutachtung",
        description:
          "Unabhängige Prüfung eines von der Versicherung beauftragten Gutachtens: Positionen, Mengen, Einheitspreise, Bewertungsmethodik und Abgleich mit den anerkannten Regeln der Technik.",
        provider: { "@id": ids.anbieter },
        areaServed: { "@type": "Country", name: "Österreich" },
        /* Reine Online-Leistung: kein Standort, an den jemand kommen müsste. */
        serviceOutput: "Schriftliche Stellungnahme mit Ampel-Aussage",
      },
      {
        "@type": "HowTo",
        "@id": ids.ablauf,
        name: "Versicherungsgutachten prüfen lassen",
        description:
          "In drei Schritten von den eigenen Unterlagen zur schriftlichen Einschätzung durch einen beeideten Sachverständigen.",
        totalTime: "P3D",
        estimatedCost: {
          "@type": "MonetaryAmount",
          currency: "EUR",
          value: (produkte["erst-einschaetzung"].betragInCent / 100).toFixed(2),
        },
        step: ablaufSchritte.map((schritt, index) => ({
          "@type": "HowToStep",
          position: index + 1,
          name: schritt.titel,
          text: schritt.text,
          url: `${url}/#ablauf`,
        })),
      },
      {
        "@type": "FAQPage",
        "@id": ids.faq,
        isPartOf: { "@id": ids.website },
        mainEntity: fragen.map((eintrag) => ({
          "@type": "Question",
          name: eintrag.frage,
          acceptedAnswer: { "@type": "Answer", text: eintrag.antwort },
        })),
      },
    ],
  };
}
