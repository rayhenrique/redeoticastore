import { CartItems } from "@/components/public/cart-items";
import { CheckoutModal } from "@/components/public/checkout-modal";

export default function BagPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-sm text-zinc-600">Carrinho de interesse</p>
        <h1 className="text-3xl font-black uppercase">Sua Sacola</h1>
      </div>
      <CartItems />
      <CheckoutModal />
    </div>
  );
}
