import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm text-zinc-600">Institucional</p>
        <h1 className="mt-1 text-3xl font-black uppercase">Sobre a Rede Ótica Store</h1>
        <p className="mt-4 max-w-3xl text-zinc-700">
          A Rede Ótica Store nasceu para unir estilo, cuidado visual e atendimento
          próximo. Nossa proposta é tornar a escolha dos seus óculos mais simples, com
          catálogo digital e suporte rápido pelo WhatsApp.
        </p>
      </section>

      <Card className="overflow-hidden">
        <CardContent className="grid gap-4 p-0 md:grid-cols-2">
          <div className="relative min-h-[260px]">
            <Image
              src="/branding/06.jpg"
              alt="Equipe Rede Ótica Store"
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-4 p-6">
            <h2 className="text-2xl font-black uppercase">Nosso compromisso</h2>
            <p className="text-zinc-700">
              Trabalhamos com armações solares e de grau, focando em qualidade,
              variedade e orientação personalizada para cada cliente.
            </p>
            <p className="text-zinc-700">
              Com unidades em Teotônio Vilela e Junqueiro, atendemos presencialmente e
              online para agilizar seu processo de compra.
            </p>
            <Button asChild>
              <Link href="/catalogo">Conhecer catálogo</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
