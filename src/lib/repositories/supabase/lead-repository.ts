import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { CreateLeadInput, LeadRepository } from "@/lib/repositories/interfaces";
import type { Lead, LeadProductSnapshot, LeadStatus } from "@/types/domain";

function mapLead(row: Record<string, unknown>): Lead {
  return {
    id: String(row.id),
    created_at: String(row.created_at),
    name: String(row.name),
    whatsapp: String(row.whatsapp),
    status: (row.status ?? "new") as LeadStatus,
    products_interest: Array.isArray(row.products_interest)
      ? (row.products_interest as LeadProductSnapshot[])
      : [],
  };
}

export const supabaseLeadRepository: LeadRepository = {
  async list() {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return (data ?? []).map((row) => mapLead(row));
  },

  async create(input: CreateLeadInput) {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("leads")
      .insert({
        name: input.name,
        whatsapp: input.whatsapp,
        status: input.status ?? "new",
        products_interest: input.products_interest,
      })
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return mapLead(data);
  },

  async update(id: string, input: Partial<CreateLeadInput>) {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("leads")
      .update({
        name: input.name,
        whatsapp: input.whatsapp,
        status: input.status,
        products_interest: input.products_interest,
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return mapLead(data);
  },

  async remove(id: string) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },

  async updateStatus(id: string, status: LeadStatus) {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("leads")
      .update({ status })
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return mapLead(data);
  },

  async countNewToday() {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const supabase = await createServerSupabaseClient();
    const { count, error } = await supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("status", "new")
      .gte("created_at", start.toISOString());

    if (error) throw new Error(error.message);
    return count ?? 0;
  },
};
