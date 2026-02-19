import { z } from "zod";

export const productSchema = z.object({
  name: z.string().trim().min(2, "Nome obrigatório."),
  description: z.string().trim().nullable().optional(),
  price: z.coerce.number().min(0).nullable().optional(),
  brand: z.string().trim().min(2, "Marca obrigatória."),
  category: z.string().trim().min(2, "Categoria obrigatória."),
  active: z.boolean().default(true),
  images: z
    .array(
      z
        .string()
        .trim()
        .min(1, "Informe ao menos uma imagem.")
        .refine(
          (value) =>
            value.startsWith("/") ||
            /^https?:\/\/[\w.-]+(?:\:[0-9]+)?(?:[\/\?#].*)?$/i.test(value),
          "URL de imagem inválida.",
        ),
    )
    .min(1),
});

export type ProductSchema = z.infer<typeof productSchema>;
