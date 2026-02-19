import { z } from "zod";

export const brandSchema = z.object({
  name: z.string().trim().min(2, "Nome obrigatório."),
  image: z
    .string()
    .trim()
    .min(1, "Imagem obrigatória.")
    .refine(
      (value) =>
        value.startsWith("/") ||
        /^https?:\/\/[\w.-]+(?:\:[0-9]+)?(?:[\/\?#].*)?$/i.test(value),
      "URL de imagem inválida.",
    ),
  active: z.boolean().default(true),
});

export type BrandSchema = z.infer<typeof brandSchema>;
