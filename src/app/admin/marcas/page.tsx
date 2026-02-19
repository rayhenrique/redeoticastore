import { AdminBrandsManager } from "@/components/admin/admin-brands-manager";
import { AdminNav } from "@/components/admin/admin-nav";
import { requireAdminOrRedirect } from "@/lib/guards/admin";
import { getBrandRepository } from "@/lib/repositories";

export const dynamic = "force-dynamic";

export default async function AdminBrandsPage() {
  await requireAdminOrRedirect("/admin/marcas");
  const repository = getBrandRepository();
  const brands = await repository.list();

  return (
    <div>
      <AdminNav currentPath="/admin/marcas" />
      <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 md:px-6">
        <div>
          <p className="text-sm text-zinc-600">Painel da Loja</p>
          <h1 className="text-3xl font-black uppercase">Marcas</h1>
        </div>
        <AdminBrandsManager initialBrands={brands} />
      </main>
    </div>
  );
}
