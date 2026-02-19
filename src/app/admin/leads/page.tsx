import { AdminNav } from "@/components/admin/admin-nav";
import { LeadsKanban } from "@/components/admin/leads-kanban";
import { requireAdminOrRedirect } from "@/lib/guards/admin";
import { getLeadRepository } from "@/lib/repositories";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  await requireAdminOrRedirect("/admin/leads");
  const leadRepository = getLeadRepository();
  const leads = await leadRepository.list();

  return (
    <div>
      <AdminNav currentPath="/admin/leads" />
      <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 md:px-6">
        <div>
          <p className="text-sm text-zinc-600">Painel da Loja</p>
          <h1 className="text-3xl font-black uppercase">CRM de Leads</h1>
        </div>
        <LeadsKanban initialLeads={leads} />
      </main>
    </div>
  );
}
