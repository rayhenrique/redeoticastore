import { NextResponse } from "next/server";
import { executeCheckout } from "@/lib/services/checkout";
import type { CheckoutRequest } from "@/types/api";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CheckoutRequest;
    const result = await executeCheckout(body);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Não foi possível finalizar a sacola.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
