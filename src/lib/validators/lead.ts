import { z } from "zod";

export const leadStatusSchema = z.enum(["new", "contacted", "sold", "archived"]);

const leadProductSnapshotSchema = z.object({
  productId: z.string().trim().min(1, "Produto inválido."),
  name: z.string().trim().min(1, "Nome do produto obrigatório."),
  price: z.coerce.number().nullable(),
  url: z.string().trim().url("URL do produto inválida."),
  quantity: z.coerce.number().int().min(1, "Quantidade inválida."),
});

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Nome obrigatório.").max(120, "Nome muito longo."),
  whatsapp: z
    .string()
    .trim()
    .regex(/^\+?[0-9()\-\s]{10,20}$/, "WhatsApp inválido."),
  status: leadStatusSchema.default("new"),
  products_interest: z.array(leadProductSnapshotSchema).default([]),
});

export const updateLeadSchema = leadSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "Nenhum campo para atualizar.",
  });

export const updateLeadStatusSchema = z.object({
  status: leadStatusSchema,
});

export type UpdateLeadStatusSchema = z.infer<typeof updateLeadStatusSchema>;
export type LeadSchema = z.infer<typeof leadSchema>;
export type UpdateLeadSchema = z.infer<typeof updateLeadSchema>;
