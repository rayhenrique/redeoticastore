import { NextResponse } from "next/server";
import { requireAdminForApi } from "@/lib/guards/admin";
import { getBrandRepository } from "@/lib/repositories";
import { brandSchema } from "@/lib/validators/brand";

export async function GET() {
  const unauthorized = await requireAdminForApi();
  if (unauthorized) return unauthorized;

  try {
    const repository = getBrandRepository();
    const brands = await repository.list();
    return NextResponse.json(brands, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao listar marcas.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminForApi();
  if (unauthorized) return unauthorized;

  try {
    const payload = await request.json();
    const parsed = brandSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Dados inválidos." },
        { status: 400 },
      );
    }

    const repository = getBrandRepository();
    const brand = await repository.create(parsed.data);
    return NextResponse.json(brand, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao criar marca.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
