import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function OfflinePage() {
  return (
    <main className="page-animated mx-auto flex min-h-screen w-full max-w-lg flex-col items-center justify-center px-6 text-center">
      <p className="rounded-full bg-[var(--brand)] px-3 py-1 text-xs font-bold uppercase">
        Sem conexão
      </p>
      <h1 className="mt-4 text-3xl font-black uppercase">Você está offline</h1>
      <p className="mt-3 text-zinc-600">
        Confira novamente sua conexão e tente acessar o catálogo.
      </p>
      <Button asChild className="mt-6">
        <Link href="/">Voltar para Home</Link>
      </Button>
    </main>
  );
}
