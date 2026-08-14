import Reveal from "./Reveal";
import { steps } from "@/lib/data";

export default function Process() {
  return (
    <section className="section process" id="processo">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">Como funciona</p>
          <h2>Simples do primeiro contato à festa</h2>
          <p>Quatro passos para o seu evento sair exatamente como você imaginou.</p>
        </div>

        <div className="steps">
          {steps.map((step, i) => (
            <Reveal className="step" key={step.n} delay={i * 90}>
              <b>{step.n}</b>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
