"use server";

import { redirect } from "next/navigation";

import { createAuthClient } from "@/lib/supabase-auth/server";

export async function meldeAb(): Promise<void> {
  const supabase = await createAuthClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
