import { NextResponse } from "next/server";
import { requireAdminForApi } from "@/lib/guards/admin";
import { getBannerRepository } from "@/lib/repositories";
import { bannerSchema } from "@/lib/validators/banner";

export async function GET() {
  const unauthorized = await requireAdminForApi();
  if (unauthorized) return unauthorized;

  try {
    const repository = getBannerRepository();
    const banners = await repository.list();
    return NextResponse.json(banners, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao listar banners.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminForApi();
  if (unauthorized) return unauthorized;

  try {
    const payload = await request.json();
    const parsed = bannerSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Dados inválidos." },
        { status: 400 },
      );
    }

    const repository = getBannerRepository();
    const banner = await repository.create(parsed.data);
    return NextResponse.json(banner, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao criar banner.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
