import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import EventForm from "@/components/EventForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Seu evento — ${site.name}`,
  description:
    "Conte pra gente sobre o seu evento — casamento, corporativo, aniversário, convenção ou outra ocasião — e receba uma proposta sob medida do Lá em Casa.",
};

const eventKinds = [
  { label: "Casamentos", text: "Do civil íntimo à grande festa, com mesas que encantam." },
  { label: "Corporativo", text: "Coffee breaks, coquetéis e confraternizações de empresa." },
  { label: "Aniversários", text: "Celebrações com a sua identidade, do simples ao grandioso." },
  { label: "Convenções", text: "Buffets práticos e elegantes para grandes públicos." },
];

export default function SeuEventoPage() {
  return (
    <main className="event-page">
      <section className="event-hero">
        <div className="event-hero-bg">
          <Image
            src="/fotos/622442919_18083498126515998_1349353818041966639_n.jpg"
            alt="Mesa elegante com taças e detalhes gourmet do Lá em Casa"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="container event-hero-content">
          <nav className="crumbs crumbs-light" aria-label="Você está em">
            <Link href="/">Início</Link>
            <span>/</span>
            <b>Seu evento</b>
          </nav>
          <p className="eyebrow">Cada celebração é única</p>
          <span className="script">Seu evento</span>
          <p>
            Casamento, evento corporativo, aniversário, convenção ou uma
            ocasião só sua — conte os detalhes e a gente cuida do resto.
          </p>
        </div>
      </section>

      <section className="section event-kinds">
        <div className="container">
          <div className="event-kinds-grid">
            {eventKinds.map((k) => (
              <div className="event-kind-card" key={k.label}>
                <h3>{k.label}</h3>
                <p>{k.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section event-form-section">
        <div className="container event-form-wrap">
          <EventForm />
        </div>
      </section>
    </main>
  );
}
