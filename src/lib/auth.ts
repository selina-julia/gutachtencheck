import "server-only";

import { redirect } from "next/navigation";

import { createAuthClient } from "@/lib/supabase-auth/server";

/**
 * Addresses allowed into the admin area. Supabase alone is not enough: a
 * project accepts sign-ups by default, and anyone signed up counts as
 * "authenticated". The allowlist is the actual gate.
 */
export function erlaubteAdressen(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((eintrag) => eintrag.trim().toLowerCase())
    .filter(Boolean);
}

export function istErlaubt(email: string | null | undefined): boolean {
  if (!email) return false;
  return erlaubteAdressen().includes(email.toLowerCase());
}

/** Returns the signed-in owner, or sends them to the login page. */
export async function verlangeInhaber(): Promise<{ email: string }> {
  const supabase = await createAuthClient();
  const { data } = await supabase.auth.getUser();

  if (!istErlaubt(data.user?.email)) {
    redirect("/admin/login");
  }

  return { email: data.user!.email! };
}
