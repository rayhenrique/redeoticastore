import { NextResponse } from "next/server";
import { requireAdminForApi } from "@/lib/guards/admin";
import { getProductRepository } from "@/lib/repositories";
import { productSchema } from "@/lib/validators/product";

export async function GET() {
  const unauthorized = await requireAdminForApi();
  if (unauthorized) return unauthorized;

  try {
    const repository = getProductRepository();
    const products = await repository.list();
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao listar produtos.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminForApi();
  if (unauthorized) return unauthorized;

  try {
    const payload = await request.json();
    const parsed = productSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Dados inválidos." },
        { status: 400 },
      );
    }

    const repository = getProductRepository();
    const product = await repository.create({
      name: parsed.data.name,
      description: parsed.data.description ?? null,
      price: parsed.data.price ?? null,
      images: parsed.data.images,
      brand: parsed.data.brand,
      category: parsed.data.category,
      active: parsed.data.active,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao criar produto.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
