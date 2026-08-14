"use client";

import { useState } from "react";
import { instagramLink, site, whatsappLink } from "@/lib/site";

const eventTypes = [
  "Aniversário",
  "Casamento",
  "Evento corporativo",
  "Chá / Encontro",
  "Coquetel",
  "Box / Presente",
  "Outro",
];

export default function Contact() {
  const [form, setForm] = useState({
    nome: "",
    tipo: eventTypes[0],
    data: "",
    convidados: "",
    mensagem: "",
  });

  const update = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg =
      `Olá, Lá em Casa! Gostaria de um orçamento.\n\n` +
      `Nome: ${form.nome || "-"}\n` +
      `Tipo de evento: ${form.tipo}\n` +
      `Data: ${form.data || "a definir"}\n` +
      `Convidados: ${form.convidados || "a definir"}\n` +
      `Mensagem: ${form.mensagem || "-"}`;
    window.open(whatsappLink(msg), "_blank", "noopener,noreferrer");
  };

  return (
    <section className="section contact" id="orcamento">
      <div className="container contact-grid">
        <div className="contact-intro">
          <p className="eyebrow">Vamos conversar</p>
          <h2>Solicite seu orçamento</h2>
          <p>
            Conte pra gente sobre o seu evento. Preparamos uma proposta
            personalizada com carinho e todo o capricho Lá em Casa.
          </p>

          <div className="contact-channels">
            <a
              className="contact-channel"
              href={whatsappLink("Olá! Vim pelo site e gostaria de um orçamento.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span aria-hidden="true">◆</span> WhatsApp
            </a>
            <a
              className="contact-channel"
              href={instagramLink()}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span aria-hidden="true">◎</span> @{site.instagram}
            </a>
            <a className="contact-channel" href={`mailto:${site.email}`}>
              <span aria-hidden="true">✉</span> {site.email}
            </a>
          </div>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="nome">Seu nome</label>
            <input
              id="nome"
              type="text"
              placeholder="Como podemos te chamar?"
              value={form.nome}
              onChange={update("nome")}
              required
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="tipo">Tipo de evento</label>
              <select id="tipo" value={form.tipo} onChange={update("tipo")}>
                {eventTypes.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="data">Data</label>
              <input id="data" type="date" value={form.data} onChange={update("data")} />
            </div>
          </div>

          <div className="field">
            <label htmlFor="convidados">Número de convidados</label>
            <input
              id="convidados"
              type="number"
              min={1}
              placeholder="Ex: 40"
              value={form.convidados}
              onChange={update("convidados")}
            />
          </div>

          <div className="field">
            <label htmlFor="mensagem">Conte sua ideia</label>
            <textarea
              id="mensagem"
              placeholder="Ocasião, preferências, cardápio dos sonhos..."
              value={form.mensagem}
              onChange={update("mensagem")}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Enviar pelo WhatsApp
          </button>
          <p className="form-note">
            Ao enviar, abrimos uma conversa no WhatsApp com seus dados já preenchidos.
          </p>
        </form>
      </div>
    </section>
  );
}
