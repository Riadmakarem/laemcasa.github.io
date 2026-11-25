import Image from "next/image";
import Reveal from "./Reveal";
import { owners } from "@/lib/data";
import { withBase } from "@/lib/site";

export default function About() {
  return (
    <section className="section about" id="sobre">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">Quem está por trás do Lá em Casa</p>
          <h2>Duas paixões, uma mesa só</h2>
          <p>
            O Lá em Casa nasceu do prazer de reunir pessoas em torno de uma boa
            mesa — feito à mão e servido com afeto por quem ama receber.
          </p>
        </div>

        <div className="owners">
          {owners.map((owner, i) => (
            <Reveal className="owner-card" key={owner.name} delay={i * 120}>
              <div className="owner-photo">
                <Image
                  src={owner.photo}
                  alt={`${owner.name} — ${owner.role} do Lá em Casa`}
                  fill
                  sizes="(max-width: 700px) 100vw, 420px"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="owner-body">
                <span className="owner-role">{owner.role}</span>
                <h3>{owner.name}</h3>
                <p className="owner-passion">{owner.passion}</p>
                <p className="owner-detail">{owner.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="about-sign">Com carinho, Ângela &amp; Marcela</p>

        <div className="about-cta">
          <a href={withBase("/sobrenos")} className="btn btn-dark">
            Conheça nossa história
          </a>
        </div>
      </div>
    </section>
  );
}
