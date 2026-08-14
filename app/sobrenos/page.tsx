import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import { owners } from "@/lib/data";
import { site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: `Sobre nós — ${site.name}`,
  description:
    "Conheça a história do Lá em Casa e as duas idealizadoras, Ângela Sammer e Marcela Fraxe: buffet, finger food e mesas feitas à mão e servidas com afeto.",
};

const values = [
  {
    title: "Artesanal",
    text: "Cada salgado, tábua e doce é preparado à mão, com ingredientes escolhidos a dedo.",
  },
  {
    title: "Personalizado",
    text: "Montamos o cardápio e a decoração de acordo com a sua ocasião, do coquetel ao jantar.",
  },
  {
    title: "Apresentação",
    text: "Cuidamos da estética da mesa: arranjos, alturas, louças e detalhes que encantam.",
  },
  {
    title: "Afeto",
    text: "Recebemos você com o mesmo carinho que teríamos em nossa própria casa.",
  },
];

export default function SobreNosPage() {
  return (
    <main className="sobre-page">
      {/* Hero */}
      <section className="sobre-hero">
        <div className="sobre-hero-bg">
          <Image
            src="/fundosobrenos.png"
            alt="Grande mesa de festa montada pelo Lá em Casa"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="container sobre-hero-content">
          <nav className="crumbs crumbs-light" aria-label="Você está em">
            <Link href="/">Início</Link>
            <span>/</span>
            <b>Sobre nós</b>
          </nav>
          <p className="eyebrow">Quem está por trás do Lá em Casa</p>
          <span className="script">Sobre nós</span>
          <p>
            Uma história feita de encontros, sabores e do prazer de receber bem.
          </p>
        </div>
      </section>

      {/* História */}
      <section className="section sobre-story">
        <div className="container">
          <Reveal className="sobre-story-inner">
            <p className="eyebrow">Nossa história</p>
            <h2>O prazer de reunir pessoas em volta da mesa</h2>
            <p>
              O Lá em Casa nasceu do gosto por receber e da certeza de que os
              melhores momentos acontecem à mesa. Começou como aquele carinho de
              preparar tudo com as próprias mãos para quem a gente ama — e virou
              um jeito de levar esse aconchego para a festa de outras famílias.
            </p>
            <p>
              Hoje unimos a fartura da comida brasileira ao capricho da arte
              gourmet: finger food para circular, buffets generosos, tábuas
              artesanais, boxes para presentear e mesas montadas nos mínimos
              detalhes. Cada evento é único, e é assim que ele é tratado.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Fundadoras */}
      <section className="section sobre-owners">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">As idealizadoras</p>
            <h2>Duas paixões, uma mesa só</h2>
          </div>

          {owners.map((owner, i) => (
            <Reveal className={`sobre-owner ${i % 2 ? "reverse" : ""}`} key={owner.name}>
              <div className="sobre-owner-photo">
                <Image
                  src={owner.photo}
                  alt={`${owner.name} — ${owner.role} do Lá em Casa`}
                  fill
                  sizes="(max-width: 900px) 100vw, 45vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="sobre-owner-body">
                <span className="owner-role">{owner.role}</span>
                <h3>{owner.name}</h3>
                <p className="owner-passion">{owner.passion}</p>
                <p className="owner-detail">{owner.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Valores */}
      <section className="section sobre-values">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">No que acreditamos</p>
            <h2>O jeito Lá em Casa de fazer</h2>
          </div>
          <div className="values-grid">
            {values.map((v, i) => (
              <Reveal className="value-card" key={v.title} delay={i * 90}>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section sobre-cta">
        <div className="container">
          <Reveal>
            <span className="script">Vamos celebrar juntos?</span>
            <p>Conte pra gente sobre o seu evento. A gente cuida do resto.</p>
            <div className="sobre-cta-actions">
              <a
                className="btn btn-primary"
                href={whatsappLink("Olá! Vim pela página Sobre nós e quero um orçamento.")}
                target="_blank"
                rel="noopener noreferrer"
              >
                Solicite Orçamento
              </a>
              <Link className="btn btn-ghost" href="/cardapio">
                Ver o cardápio
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
