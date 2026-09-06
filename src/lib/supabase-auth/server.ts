import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Supabase client bound to the request cookies. Used only for the owner's
 * session — customer data is still read with the service role.
 */
export async function createAuthClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (eintraege) => {
          try {
            for (const { name, value, options } of eintraege) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // In Server Components lassen sich keine Cookies setzen. Die
            // Erneuerung übernimmt dann der nächste Route Handler.
          }
        },
      },
    },
  );
}
