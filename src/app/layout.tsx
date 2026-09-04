import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Gutachtencheck — Versicherungsgutachten unabhängig prüfen lassen",
  description:
    "Nach Brand-, Wasser-, Sturm- oder Haftpflichtschaden: Ihr Versicherungsgutachten wird von einem allgemein beeideten und gerichtlich zertifizierten Sachverständigen geprüft. Ausschließlich online, österreichweit.",
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
