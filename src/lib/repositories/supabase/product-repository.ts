import { createServerSupabaseClient } from "@/lib/supabase/server";
import type {
  CreateProductInput,
  ProductRepository,
  UpdateProductInput,
} from "@/lib/repositories/interfaces";
import type { Product } from "@/types/domain";

function normalizePrice(value: unknown) {
  if (value === null || value === undefined) return null;
  if (typeof value === "number") return value;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function mapProduct(row: Record<string, unknown>): Product {
  return {
    id: String(row.id),
    created_at: String(row.created_at),
    name: String(row.name),
    description: row.description ? String(row.description) : null,
    price: normalizePrice(row.price),
    images: Array.isArray(row.images)
      ? row.images.map((item) => String(item))
      : [],
    brand: String(row.brand),
    category: String(row.category),
    active: Boolean(row.active),
  };
}

export const supabaseProductRepository: ProductRepository = {
  async list(filters) {
    const supabase = await createServerSupabaseClient();
    let query = supabase.from("products").select("*");

    if (typeof filters?.active === "boolean") query = query.eq("active", filters.active);
    if (filters?.category) query = query.eq("category", filters.category);
    if (filters?.brand) query = query.ilike("brand", filters.brand);
    if (filters?.q) query = query.or(`name.ilike.%${filters.q}%,brand.ilike.%${filters.q}%`);

    const { data, error } = await query.order("created_at", { ascending: false });
    if (error) throw new Error(error.message);

    return (data ?? []).map((row) => mapProduct(row));
  },

  async listByIds(ids) {
    if (!ids.length) return [];
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .in("id", ids)
      .eq("active", true);

    if (error) throw new Error(error.message);
    return (data ?? []).map((row) => mapProduct(row));
  },

  async findById(id) {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) return null;

    return mapProduct(data);
  },

  async create(input: CreateProductInput) {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("products")
      .insert(input)
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return mapProduct(data);
  },

  async update(id: string, input: UpdateProductInput) {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("products")
      .update(input)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return mapProduct(data);
  },

  async remove(id: string) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },
};
