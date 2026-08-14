"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { nav, site, whatsappLink } from "@/lib/site";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  // Fora da home o topo é claro, então o header já entra sólido.
  const solid = scrolled || pathname !== "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fecha o menu ao trocar de rota e trava o scroll da página enquanto aberto.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Trava o scroll do body preservando a posição de rolagem atual.
  // Usar apenas `overflow: hidden` quebra o menu fixo em navegadores mobile
  // (principalmente iOS Safari) quando a página não está no topo: o body
  // "salta" e o painel fixo passa a renderizar fora de posição. Fixar o body
  // na posição atual (com top negativo) evita esse salto.
  useEffect(() => {
    if (!open) return;
    const scrollY = window.scrollY;
    const { body } = document;
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";

    return () => {
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  return (
    <header className={`header ${solid ? "scrolled" : ""}`}>
      <div className="container header-inner">
        <a href="/" className="brand" aria-label={`${site.name} — início`}>
          <Image
            src="/logolaemcasa.png"
            alt={`Logo ${site.name}`}
            width={80}
            height={80}
            className="brand-logo"
            priority
          />
          <span className="brand-name">
            <span className="script">Lá em casa</span>
            <small>{site.tagline}</small>
          </span>
        </a>

        <nav className={`nav ${open ? "open" : ""}`} onClick={() => setOpen(false)}>
          {nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
          <a
            className="btn btn-primary"
            href={whatsappLink(
              "Olá! Vim pelo site e gostaria de um orçamento com o Lá em Casa."
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            Solicite Orçamento
          </a>
        </nav>

        <button
          className="nav-toggle"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      <div
        className={`nav-scrim ${open ? "open" : ""}`}
        aria-hidden="true"
        onClick={() => setOpen(false)}
      />
    </header>
  );
}
