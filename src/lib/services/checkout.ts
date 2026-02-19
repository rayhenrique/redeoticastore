import { siteUrl } from "@/lib/config";
import { getLeadRepository, getProductRepository } from "@/lib/repositories";
import { buildWhatsAppMessage, buildWhatsAppUrl } from "@/lib/services/whatsapp";
import { checkoutSchema } from "@/lib/validators/checkout";
import { buildAbsoluteProductUrl } from "@/lib/utils";
import type { CheckoutRequest, CheckoutResponse } from "@/types/api";
import type { LeadProductSnapshot } from "@/types/domain";

export async function executeCheckout(
  payload: CheckoutRequest,
): Promise<CheckoutResponse> {
  const parsed = checkoutSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Dados inválidos.");
  }

  const productRepository = getProductRepository();
  const leadRepository = getLeadRepository();

  const itemsById = new Map(parsed.data.items.map((item) => [item.productId, item]));
  const products = await productRepository.listByIds([...itemsById.keys()]);

  if (!products.length) {
    throw new Error("Nenhum produto válido encontrado na sacola.");
  }

  const productsInterest: LeadProductSnapshot[] = products.map((product) => ({
    productId: product.id,
    name: product.name,
    price: product.price,
    quantity: itemsById.get(product.id)?.quantity ?? 1,
    url: buildAbsoluteProductUrl(product.id, siteUrl),
  }));

  const lead = await leadRepository.create({
    name: parsed.data.name,
    whatsapp: parsed.data.whatsapp,
    status: "new",
    products_interest: productsInterest,
  });

  const message = buildWhatsAppMessage({
    name: parsed.data.name,
    products: productsInterest,
  });

  return {
    leadId: lead.id,
    whatsappUrl: buildWhatsAppUrl(message),
  };
}
