import { NextResponse } from "next/server";
import { requireAdminForApi } from "@/lib/guards/admin";
import { getBrandRepository } from "@/lib/repositories";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const unauthorized = await requireAdminForApi();
  if (unauthorized) return unauthorized;

  try {
    const payload = (await request.json()) as {
      name?: string;
      image?: string;
      active?: boolean;
    };
    const { id } = await params;
    const repository = getBrandRepository();
    const brand = await repository.update(id, payload);
    return NextResponse.json(brand, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao atualizar marca.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: RouteContext) {
  const unauthorized = await requireAdminForApi();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const repository = getBrandRepository();
    await repository.remove(id);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao remover marca.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
