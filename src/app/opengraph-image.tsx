import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

export const alt =
  "Gutachtencheck — Ihr Versicherungsgutachten, unabhängig geprüft.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Die Marken-Töne als Hex, weil der Bild-Renderer kein oklch versteht.
   Umgerechnet aus den Tokens in globals.css. */
const navy = "#020D3B";
const blau = "#3860C2";
const hell = "#9BB7F2";

async function schrift(datei: string): Promise<ArrayBuffer> {
  const puffer = await readFile(join(process.cwd(), "src/app/fonts", datei));
  return Uint8Array.from(puffer).buffer;
}

export default async function OgBild(): Promise<ImageResponse> {
  const [manrope, playfair] = await Promise.all([
    schrift("manrope-extrabold.ttf"),
    schrift("playfair-italic.ttf"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: navy,
          backgroundImage: `radial-gradient(60% 110% at 100% 40%, ${blau} 0%, ${navy} 68%)`,
          fontFamily: "Manrope",
          color: "#FFFFFF",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, letterSpacing: "-0.02em" }}>
          <span>Gutachtencheck</span>
          <span style={{ color: hell }}>.</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 76,
            lineHeight: 1.08,
            letterSpacing: "-0.035em",
          }}
        >
          <span>Ihr Versicherungsgutachten,</span>
          <div style={{ display: "flex" }}>
            <span>unabhängig&nbsp;</span>
            <span style={{ fontFamily: "Playfair Display", fontStyle: "italic" }}>
              geprüft.
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            fontSize: 25,
            color: "rgba(255,255,255,0.72)",
          }}
        >
          <span>Beeideter Sachverständiger</span>
          <span style={{ color: hell }}>·</span>
          <span>Fixpreis 149 €</span>
          <span style={{ color: hell }}>·</span>
          <span>Ergebnis in 3 Werktagen</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Manrope", data: manrope, weight: 800, style: "normal" },
        {
          name: "Playfair Display",
          data: playfair,
          weight: 600,
          style: "italic",
        },
      ],
    },
  );
}
