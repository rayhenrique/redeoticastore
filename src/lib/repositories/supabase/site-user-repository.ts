import { createServerSupabaseClient } from "@/lib/supabase/server";
import type {
  CreateSiteUserInput,
  SiteUserRepository,
  UpdateSiteUserInput,
} from "@/lib/repositories/interfaces";
import type { SiteUser, SiteUserRole } from "@/types/domain";

function mapSiteUser(row: Record<string, unknown>): SiteUser {
  return {
    id: String(row.id),
    created_at: String(row.created_at),
    name: String(row.name),
    email: String(row.email),
    role: (row.role ?? "seller") as SiteUserRole,
    active: Boolean(row.active),
  };
}

export const supabaseSiteUserRepository: SiteUserRepository = {
  async list() {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("admin_users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return (data ?? []).map((row) => mapSiteUser(row));
  },

  async create(input: CreateSiteUserInput) {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("admin_users")
      .insert(input)
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return mapSiteUser(data);
  },

  async update(id: string, input: UpdateSiteUserInput) {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("admin_users")
      .update(input)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return mapSiteUser(data);
  },

  async remove(id: string) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from("admin_users").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },
};
