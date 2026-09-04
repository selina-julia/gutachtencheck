import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      /* Die Erfolgsseite trägt bereits noindex, hier kommt der Crawler gar
         nicht erst hin – sie ist ohne Stripe-Session ohnehin inhaltsleer. */
      disallow: "/pruefung/",
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
