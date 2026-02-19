import { whatsappNumber } from "@/lib/config";
import { sanitizePhoneNumber } from "@/lib/utils";
import type { LeadProductSnapshot } from "@/types/domain";

export function buildWhatsAppMessage(params: {
  name: string;
  products: LeadProductSnapshot[];
}) {
  const lines = params.products.map((product, index) => {
    const price = product.price === null ? "Sob consulta" : `R$ ${product.price}`;
    return `${index + 1}. ${product.name} (${price}) - ${product.url}`;
  });

  return `Olá! Me chamo ${params.name} e tenho interesse nestes produtos:\n${lines.join("\n")}`;
}

export function buildWhatsAppUrl(message: string) {
  const number = sanitizePhoneNumber(whatsappNumber);
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${encodedText}`;
}
