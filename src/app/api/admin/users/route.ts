import { NextResponse } from "next/server";
import { requireAdminForApi } from "@/lib/guards/admin";
import { getSiteUserRepository } from "@/lib/repositories";
import { siteUserSchema } from "@/lib/validators/site-user";

export async function GET() {
  const unauthorized = await requireAdminForApi();
  if (unauthorized) return unauthorized;

  try {
    const repository = getSiteUserRepository();
    const users = await repository.list();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao listar usuários.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminForApi();
  if (unauthorized) return unauthorized;

  try {
    const payload = await request.json();
    const parsed = siteUserSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Dados inválidos." },
        { status: 400 },
      );
    }

    const repository = getSiteUserRepository();
    const user = await repository.create(parsed.data);
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao criar usuário.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
