import { NextResponse } from "next/server";
import { requireAdminForApi } from "@/lib/guards/admin";
import { getLeadRepository } from "@/lib/repositories";
import { updateLeadSchema } from "@/lib/validators/lead";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const unauthorized = await requireAdminForApi();
  if (unauthorized) return unauthorized;

  try {
    const payload = await request.json();
    const parsed = updateLeadSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Dados inválidos." },
        { status: 400 },
      );
    }

    const { id } = await params;
    const repository = getLeadRepository();
    const lead = await repository.update(id, parsed.data);
    return NextResponse.json(lead, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao atualizar lead.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: RouteContext) {
  const unauthorized = await requireAdminForApi();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const repository = getLeadRepository();
    await repository.remove(id);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao remover lead.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
