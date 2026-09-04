export type NavigationsPunkt = { label: string; href: string };

/** Wird von Kopfzeile, mobilem Menü und Fußzeile gemeinsam genutzt. */
export const hauptnavigation: NavigationsPunkt[] = [
  { label: "Leistungen", href: "#leistungen" },
  { label: "Ablauf", href: "#ablauf" },
  { label: "Über mich", href: "/ueber-mich" },
  { label: "Rechtsschutz", href: "/rechtsschutz" },
  { label: "FAQ", href: "#faq" },
  { label: "Kontakt", href: "/kontakt" },
];

export const rechtliches: NavigationsPunkt[] = [
  { label: "Impressum", href: "/impressum" },
  { label: "Datenschutz", href: "/datenschutz" },
  { label: "AGB", href: "/agb" },
  { label: "Widerrufsbelehrung", href: "/widerruf" },
];
