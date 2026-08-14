"use client";

import { useState } from "react";
import { instagramLink, site, whatsappLink } from "@/lib/site";

export default function OrderPanel({ itemTitle }: { itemTitle: string }) {
  const [form, setForm] = useState({
    quantidade: "",
    data: "",
    convidados: "",
    obs: "",
  });

  const update = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const message =
    `Olá, Lá em Casa! Quero fazer um pedido pelo site.\n\n` +
    `Item: ${itemTitle}\n` +
    `Quantidade: ${form.quantidade || "a combinar"}\n` +
    `Data do evento: ${form.data || "a definir"}\n` +
    `Convidados: ${form.convidados || "a definir"}\n` +
    `Observações: ${form.obs || "-"}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="order-panel">
      <h3>Fazer pedido</h3>
      <p className="order-sub">
        Preencha os detalhes e a gente continua a conversa no WhatsApp, sem
        compromisso.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="quantidade">Quantidade / porções</label>
          <input
            id="quantidade"
            type="text"
            placeholder="Ex: 2 tábuas, 50 unidades..."
            value={form.quantidade}
            onChange={update("quantidade")}
          />
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="data">Data</label>
            <input id="data" type="date" value={form.data} onChange={update("data")} />
          </div>
          <div className="field">
            <label htmlFor="convidados">Convidados</label>
            <input
              id="convidados"
              type="number"
              min={1}
              placeholder="Ex: 40"
              value={form.convidados}
              onChange={update("convidados")}
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="obs">Observações</label>
          <textarea
            id="obs"
            placeholder="Restrições, sabores preferidos, local de entrega..."
            value={form.obs}
            onChange={update("obs")}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Pedir pelo WhatsApp
        </button>
      </form>

      <div className="order-channels">
        <a href={instagramLink()} target="_blank" rel="noopener noreferrer">
          @{site.instagram}
        </a>
        <span>·</span>
        <a href={`mailto:${site.email}`}>{site.email}</a>
      </div>
    </div>
  );
}
