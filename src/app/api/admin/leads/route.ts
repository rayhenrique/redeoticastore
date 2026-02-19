import { NextResponse } from "next/server";
import { requireAdminForApi } from "@/lib/guards/admin";
import { getLeadRepository } from "@/lib/repositories";
import { leadSchema } from "@/lib/validators/lead";

export async function GET() {
  const unauthorized = await requireAdminForApi();
  if (unauthorized) return unauthorized;

  try {
    const repository = getLeadRepository();
    const leads = await repository.list();
    return NextResponse.json(leads, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao listar leads.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminForApi();
  if (unauthorized) return unauthorized;

  try {
    const payload = await request.json();
    const parsed = leadSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Dados inválidos." },
        { status: 400 },
      );
    }

    const repository = getLeadRepository();
    const lead = await repository.create(parsed.data);
    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao criar lead.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
