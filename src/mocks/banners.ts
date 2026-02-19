import type { HomeBanner } from "@/types/domain";

export const defaultHomeBanners: HomeBanner[] = [
  {
    id: "banner-idade",
    created_at: "2026-02-18T10:20:00.000Z",
    title: "SUA IDADE, SEU DESCONTO",
    subtitle: "Óculos completos com desconto de acordo com sua idade.",
    cta: "Ver ofertas",
    image: "/branding/07.jpg",
    position: 1,
    active: true,
  },
  {
    id: "banner-carnaval",
    created_at: "2026-02-18T10:21:00.000Z",
    title: "CARNAVAL MOOD",
    subtitle: "Neste carnaval, seus olhos também merecem cuidado.",
    cta: "Explorar coleção",
    image: "/branding/08.jpg",
    position: 2,
    active: true,
  },
];

export const categoryShortcuts = [
  { id: "solar", label: "Solar", href: "/catalogo?category=solar" },
  { id: "grau", label: "Grau", href: "/catalogo?category=grau" },
  { id: "infantil", label: "Infantil", href: "/catalogo?mockCategory=infantil" },
  {
    id: "acessorios",
    label: "Acessórios",
    href: "/catalogo?mockCategory=acessorios",
  },
];
