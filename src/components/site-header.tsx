import Link from "next/link";

import { MobileMenu } from "@/components/mobile-menu";
import { hauptnavigation } from "@/lib/navigation";

export function SiteHeader() {
  return (
    <header className="bg-background">
      <div className="mx-auto flex h-20 max-w-[1520px] items-center justify-between gap-6 px-5 sm:px-8">
        <Link
          href="/"
          className="rounded-sm text-xl font-bold tracking-[-0.03em] text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring sm:text-2xl"
        >
          Gutachtencheck<span className="text-primary">.</span>
        </Link>

        <nav
          aria-label="Hauptnavigation"
          className="hidden items-center gap-8 lg:flex"
        >
          {hauptnavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-sm text-sm text-foreground/75 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <MobileMenu />
      </div>
    </header>
  );
}
