import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 text-sm md:grid-cols-3 md:px-6">
        <div>
          <p className="text-base font-black uppercase">Rede Ótica Store</p>
          <p className="mt-2 text-zinc-600">
            Catálogo digital com atendimento rápido no WhatsApp.
          </p>
        </div>
        <div>
          <p className="font-semibold">Unidades</p>
          <p className="mt-2 text-zinc-600">(82) 99630-6931 - Teotônio Vilela</p>
          <p className="text-zinc-600">(82) 99626-5666 - Junqueiro</p>
        </div>
        <div>
          <p className="font-semibold">Links</p>
          <ul className="mt-2 space-y-1 text-zinc-600">
            <li>
              <Link href="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link href="/sobre" className="hover:underline">
                Sobre
              </Link>
            </li>
            <li>
              <Link href="/catalogo" className="hover:underline">
                Catálogo
              </Link>
            </li>
            <li>
              <Link href="/onde-estamos" className="hover:underline">
                Onde estamos?
              </Link>
            </li>
            <li>
              <Link href="/sacola" className="hover:underline">
                Sacola
              </Link>
            </li>
            <li>
              <Link href="/admin/login" className="hover:underline">
                Área da Loja
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-zinc-200 py-4 text-center text-xs text-zinc-500">
        <p>© {new Date().getFullYear()} Rede Ótica Store.</p>
        <p className="mt-1">
          Desenvolvido com <span aria-hidden="true">❤️</span> por{" "}
          <a
            href="https://kltecnologia.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold hover:underline"
          >
            KL Tecnologia
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
