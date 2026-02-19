import { AdminNav } from "@/components/admin/admin-nav";
import { AdminCategoriesManager } from "@/components/admin/admin-categories-manager";
import { requireAdminOrRedirect } from "@/lib/guards/admin";
import { getCategoryRepository } from "@/lib/repositories";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  await requireAdminOrRedirect("/admin/categorias");

  const repository = getCategoryRepository();
  const categories = await repository.list();

  return (
    <div>
      <AdminNav currentPath="/admin/categorias" />
      <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 md:px-6">
        <div>
          <p className="text-sm text-zinc-600">Painel da Loja</p>
          <h1 className="text-3xl font-black uppercase">Categorias</h1>
        </div>
        <AdminCategoriesManager initialCategories={categories} />
      </main>
    </div>
  );
}
