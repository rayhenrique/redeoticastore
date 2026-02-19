import Link from "next/link";
import {
  FolderKanban,
  GalleryHorizontal,
  MessageSquare,
  Package,
  Tags,
  Users,
} from "lucide-react";
import { AdminNav } from "@/components/admin/admin-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAdminOrRedirect } from "@/lib/guards/admin";
import { getLeadRepository } from "@/lib/repositories";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await requireAdminOrRedirect("/admin");

  const leadRepository = getLeadRepository();
  const [newToday, leads] = await Promise.all([
    leadRepository.countNewToday(),
    leadRepository.list(),
  ]);

  const soldCount = leads.filter((lead) => lead.status === "sold").length;

  return (
    <div>
      <AdminNav currentPath="/admin" />
      <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 md:px-6">
        <h1 className="text-3xl font-black uppercase">Dashboard</h1>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Novos Leads Hoje</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-black">{newToday}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Leads Vendidos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-black">{soldCount}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <Link
            href="/admin/banners"
            className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-1"
          >
            <GalleryHorizontal className="h-5 w-5" />
            <p className="mt-3 text-lg font-bold">Banners Home</p>
            <p className="text-sm text-zinc-600">Controle visual da vitrine inicial.</p>
          </Link>
          <Link
            href="/admin/marcas"
            className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-1"
          >
            <Tags className="h-5 w-5" />
            <p className="mt-3 text-lg font-bold">Marcas</p>
            <p className="text-sm text-zinc-600">Cadastro de nome e imagem das marcas.</p>
          </Link>
          <Link
            href="/admin/produtos"
            className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-1"
          >
            <Package className="h-5 w-5" />
            <p className="mt-3 text-lg font-bold">Gerenciar Produtos</p>
            <p className="text-sm text-zinc-600">Cadastro, status e organização do catálogo.</p>
          </Link>
          <Link
            href="/admin/leads"
            className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-1"
          >
            <MessageSquare className="h-5 w-5" />
            <p className="mt-3 text-lg font-bold">CRM de Leads</p>
            <p className="text-sm text-zinc-600">Acompanhe novos contatos com Kanban.</p>
          </Link>
          <Link
            href="/admin/categorias"
            className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-1"
          >
            <FolderKanban className="h-5 w-5" />
            <p className="mt-3 text-lg font-bold">Categorias</p>
            <p className="text-sm text-zinc-600">Controle das categorias do catálogo.</p>
          </Link>
          <Link
            href="/admin/usuarios"
            className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-1"
          >
            <Users className="h-5 w-5" />
            <p className="mt-3 text-lg font-bold">Usuários</p>
            <p className="text-sm text-zinc-600">Gestão de perfis administrativos.</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
