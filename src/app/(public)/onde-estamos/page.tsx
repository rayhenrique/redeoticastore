import Link from "next/link";
import { MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const units = [
  {
    id: "teotonio",
    city: "Teotônio Vilela",
    phone: "(82) 99630-6931",
    whatsapp: "5582996306931",
    mapsUrl: "https://maps.google.com/?q=Teot%C3%B4nio+Vilela+AL",
  },
  {
    id: "junqueiro",
    city: "Junqueiro",
    phone: "(82) 99626-5666",
    whatsapp: "5582996265666",
    mapsUrl: "https://maps.google.com/?q=Junqueiro+AL",
  },
];

export default function WhereWeArePage() {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm text-zinc-600">Localização</p>
        <h1 className="mt-1 text-3xl font-black uppercase">Onde estamos?</h1>
        <p className="mt-4 max-w-3xl text-zinc-700">
          Visite uma de nossas unidades para experimentar os modelos e receber
          atendimento personalizado.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {units.map((unit) => (
          <Card key={unit.id}>
            <CardHeader>
              <CardTitle>{unit.city}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-zinc-700">WhatsApp: {unit.phone}</p>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline">
                  <Link href={unit.mapsUrl} target="_blank" rel="noopener noreferrer">
                    <MapPin className="h-4 w-4" />
                    Ver no mapa
                  </Link>
                </Button>
                <Button asChild>
                  <Link
                    href={`https://wa.me/${unit.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Falar no WhatsApp
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
