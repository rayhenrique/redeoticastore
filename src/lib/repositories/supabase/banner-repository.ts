import { createServerSupabaseClient } from "@/lib/supabase/server";
import type {
  BannerRepository,
  CreateBannerInput,
  UpdateBannerInput,
} from "@/lib/repositories/interfaces";
import type { HomeBanner } from "@/types/domain";

function mapBanner(row: Record<string, unknown>): HomeBanner {
  return {
    id: String(row.id),
    created_at: String(row.created_at),
    title: String(row.title),
    subtitle: String(row.subtitle ?? ""),
    cta: String(row.cta),
    image: String(row.image),
    position: Number(row.position ?? 1),
    active: Boolean(row.active),
  };
}

export const supabaseBannerRepository: BannerRepository = {
  async list(filters) {
    const supabase = await createServerSupabaseClient();
    let query = supabase.from("home_banners").select("*");

    if (typeof filters?.active === "boolean") query = query.eq("active", filters.active);

    const { data, error } = await query
      .order("position", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return (data ?? []).map((row) => mapBanner(row));
  },

  async create(input: CreateBannerInput) {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("home_banners")
      .insert(input)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return mapBanner(data);
  },

  async update(id: string, input: UpdateBannerInput) {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("home_banners")
      .update(input)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return mapBanner(data);
  },

  async remove(id: string) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from("home_banners").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },
};
