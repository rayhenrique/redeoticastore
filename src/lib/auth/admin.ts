import {
  adminBypassAuth,
  adminEmailAllowlist,
  isSupabaseConfigured,
} from "@/lib/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export function isEmailAllowed(email?: string | null) {
  if (!email) return false;
  return adminEmailAllowlist.includes(email.toLowerCase());
}

export async function getCurrentAdminUser() {
  if (adminBypassAuth) {
    return {
      id: "mock-admin",
      email: adminEmailAllowlist[0] ?? "admin@redeotica.com.br",
      aud: "mock",
    };
  }

  if (!isSupabaseConfigured) return null;

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;
  if (!isEmailAllowed(user.email)) return null;

  return user;
}
