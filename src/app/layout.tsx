import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import { getSiteUrl, siteBeschreibung, siteName } from "@/lib/site";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["600"],
  style: ["italic"],
});

const titel = "Versicherungsgutachten prüfen lassen | Gutachtencheck";

export const metadata: Metadata = {
  /* metadataBase macht die relativen Pfade unten auflösbar – ohne sie bliebe
     das OG-Bild eine relative URL, mit der kein Netzwerk etwas anfangen kann. */
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: titel,
    template: `%s | ${siteName}`,
  },
  description: siteBeschreibung,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "de_AT",
    url: "/",
    siteName,
    title: titel,
    description: siteBeschreibung,
  },
  twitter: {
    card: "summary_large_image",
    title: titel,
    description: siteBeschreibung,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="de-AT"
      className={`${manrope.variable} ${playfairDisplay.variable} h-full antialiased motion-safe:scroll-smooth`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
