import { NextResponse } from "next/server";
import { requireAdminForApi } from "@/lib/guards/admin";
import { uploadProductImage } from "@/lib/services/storage";

export async function POST(request: Request) {
  const unauthorized = await requireAdminForApi();
  if (unauthorized) return unauthorized;

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Arquivo inválido." }, { status: 400 });
    }

    const url = await uploadProductImage(file);
    return NextResponse.json({ url }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao fazer upload.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
