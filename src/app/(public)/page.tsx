import Image from "next/image";
import Link from "next/link";
import { HeroCarousel } from "@/components/public/hero-carousel";
import { CategoryShortcuts } from "@/components/public/category-shortcuts";
import { BrandsCarousel } from "@/components/public/brands-carousel";
import { ProductCard } from "@/components/public/product-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { defaultHomeBanners } from "@/mocks/banners";
import {
  getBannerRepository,
  getBrandRepository,
  getCategoryRepository,
  getProductRepository,
} from "@/lib/repositories";

export default async function HomePage() {
  const productRepository = getProductRepository();
  const bannerRepository = getBannerRepository();
  const brandRepository = getBrandRepository();
  const categoryRepository = getCategoryRepository();

  const [products, banners, brands, categories] = await Promise.all([
    productRepository.list({ active: true }),
    bannerRepository.list({ active: true }),
    brandRepository.list({ active: true }),
    categoryRepository.list(),
  ]);

  const homeBanners = banners.length ? banners : defaultHomeBanners;
  const activeCategories = categories.filter((category) => category.active);
  const highlights = products.slice(0, 4);
  const visibleBrands = brands.length
    ? brands
    : [...new Set(products.map((product) => product.brand))].map((name) => ({
        id: `fallback-${name}`,
        created_at: new Date().toISOString(),
        name,
        image: "/branding/05.jpg",
        active: true,
      }));

  return (
    <div className="home-ambient space-y-10">
      <div className="reveal-section" style={{ ["--reveal-delay" as string]: "40ms" }}>
        <HeroCarousel banners={homeBanners} />
      </div>

      <section
        className="reveal-section space-y-4"
        style={{ ["--reveal-delay" as string]: "120ms" }}
      >
        <h2 className="text-2xl font-black uppercase">Navegação Rápida</h2>
        <CategoryShortcuts categories={activeCategories} />
      </section>

      <section
        className="reveal-section space-y-4"
        style={{ ["--reveal-delay" as string]: "180ms" }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black uppercase">Destaques da Semana</h2>
          <Button asChild variant="outline">
            <Link href="/catalogo">Ver catálogo</Link>
          </Button>
        </div>
        <div className="stagger-grid grid grid-cols-2 gap-4 lg:grid-cols-4">
          {highlights.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section
        className="reveal-section space-y-4"
        style={{ ["--reveal-delay" as string]: "240ms" }}
      >
        <h2 className="text-2xl font-black uppercase">Marcas</h2>
        <BrandsCarousel brands={visibleBrands} />
      </section>

      <section className="reveal-section" style={{ ["--reveal-delay" as string]: "300ms" }}>
        <Card className="interactive-lift overflow-hidden">
          <CardContent className="grid gap-4 p-0 md:grid-cols-2">
            <div className="relative min-h-[260px]">
              <Image
                src="/branding/06.jpg"
                alt="Rede Ótica Store"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-4 p-6">
              <h2 className="text-2xl font-black uppercase">Sobre a Rede Ótica Store</h2>
              <p className="text-zinc-700">
                Presença local forte em Teotônio Vilela e Junqueiro com foco em
                atendimento rápido e consultivo.
              </p>
              <p className="text-zinc-700">
                Escolha seus modelos favoritos e finalize no WhatsApp com sua lista de
                interesse pronta para atendimento.
              </p>
              <Button asChild>
                <Link href="/catalogo">Começar agora</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
