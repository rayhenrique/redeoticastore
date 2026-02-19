import { NextResponse } from "next/server";
import { requireAdminForApi } from "@/lib/guards/admin";
import { getSiteUserRepository } from "@/lib/repositories";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const unauthorized = await requireAdminForApi();
  if (unauthorized) return unauthorized;

  try {
    const payload = (await request.json()) as {
      name?: string;
      email?: string;
      role?: "admin" | "seller";
      active?: boolean;
    };
    const { id } = await params;
    const repository = getSiteUserRepository();
    const user = await repository.update(id, payload);
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao atualizar usuário.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: RouteContext) {
  const unauthorized = await requireAdminForApi();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const repository = getSiteUserRepository();
    await repository.remove(id);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao remover usuário.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
