import { createServerSupabaseClient } from "@/lib/supabase/server";
import type {
  CategoryRepository,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/lib/repositories/interfaces";
import type { ProductCategoryItem } from "@/types/domain";

function mapCategory(row: Record<string, unknown>): ProductCategoryItem {
  return {
    id: String(row.id),
    created_at: String(row.created_at),
    name: String(row.name),
    slug: String(row.slug),
    icon: row.icon ? String(row.icon) : null,
    image: row.image ? String(row.image) : null,
    active: Boolean(row.active),
  };
}

export const supabaseCategoryRepository: CategoryRepository = {
  async list() {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("product_categories")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return (data ?? []).map((row) => mapCategory(row));
  },

  async create(input: CreateCategoryInput) {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("product_categories")
      .insert(input)
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return mapCategory(data);
  },

  async update(id: string, input: UpdateCategoryInput) {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("product_categories")
      .update(input)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return mapCategory(data);
  },

  async remove(id: string) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase
      .from("product_categories")
      .delete()
      .eq("id", id);
    if (error) throw new Error(error.message);
  },
};
