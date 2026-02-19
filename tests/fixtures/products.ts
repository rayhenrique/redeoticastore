import type { Product } from "@/types/domain";

export const fixtureProducts: Product[] = [
  {
    id: "a1111111-1111-4111-8111-111111111111",
    created_at: "2026-02-18T10:30:00.000Z",
    name: "Solar Street Black",
    description: "Armação solar retangular com acabamento fosco.",
    price: 289.9,
    images: ["/branding/08.jpg", "/branding/06.jpg"],
    brand: "Rede Ótica Store",
    category: "solar",
    active: true,
  },
];
