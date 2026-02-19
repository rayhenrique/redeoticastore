import type { SiteUser } from "@/types/domain";

export const mockUsers: SiteUser[] = [
  {
    id: "user-11111111-1111-4111-8111-111111111111",
    created_at: "2026-02-18T09:10:00.000Z",
    name: "Admin Principal",
    email: "admin@redeotica.com.br",
    role: "admin",
    active: true,
  },
  {
    id: "user-22222222-2222-4222-8222-222222222222",
    created_at: "2026-02-18T09:20:00.000Z",
    name: "Vendedor Loja",
    email: "vendedor@redeotica.com.br",
    role: "seller",
    active: true,
  },
];
