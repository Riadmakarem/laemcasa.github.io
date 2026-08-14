import Image from "next/image";
import Reveal from "./Reveal";
import { experiences } from "@/lib/data";

export default function Experiences() {
  return (
    <section className="section experiences" id="experiencias">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">Nossas experiências</p>
          <h2>Do salgado ao doce, tudo com assinatura Lá em Casa</h2>
          <p>
            Montamos a combinação perfeita para o seu evento — do coquetel
            descontraído ao jantar mais elegante.
          </p>
        </div>

        <div className="exp-list">
          {experiences.map((exp, i) => (
            <Reveal className="exp-row" as="article" key={exp.id}>
              <div className="exp-media">
                <Image
                  src={exp.image}
                  alt={exp.imageAlt}
                  fill
                  sizes="(max-width: 900px) 100vw, 50vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="exp-body">
                <span className="exp-index">{String(i + 1).padStart(2, "0")}</span>
                <p className="eyebrow">{exp.eyebrow}</p>
                <h3>{exp.title}</h3>
                <p>{exp.description}</p>
                <ul className="exp-items">
                  {exp.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
