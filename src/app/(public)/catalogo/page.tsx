import { CatalogFilters } from "@/components/public/catalog-filters";
import { ProductCard } from "@/components/public/product-card";
import { isMockMode } from "@/lib/config";
import { getProductRepository } from "@/lib/repositories";

interface CatalogPageProps {
  searchParams: Promise<{
    q?: string;
    brand?: string;
    category?: string;
  }>;
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams;
  const repository = getProductRepository();

  const [products, allProducts] = await Promise.all([
    repository.list({
      active: true,
      q: params.q,
      brand: params.brand,
      category: params.category,
    }),
    repository.list({ active: true }),
  ]);

  const brands = [...new Set(allProducts.map((product) => product.brand))];
  const categories = [...new Set(allProducts.map((product) => product.category))];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-zinc-600">Vitrine digital</p>
        <h1 className="text-3xl font-black uppercase">Catálogo</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-12 md:items-start">
        <div className="md:col-span-4 lg:col-span-3">
          <CatalogFilters
            brands={brands}
            categories={categories}
            showMockHints={isMockMode}
          />
        </div>

        <section className="min-w-0 space-y-4 md:col-span-8 lg:col-span-9">
          <p className="text-sm text-zinc-600">{products.length} produtos encontrados</p>
          {products.length ? (
            <div className="grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center text-zinc-600">
              Nenhum produto encontrado com os filtros selecionados.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
