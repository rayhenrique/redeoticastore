import { NextResponse } from "next/server";
import { requireAdminForApi } from "@/lib/guards/admin";
import { getBannerRepository } from "@/lib/repositories";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const unauthorized = await requireAdminForApi();
  if (unauthorized) return unauthorized;

  try {
    const payload = (await request.json()) as {
      title?: string;
      subtitle?: string;
      cta?: string;
      image?: string;
      position?: number;
      active?: boolean;
    };
    const { id } = await params;
    const repository = getBannerRepository();
    const banner = await repository.update(id, payload);
    return NextResponse.json(banner, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao atualizar banner.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: RouteContext) {
  const unauthorized = await requireAdminForApi();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const repository = getBannerRepository();
    await repository.remove(id);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao remover banner.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
