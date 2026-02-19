import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { getCurrentAdminUser } from "@/lib/auth/admin";

export async function requireAdminOrRedirect(nextPath = "/admin") {
  const user = await getCurrentAdminUser();
  if (!user) {
    redirect(`/admin/login?next=${encodeURIComponent(nextPath)}`);
  }
  return user;
}

export async function requireAdminForApi() {
  const user = await getCurrentAdminUser();
  if (!user) {
    return NextResponse.json(
      { error: "Não autorizado. Faça login como administrador." },
      { status: 401 },
    );
  }
  return null;
}
