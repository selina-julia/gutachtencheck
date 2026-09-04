import { Ablauf } from "@/components/sections/ablauf";
import { CtaBanner } from "@/components/sections/cta-banner";
import { Faq } from "@/components/sections/faq";
import { Hero } from "@/components/sections/hero";
import { Pricing } from "@/components/sections/pricing";
import { Services } from "@/components/sections/services";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { baueDatenGraph } from "@/lib/jsonld";

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(baueDatenGraph()) }}
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
