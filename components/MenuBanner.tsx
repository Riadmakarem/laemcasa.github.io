import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";

export default function MenuBanner() {
  return (
    <section className="menu-banner" id="cardapio">
      <div className="menu-banner-bg">
        <Image
          src="/bannercardapio.png"
          alt="Cardápio Lá em Casa"
          fill
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
      </div>

      <div className="container menu-banner-content">
        <Reveal>
          <p className="eyebrow">Cardápio interativo</p>
          <h2>Explore cada sabor do Lá em Casa</h2>
          <p>
            Finger food, buffet completo, mesas elegantes, boxes gourmet e
            sobremesas: navegue pelas categorias, veja fotos e descrições e
            monte o cardápio ideal para o seu evento.
          </p>
          <Link href="/cardapio" className="btn btn-primary">
            Ver cardápio completo
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
