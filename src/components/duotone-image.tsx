import Image, { type ImageProps } from "next/image";

import { cn } from "@/lib/utils";

type DuotoneImageProps = ImageProps & {
  /** Klassen für den Rahmen — hier gehören Seitenverhältnis und Radius hin. */
  className?: string;
  /** Zusätzliche Klassen für das Bild selbst, etwa object-position. */
  imageClassName?: string;
};

/**
 * Bild im Marken-Duoton. Das Foto wird entsättigt, die erste Ebene legt den
 * Blaustich darüber (mix-blend-color nimmt Farbe und Sättigung von der Ebene,
 * die Helligkeit bleibt vom Foto), die zweite vertieft die Schatten mit dem
 * dunklen Navy. `isolate` hält das Blending im Rahmen.
 */
export function DuotoneImage({
  alt,
  className,
  imageClassName,
  ...props
}: DuotoneImageProps) {
  return (
    <div className={cn("relative isolate overflow-hidden", className)}>
      <Image
        alt={alt}
        {...props}
        className={cn("size-full object-cover grayscale", imageClassName)}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-primary/20 mix-blend-color"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-brand-deep/30 mix-blend-multiply"
      />
    </div>
  );
}
