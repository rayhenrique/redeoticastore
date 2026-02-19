import { z } from "zod";

export const bannerSchema = z.object({
  title: z.string().trim().min(3, "Título obrigatório."),
  subtitle: z.string().trim().min(3, "Subtítulo obrigatório."),
  cta: z.string().trim().min(2, "CTA obrigatório."),
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
  position: z.coerce.number().int().min(1, "Posição inválida."),
  active: z.boolean().default(true),
});

export type BannerSchema = z.infer<typeof bannerSchema>;
