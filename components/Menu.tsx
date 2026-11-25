"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { categoryLabel, categoryToCalcOption, menu, menuCategories, type MenuCategory } from "@/lib/data";
import { whatsappLink } from "@/lib/site";

export default function Menu() {
  const [active, setActive] = useState<MenuCategory | "todos">("todos");

  const filtered = useMemo(
    () => (active === "todos" ? menu : menu.filter((m) => m.cats.includes(active))),
    [active]
  );

  // Quando a pessoa filtra por uma categoria com equivalente na calculadora
  // (ex: buffet, finger food), mostramos um convite para simular o orçamento.
  const calcOption = active !== "todos" ? categoryToCalcOption[active] : null;
  const calcHref = calcOption ? `/calculadora?item=${calcOption}` : "/calculadora";

  return (
    <section className="section menu" id="cardapio">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">Cardápio interativo</p>
          <h2>Explore o que preparamos</h2>
          <p>
            Filtre por categoria e toque em qualquer imagem para ver a descrição
            completa e já fazer o seu pedido.
          </p>
        </div>

        <div className="menu-3d-link">
          <Link href="/cardapio/3d" className="btn btn-dark">
            Ver cardápio em 3D / câmera
          </Link>
        </div>

        <div className="menu-filters" role="tablist" aria-label="Categorias do cardápio">
          {menuCategories.map((c) => (
            <button
              key={c.id}
              role="tab"
              aria-selected={active === c.id}
              className={`chip ${active === c.id ? "chip-active" : ""}`}
              onClick={() => setActive(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>

        {calcOption && (
          <div className="menu-calc-hint">
            <p>
              Gostou do <b>{categoryLabel(active)}</b>? Veja quanto seu evento
              pode custar.
            </p>
            <Link href={calcHref} className="btn btn-primary">
              Simular orçamento rápido
            </Link>
          </div>
        )}

        <div className="menu-grid">
          {filtered.map((item) => (
            <Link
              key={item.slug}
              href={`/cardapio/${item.slug}`}
              className="menu-card"
              aria-label={`Ver detalhes: ${item.title}`}
            >
              <Image
                src={item.src}
                alt={item.title}
                width={420}
                height={420}
                sizes="(max-width: 560px) 50vw, (max-width: 900px) 33vw, 25vw"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <span className="menu-card-label">
                {item.title}
                <i className="menu-card-cue">Ver &amp; pedir →</i>
              </span>
            </Link>
          ))}
        </div>

        <p className="menu-cta">
          Montou o cardápio dos sonhos?{" "}
          <a
            href={whatsappLink("Olá! Gostei do cardápio no site e quero montar o meu.")}
            target="_blank"
            rel="noopener noreferrer"
          >
            Fale com a gente no WhatsApp →
          </a>
        </p>
      </div>
    </section>
  );
}
