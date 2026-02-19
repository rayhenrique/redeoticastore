import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(value: number | null) {
  if (value === null) return "Sob consulta";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDateTime(isoString: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(isoString));
}

export function sanitizePhoneNumber(value: string) {
  return value.replace(/\D/g, "");
}

export function buildAbsoluteProductUrl(productId: string, siteUrl: string) {
  return new URL(`/produto/${productId}`, siteUrl).toString();
}
