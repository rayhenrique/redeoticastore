import { createServerSupabaseClient } from "@/lib/supabase/server";
import type {
  BrandRepository,
  CreateBrandInput,
  UpdateBrandInput,
} from "@/lib/repositories/interfaces";
import type { BrandItem } from "@/types/domain";

function mapBrand(row: Record<string, unknown>): BrandItem {
  return {
    id: String(row.id),
    created_at: String(row.created_at),
    name: String(row.name),
    image: String(row.image),
    active: Boolean(row.active),
  };
}

export const supabaseBrandRepository: BrandRepository = {
  async list(filters) {
    const supabase = await createServerSupabaseClient();
    let query = supabase.from("product_brands").select("*");

    if (typeof filters?.active === "boolean") query = query.eq("active", filters.active);

    const { data, error } = await query.order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map((row) => mapBrand(row));
  },

  async create(input: CreateBrandInput) {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("product_brands")
      .insert(input)
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return mapBrand(data);
  },

  async update(id: string, input: UpdateBrandInput) {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("product_brands")
      .update(input)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return mapBrand(data);
  },

  async remove(id: string) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from("product_brands").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },
};
