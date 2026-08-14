"use client";

import { useState } from "react";
import { instagramLink, site, whatsappLink } from "@/lib/site";

const eventTypes = [
  "Casamento",
  "Evento corporativo",
  "Aniversário",
  "Convenção",
  "Outro",
];

type FormState = {
  nome: string;
  tipo: string;
  convidados: string;
  celular: string;
  email: string;
  data: string;
  mensagem: string;
};

const initialState: FormState = {
  nome: "",
  tipo: eventTypes[0],
  convidados: "",
  celular: "",
  email: "",
  data: "",
  mensagem: "",
};

export default function EventForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [sent, setSent] = useState(false);

  const update = (key: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const message =
    `Olá, Lá em Casa! Quero contar sobre o meu evento.\n\n` +
    `Nome: ${form.nome || "-"}\n` +
    `Tipo de evento: ${form.tipo}\n` +
    `Convidados: ${form.convidados || "a definir"}\n` +
    `Celular: ${form.celular || "-"}\n` +
    `E-mail: ${form.email || "-"}\n` +
    `Data do evento: ${form.data || "a definir"}\n` +
    `Detalhes: ${form.mensagem || "-"}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
    setSent(true);
  };

  return (
    <div className="event-form-card">
      <div className="event-form-head">
        <p className="eyebrow">Fale sobre a sua celebração</p>
        <h2>Nos conte os detalhes do seu evento</h2>
        <p>
          Preencha as informações abaixo. A gente entra em contato para
          transformar sua ideia em uma proposta sob medida.
        </p>
      </div>

      <form className="event-form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="ev-nome">Seu nome</label>
          <input
            id="ev-nome"
            type="text"
            placeholder="Como podemos te chamar?"
            value={form.nome}
            onChange={update("nome")}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="ev-tipo">Tipo de evento</label>
          <select id="ev-tipo" value={form.tipo} onChange={update("tipo")}>
            {eventTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="ev-convidados">Quantidade de pessoas</label>
            <input
              id="ev-convidados"
              type="number"
              min={1}
              placeholder="Ex: 60"
              value={form.convidados}
              onChange={update("convidados")}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="ev-data">Data do evento</label>
            <input id="ev-data" type="date" value={form.data} onChange={update("data")} />
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="ev-celular">Celular para contato</label>
            <input
              id="ev-celular"
              type="tel"
              placeholder="(00) 00000-0000"
              value={form.celular}
              onChange={update("celular")}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="ev-email">E-mail</label>
            <input
              id="ev-email"
              type="email"
              placeholder="seu@email.com"
              value={form.email}
              onChange={update("email")}
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="ev-mensagem">Conte mais sobre a ocasião</label>
          <textarea
            id="ev-mensagem"
            placeholder="Local, estilo do evento, cardápio dos sonhos..."
            value={form.mensagem}
            onChange={update("mensagem")}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Enviar pelo WhatsApp
        </button>
        <p className="form-note">
          {sent
            ? "Abrimos o WhatsApp com seus dados preenchidos. Se não abriu, verifique o bloqueador de pop-ups."
            : "Ao enviar, abrimos uma conversa no WhatsApp com seus dados já preenchidos."}
        </p>
      </form>

      <div className="event-form-alt">
        <span>Prefere outro canal?</span>
        <div className="order-channels">
          <a href={instagramLink()} target="_blank" rel="noopener noreferrer">
            @{site.instagram}
          </a>
          <span>·</span>
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </div>
      </div>
    </div>
  );
}
