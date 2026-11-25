"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { menu } from "@/lib/data";
import { whatsappLink, withBase } from "@/lib/site";

// Só os itens que já têm modelo 3D gerado (GLB em /public/modelos).
const items = menu.filter((m) => m.model);

type ModelViewerElement = HTMLElement & { canActivateAR?: boolean };

export default function Menu3D() {
  const [slug, setSlug] = useState(items[0]?.slug ?? "");
  const [ready, setReady] = useState(false);
  const [canAR, setCanAR] = useState<boolean | null>(null);
  const [arFailed, setArFailed] = useState(false);
  const viewerRef = useRef<ModelViewerElement>(null);
  const item = items.find((m) => m.slug === slug) ?? items[0];

  // <model-viewer> é um Web Component: só pode ser registrado no navegador.
  useEffect(() => {
    import("@google/model-viewer").then(() => setReady(true));
    const s = new URLSearchParams(window.location.search).get("item");
    if (s && items.some((m) => m.slug === s)) setSlug(s);
  }, []);

  useEffect(() => {
    const el = viewerRef.current;
    if (!el) return;
    setArFailed(false);
    const onLoad = () => setCanAR(Boolean(el.canActivateAR));
    const onStatus = (e: Event) => {
      if ((e as CustomEvent<{ status: string }>).detail.status === "failed") setArFailed(true);
    };
    el.addEventListener("load", onLoad);
    el.addEventListener("ar-status", onStatus);
    return () => {
      el.removeEventListener("load", onLoad);
      el.removeEventListener("ar-status", onStatus);
    };
  }, [ready, slug]);

  if (!item) return null;

  return (
    <section className="section m3d">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">Cardápio 3D</p>
          <h2>Veja nossos pratos na sua mesa</h2>
          <p>
            Gire o prato com o dedo para ver todos os lados. No celular, toque em
            &quot;Ver na sua mesa&quot;, aponte a câmera para uma mesa e o prato aparece
            em tamanho real sobre ela.
          </p>
        </div>

        <div className="m3d-layout">
          <div className="m3d-view">
            {ready ? (
              <model-viewer
                ref={viewerRef}
                key={item.slug}
                class="m3d-stage"
                src={withBase(item.model!)}
                poster={withBase(item.src)}
                alt={`Modelo 3D: ${item.title}`}
                camera-controls
                auto-rotate
                touch-action="pan-y"
                shadow-intensity="1"
                exposure="1.05"
                ar
                ar-modes="webxr scene-viewer quick-look"
                ar-placement="floor"
              >
                <button slot="ar-button" className="btn btn-primary m3d-ar-btn">
                  Ver na sua mesa
                </button>
              </model-viewer>
            ) : (
              <div className="m3d-stage m3d-loading">Carregando o modelo 3D...</div>
            )}
          </div>

          <aside className="m3d-info">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            {canAR === false && (
              <p className="m3d-muted">
                Para ver o prato sobre a sua mesa, abra esta página no celular (iPhone
                ou Android).
              </p>
            )}
            {arFailed && (
              <p className="m3d-muted">
                Não conseguimos abrir a câmera. Verifique se o navegador tem permissão
                para usar a câmera e tente de novo.
              </p>
            )}
            <div className="m3d-actions">
              <Link href={`/cardapio/${item.slug}`} className="btn btn-dark">
                Ver detalhes
              </Link>
              <a
                href={whatsappLink(`Olá! Vi o item "${item.title}" no cardápio 3D e quero fazer um pedido.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Pedir no WhatsApp
              </a>
            </div>
          </aside>
        </div>

        {items.length > 1 && (
          <div className="m3d-picker" aria-label="Escolha um item">
            {items.map((m) => (
              <button
                key={m.slug}
                className={`m3d-thumb ${m.slug === item.slug ? "is-active" : ""}`}
                onClick={() => setSlug(m.slug)}
                aria-pressed={m.slug === item.slug}
                title={m.title}
              >
                <Image src={m.src} alt={m.title} width={96} height={96} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
