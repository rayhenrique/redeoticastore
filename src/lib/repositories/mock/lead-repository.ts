import { mockLeads } from "@/mocks/leads";
import type {
  CreateLeadInput,
  LeadRepository,
} from "@/lib/repositories/interfaces";
import type { Lead, LeadStatus } from "@/types/domain";

let leadsState = [...mockLeads];

export const mockLeadRepository: LeadRepository = {
  async list() {
    return leadsState.sort(
      (a, b) => +new Date(b.created_at) - +new Date(a.created_at),
    );
  },

  async create(input: CreateLeadInput) {
    const created: Lead = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      name: input.name,
      whatsapp: input.whatsapp,
      status: input.status ?? "new",
      products_interest: input.products_interest,
    };

    leadsState = [created, ...leadsState];
    return created;
  },

  async update(id: string, input: Partial<CreateLeadInput>) {
    const lead = leadsState.find((item) => item.id === id);
    if (!lead) {
      throw new Error("Lead não encontrado.");
    }

    const updated: Lead = {
      ...lead,
      ...input,
      status: input.status ?? lead.status,
      products_interest: input.products_interest ?? lead.products_interest,
    };

    leadsState = leadsState.map((item) => (item.id === id ? updated : item));
    return updated;
  },

  async remove(id: string) {
    const exists = leadsState.some((item) => item.id === id);
    if (!exists) {
      throw new Error("Lead não encontrado.");
    }

    leadsState = leadsState.filter((item) => item.id !== id);
  },

  async updateStatus(id: string, status: LeadStatus) {
    const lead = leadsState.find((item) => item.id === id);
    if (!lead) {
      throw new Error("Lead não encontrado.");
    }

    const updated = { ...lead, status };
    leadsState = leadsState.map((item) => (item.id === id ? updated : item));
    return updated;
  },

  async countNewToday() {
    const now = new Date();

    return leadsState.filter((lead) => {
      if (lead.status !== "new") return false;
      const date = new Date(lead.created_at);
      return (
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    }).length;
  },
};
