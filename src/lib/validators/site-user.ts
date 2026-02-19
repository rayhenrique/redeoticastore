import { z } from "zod";

export const siteUserSchema = z.object({
  name: z.string().trim().min(2, "Nome obrigatório."),
  email: z.string().trim().email("E-mail inválido."),
  role: z.enum(["admin", "seller"]),
  active: z.boolean().default(true),
});

export type SiteUserSchema = z.infer<typeof siteUserSchema>;
