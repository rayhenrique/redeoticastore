import { z } from "zod";

export const checkoutItemSchema = z.object({
  productId: z.string().min(1, "Produto inválido."),
  quantity: z.coerce
    .number()
    .int("Quantidade inválida.")
    .min(1, "Quantidade deve ser maior que zero."),
});

export const checkoutSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Informe seu nome.")
    .max(120, "Nome muito longo."),
  whatsapp: z
    .string()
    .trim()
    .regex(/^\+?[0-9()\-\s]{10,20}$/, "WhatsApp inválido."),
  items: z.array(checkoutItemSchema).min(1, "Adicione ao menos um item."),
});

export type CheckoutSchema = z.infer<typeof checkoutSchema>;
