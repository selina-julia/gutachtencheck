import Link from "next/link";
import { Mail } from "lucide-react";

const navigation = [
  { label: "Leistungen", href: "#leistungen" },
  { label: "Ablauf", href: "#ablauf" },
  { label: "Über mich", href: "/ueber-mich" },
  { label: "Rechtsschutz", href: "/rechtsschutz" },
  { label: "FAQ", href: "#faq" },
  { label: "Kontakt", href: "/kontakt" },
];

const rechtliches = [
  { label: "Impressum", href: "/impressum" },
  { label: "Datenschutz", href: "/datenschutz" },
  { label: "AGB", href: "/agb" },
  { label: "Widerrufsbelehrung", href: "/widerruf" },
];

export function SiteFooter() {
  return (
    <footer className="bg-background">
      <div className="mx-auto max-w-[1520px] px-5 sm:px-8">
        <div className="flex flex-col gap-8 border-t border-border py-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
          <Link
            href="/"
            className="rounded-sm text-xl font-bold tracking-[-0.03em] text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            Gutachtencheck<span className="text-primary">.</span>
          </Link>

          <nav
            aria-label="Fußzeilen-Navigation"
            className="flex flex-wrap gap-x-8 gap-y-3"
          >
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-sm text-sm text-foreground/75 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/kontakt"
            aria-label="Kontakt aufnehmen"
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-colors hover:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <Mail className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="flex flex-col gap-4 border-t border-border py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Gutachtencheck. Alle Rechte
            vorbehalten.
          </p>
          <nav
            aria-label="Rechtliches"
            className="flex flex-wrap gap-x-6 gap-y-2"
          >
            {rechtliches.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-sm text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
