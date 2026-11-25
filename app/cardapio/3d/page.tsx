import Link from "next/link";
import type { Metadata } from "next";
import Menu3D from "@/components/Menu3D";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Cardápio 3D - ${site.name}`,
  description:
    "Veja os pratos do Lá em Casa em 3D e, pelo celular, coloque o prato em tamanho real sobre a sua mesa com realidade aumentada.",
};

export default function Cardapio3DPage() {
  return (
    <main>
      <div className="container">
        <nav className="crumbs" aria-label="Você está em">
          <Link href="/">Início</Link>
          <span>/</span>
          <Link href="/cardapio">Cardápio</Link>
          <span>/</span>
          <b>3D</b>
        </nav>
      </div>
      <Menu3D />
    </main>
  );
}
