import type { LeadStatus } from "@/types/domain";

export interface CheckoutItemInput {
  productId: string;
  quantity: number;
}

export interface CheckoutRequest {
  name: string;
  whatsapp: string;
  items: CheckoutItemInput[];
}

export interface CheckoutResponse {
  leadId: string;
  whatsappUrl: string;
}

export interface UpdateLeadStatusRequest {
  status: LeadStatus;
}

export interface UpdateLeadStatusResponse {
  id: string;
  status: LeadStatus;
  updatedAt: string;
}
