import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import Calculator from "@/components/Calculator";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Calculadora de orçamento — ${site.name}`,
  description:
    "Simule o orçamento do seu evento com o Lá em Casa: escolha as experiências, informe o número de convidados e veja uma estimativa em segundos.",
};

export default function CalculadoraPage() {
  return (
    <main>
      <div className="container">
        <nav className="crumbs" aria-label="Você está em">
          <Link href="/">Início</Link>
          <span>/</span>
          <b>Calculadora</b>
        </nav>
      </div>
      <Suspense>
        <Calculator />
      </Suspense>
    </main>
  );
}
