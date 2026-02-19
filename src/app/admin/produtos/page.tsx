import { AdminNav } from "@/components/admin/admin-nav";
import { AdminProductsManager } from "@/components/admin/admin-products-manager";
import { requireAdminOrRedirect } from "@/lib/guards/admin";
import { getCategoryRepository, getProductRepository } from "@/lib/repositories";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  await requireAdminOrRedirect("/admin/produtos");

  const productRepository = getProductRepository();
  const categoryRepository = getCategoryRepository();
  const [products, categories] = await Promise.all([
    productRepository.list(),
    categoryRepository.list(),
  ]);

  return (
    <div>
      <AdminNav currentPath="/admin/produtos" />
      <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 md:px-6">
        <div>
          <p className="text-sm text-zinc-600">Painel da Loja</p>
          <h1 className="text-3xl font-black uppercase">Produtos</h1>
        </div>
        <AdminProductsManager
          initialProducts={products}
          initialCategories={categories}
        />
      </main>
    </div>
  );
}
