import { NextResponse } from "next/server";
import { requireAdminForApi } from "@/lib/guards/admin";
import { getCategoryRepository } from "@/lib/repositories";
import { categorySchema } from "@/lib/validators/category";

export async function GET() {
  const unauthorized = await requireAdminForApi();
  if (unauthorized) return unauthorized;

  try {
    const repository = getCategoryRepository();
    const categories = await repository.list();
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao listar categorias.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminForApi();
  if (unauthorized) return unauthorized;

  try {
    const payload = await request.json();
    const parsed = categorySchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Dados inválidos." },
        { status: 400 },
      );
    }

    const repository = getCategoryRepository();
    const category = await repository.create(parsed.data);
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao criar categoria.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
