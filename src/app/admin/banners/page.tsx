import { AdminBannersManager } from "@/components/admin/admin-banners-manager";
import { AdminNav } from "@/components/admin/admin-nav";
import { requireAdminOrRedirect } from "@/lib/guards/admin";
import { getBannerRepository } from "@/lib/repositories";

export const dynamic = "force-dynamic";

export default async function AdminBannersPage() {
  await requireAdminOrRedirect("/admin/banners");
  const repository = getBannerRepository();
  const banners = await repository.list();

  return (
    <div>
      <AdminNav currentPath="/admin/banners" />
      <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 md:px-6">
        <div>
          <p className="text-sm text-zinc-600">Painel da Loja</p>
          <h1 className="text-3xl font-black uppercase">Banners da Home</h1>
        </div>
        <AdminBannersManager initialBanners={banners} />
      </main>
    </div>
  );
}
