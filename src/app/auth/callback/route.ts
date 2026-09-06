import { redirect } from "next/navigation";

import { istErlaubt } from "@/lib/auth";
import { createAuthClient } from "@/lib/supabase-auth/server";

/** Turns the code from the magic link into a session cookie. */
export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) redirect("/admin/login?fehler=1");

  const supabase = await createAuthClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !istErlaubt(data.user?.email)) {
    await supabase.auth.signOut();
    redirect("/admin/login?fehler=1");
  }

  redirect("/admin");
}
