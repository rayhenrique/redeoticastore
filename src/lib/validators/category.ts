import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Nome obrigatório."),
  slug: z
    .string()
    .trim()
    .min(2, "Slug obrigatório.")
    .regex(/^[a-z0-9-]+$/, "Slug deve usar apenas letras minúsculas, números e hífen."),
  icon: z.string().trim().nullable().optional(),
  image: z
    .string()
    .trim()
    .nullable()
    .optional()
    .refine(
      (value) =>
        !value ||
        value.startsWith("/") ||
        /^https?:\/\/[\w.-]+(?:\:[0-9]+)?(?:[\/\?#].*)?$/i.test(value),
      "URL de imagem inválida.",
    ),
  active: z.boolean().default(true),
})
  .refine((data) => Boolean(data.icon || data.image), {
    path: ["icon"],
    message: "Selecione um ícone ou envie uma imagem para a categoria.",
  })
  .transform((data) => ({
    ...data,
    icon: data.icon ?? null,
    image: data.image ?? null,
  }));

export type CategorySchema = z.infer<typeof categorySchema>;
