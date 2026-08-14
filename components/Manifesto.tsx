import Reveal from "./Reveal";

export default function Manifesto() {
  return (
    <section className="section manifesto">
      <div className="container">
        <Reveal>
          <p className="eyebrow">O jeito Lá em Casa de receber</p>
          <p className="script">Aconchego que se serve à mesa</p>
          <p>
            Unimos a fartura da comida brasileira ao capricho da arte gourmet.
            Sabores personalizados, apresentação impecável e aquele carinho de
            quem recebe em casa — para transformar sua festa em uma memória
            inesquecível.
          </p>
        </Reveal>

        <Reveal className="stats" delay={120}>
          <div className="stat">
            <b>100%</b>
            <span>Artesanal</span>
          </div>
          <div className="stat">
            <b>Sob</b>
            <span>Medida</span>
          </div>
          <div className="stat">
            <b>Cada</b>
            <span>Detalhe</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
