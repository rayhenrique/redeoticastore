import { NextResponse } from "next/server";
import { requireAdminForApi } from "@/lib/guards/admin";
import { getProductRepository } from "@/lib/repositories";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const unauthorized = await requireAdminForApi();
  if (unauthorized) return unauthorized;

  try {
    const payload = (await request.json()) as {
      active?: boolean;
      name?: string;
      brand?: string;
      description?: string | null;
      price?: number | null;
      category?: "solar" | "grau";
      images?: string[];
    };
    const { id } = await params;
    const repository = getProductRepository();
    const product = await repository.update(id, payload);
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao atualizar produto.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: RouteContext) {
  const unauthorized = await requireAdminForApi();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const repository = getProductRepository();
    await repository.remove(id);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao remover produto.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
