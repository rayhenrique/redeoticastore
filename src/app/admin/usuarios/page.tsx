import { AdminNav } from "@/components/admin/admin-nav";
import { AdminUsersManager } from "@/components/admin/admin-users-manager";
import { requireAdminOrRedirect } from "@/lib/guards/admin";
import { getSiteUserRepository } from "@/lib/repositories";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  await requireAdminOrRedirect("/admin/usuarios");

  const repository = getSiteUserRepository();
  const users = await repository.list();

  return (
    <div>
      <AdminNav currentPath="/admin/usuarios" />
      <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 md:px-6">
        <div>
          <p className="text-sm text-zinc-600">Painel da Loja</p>
          <h1 className="text-3xl font-black uppercase">Usuários</h1>
        </div>
        <AdminUsersManager initialUsers={users} />
      </main>
    </div>
  );
}
