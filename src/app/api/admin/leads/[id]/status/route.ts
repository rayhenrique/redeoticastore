import { NextResponse } from "next/server";
import { requireAdminForApi } from "@/lib/guards/admin";
import { getLeadRepository } from "@/lib/repositories";
import { updateLeadStatusSchema } from "@/lib/validators/lead";
import type { UpdateLeadStatusResponse } from "@/types/api";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const unauthorized = await requireAdminForApi();
  if (unauthorized) return unauthorized;

  try {
    const payload = await request.json();
    const parsed = updateLeadStatusSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Status inválido." },
        { status: 400 },
      );
    }

    const { id } = await params;
    const repository = getLeadRepository();
    const lead = await repository.updateStatus(id, parsed.data.status);

    const response: UpdateLeadStatusResponse = {
      id: lead.id,
      status: lead.status,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao atualizar lead.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
