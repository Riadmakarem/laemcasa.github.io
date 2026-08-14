import Link from "next/link";
import type { Metadata } from "next";
import Menu from "@/components/Menu";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Cardápio — ${site.name}`,
  description:
    "Explore o cardápio interativo do Lá em Casa: finger food, buffet completo, mesas elegantes, boxes gourmet e sobremesas.",
};

export default function CardapioPage() {
  return (
    <main>
      <div className="container">
        <nav className="crumbs" aria-label="Você está em">
          <Link href="/">Início</Link>
          <span>/</span>
          <b>Cardápio</b>
        </nav>
      </div>
      <Menu />
    </main>
  );
}
