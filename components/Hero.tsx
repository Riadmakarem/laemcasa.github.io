import Image from "next/image";
import { whatsappLink } from "@/lib/site";

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-bg">
        <Image
          src="/fundoprincipal.png"
          alt="Buffet completo montado pelo Lá em Casa"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
      </div>

      <div className="container hero-content">
        <p className="eyebrow">Buffet &middot; Finger Food &middot; Eventos</p>
        <span className="script">Lá em casa</span>
        <h1>Cada mordida, uma celebração.</h1>
        <p>
          Finger food, buffet completo, mesas elegantes, boxes gourmet e sobremesas.
          Cuidamos de cada detalhe para reunir quem você ama em volta da mesa.
        </p>
        <div className="hero-actions">
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
          <a className="btn btn-ghost" href="#experiencias">
            Ver experiências
          </a>
        </div>
      </div>

      <div className="hero-scroll" aria-hidden="true">
        <span />
        Role
      </div>
    </section>
  );
}
