import { NextResponse } from "next/server";
import { getProductRepository } from "@/lib/repositories";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  try {
    const repository = getProductRepository();
    const products = await repository.list({
      q: searchParams.get("q") ?? undefined,
      brand: searchParams.get("brand") ?? undefined,
      category: searchParams.get("category") ?? undefined,
      active:
        searchParams.get("active") === null
          ? true
          : searchParams.get("active") === "true",
    });
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao listar produtos.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
