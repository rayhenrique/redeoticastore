"use client";

import { useMemo, useState } from "react";
import { LoaderCircle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCartStore } from "@/stores/cart-store";
import type { CheckoutResponse } from "@/types/api";

function maskWhatsapp(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (!digits) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function CheckoutModal() {
  const items = useCartStore((state) => state.items);
  const clear = useCartStore((state) => state.clear);

  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const canCheckout = useMemo(() => items.length > 0, [items.length]);

  async function handleConfirm() {
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/leads/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          whatsapp,
          items: items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = (await response.json()) as CheckoutResponse | { error: string };

      if (!response.ok || !("whatsappUrl" in data)) {
        throw new Error("error" in data ? data.error : "Não foi possível finalizar.");
      }

      clear();
      setOpen(false);
      window.location.href = data.whatsappUrl;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Não foi possível finalizar.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full" disabled={!canCheckout}>
          <MessageCircle className="h-4 w-4" />
          Finalizar no WhatsApp
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Finalizar no WhatsApp</DialogTitle>
          <DialogDescription>
            Informe seu nome e telefone para enviar sua sacola para o time da loja.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="checkout-name">Nome</Label>
            <Input
              id="checkout-name"
              placeholder="Seu nome"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="checkout-whatsapp">WhatsApp</Label>
            <Input
              id="checkout-whatsapp"
              placeholder="(82) 99999-9999"
              value={whatsapp}
              onChange={(event) => setWhatsapp(maskWhatsapp(event.target.value))}
              inputMode="numeric"
              maxLength={15}
            />
          </div>
        </div>

        {error ? (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Voltar
          </Button>
          <Button onClick={handleConfirm} disabled={loading || !canCheckout}>
            {loading ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              "Confirmar e abrir WhatsApp"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
