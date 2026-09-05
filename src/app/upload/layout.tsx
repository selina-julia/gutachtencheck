import Link from "next/link";

import { rechtliches } from "@/lib/navigation";

/**
 * Eigene, reduzierte Hülle für den Upload: keine Navigation, kein großer
 * Footer. Wer hier ankommt, hat bereits bezahlt und soll genau eine Sache tun.
 * Impressum und Datenschutz bleiben erreichbar — das verlangt das ECG von
 * jeder Seite.
 */
export default function UploadLayout({
  children,
}: LayoutProps<"/upload">) {
  return (
    <div className="flex min-h-full flex-col bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-18 max-w-[1520px] items-center px-5 sm:px-8">
          <Link
            href="/"
            className="rounded-sm text-lg font-bold tracking-[-0.03em] text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            Gutachtencheck<span className="text-primary">.</span>
          </Link>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-[1520px] flex-col gap-3 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Gutachtencheck
          </p>
          <nav aria-label="Rechtliches" className="flex flex-wrap gap-x-5 gap-y-2">
            {rechtliches
              .filter((punkt) => ["/impressum", "/datenschutz"].includes(punkt.href))
              .map((punkt) => (
                <Link
                  key={punkt.href}
                  href={punkt.href}
                  className="rounded-sm text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                >
                  {punkt.label}
                </Link>
              ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
