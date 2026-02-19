import type { Lead } from "@/types/domain";

export const mockLeads: Lead[] = [
  {
    id: "f6666666-6666-4666-8666-666666666666",
    created_at: "2026-02-18T12:00:00.000Z",
    name: "Maria Souza",
    whatsapp: "5582999551122",
    status: "new",
    products_interest: [
      {
        productId: "a1111111-1111-4111-8111-111111111111",
        name: "Solar Street Black",
        price: 289.9,
        url: "http://localhost:3000/produto/a1111111-1111-4111-8111-111111111111",
        quantity: 1,
      },
    ],
  },
  {
    id: "g7777777-7777-4777-8777-777777777777",
    created_at: "2026-02-18T14:20:00.000Z",
    name: "Joao Lima",
    whatsapp: "5582999123344",
    status: "contacted",
    products_interest: [
      {
        productId: "d4444444-4444-4444-8444-444444444444",
        name: "Grau Urban Slim",
        price: 319.9,
        url: "http://localhost:3000/produto/d4444444-4444-4444-8444-444444444444",
        quantity: 2,
      },
    ],
  },
];
