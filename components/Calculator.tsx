"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { whatsappLink } from "@/lib/site";

/**
 * Calculadora de orçamento (estimativa).
 * TODO (dono): ajuste os valores abaixo para os preços reais do Lá em Casa.
 * Os valores são apenas uma estimativa inicial e não representam um contrato.
 */
const PER_PERSON = [
  { id: "fingerfood", label: "Finger Food", price: 39, hint: "salgados, canapés e minis" },
  { id: "buffet", label: "Buffet Completo", price: 59, hint: "estações quentes e frias" },
  { id: "frios", label: "Mesa de Frios & Charcutaria", price: 34, hint: "tábuas, queijos e frutas" },
  { id: "sobremesas", label: "Sobremesas", price: 18, hint: "doces finos e verrines" },
] as const;

const ADDONS = [
  { id: "mesa", label: "Mesa Elegante (decoração & montagem)", price: 350 },
  { id: "servico", label: "Equipe de serviço no local", price: 280 },
] as const;

const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export default function Calculator() {
  const searchParams = useSearchParams();
  const [guests, setGuests] = useState(40);
  const [selected, setSelected] = useState<Record<string, boolean>>({ fingerfood: true, sobremesas: true });

  // Se a pessoa chegou aqui a partir do cardápio (ex: /calculadora?item=buffet),
  // pré-marca a experiência correspondente para agilizar a estimativa.
  useEffect(() => {
    const item = searchParams.get("item");
    if (item && [...PER_PERSON, ...ADDONS].some((o) => o.id === item)) {
      setSelected((s) => ({ ...s, [item]: true }));
      const el = document.getElementById("calculadora");
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [searchParams]);

  const toggle = (id: string) => setSelected((s) => ({ ...s, [id]: !s[id] }));

  const perPersonTotal = useMemo(
    () => PER_PERSON.filter((p) => selected[p.id]).reduce((sum, p) => sum + p.price, 0),
    [selected]
  );

  const addonsTotal = useMemo(
    () => ADDONS.filter((a) => selected[a.id]).reduce((sum, a) => sum + a.price, 0),
    [selected]
  );

  const guestsSafe = Math.max(1, guests || 0);
  const estimate = perPersonTotal * guestsSafe + addonsTotal;
  const min = Math.round((estimate * 0.9) / 10) * 10;
  const max = Math.round((estimate * 1.1) / 10) * 10;

  const chosenLabels = [
    ...PER_PERSON.filter((p) => selected[p.id]).map((p) => p.label),
    ...ADDONS.filter((a) => selected[a.id]).map((a) => a.label),
  ];

  const message =
    `Olá, Lá em Casa! Fiz uma simulação na calculadora do site.\n\n` +
    `Convidados: ${guestsSafe}\n` +
    `Itens: ${chosenLabels.length ? chosenLabels.join(", ") : "a definir"}\n` +
    `Estimativa: ${brl(min)} a ${brl(max)}\n\n` +
    `Gostaria de um orçamento oficial. :)`;

  return (
    <section className="section calculator" id="calculadora">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">Calculadora de orçamento</p>
          <h2>Faça uma estimativa em segundos</h2>
          <p>
            Escolha as experiências, informe o número de convidados e veja uma
            estimativa na hora. É só um ponto de partida — o orçamento final é
            personalizado.
          </p>
        </div>

        <div className="calc-grid">
          <div className="calc-controls">
            <div className="calc-guests">
              <label htmlFor="guests">
                Convidados <b>{guestsSafe}</b>
              </label>
              <input
                id="guests"
                type="range"
                min={10}
                max={300}
                step={5}
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
              />
              <input
                type="number"
                min={1}
                aria-label="Número de convidados"
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="calc-guests-input"
              />
            </div>

            <p className="calc-group-title">Experiências (por pessoa)</p>
            <div className="calc-options">
              {PER_PERSON.map((p) => (
                <button
                  key={p.id}
                  className={`calc-option ${selected[p.id] ? "is-on" : ""}`}
                  onClick={() => toggle(p.id)}
                  aria-pressed={!!selected[p.id]}
                >
                  <span className="calc-check" aria-hidden="true" />
                  <span className="calc-option-text">
                    <b>{p.label}</b>
                    <small>{p.hint}</small>
                  </span>
                  <span className="calc-price">{brl(p.price)}<i>/pessoa</i></span>
                </button>
              ))}
            </div>

            <p className="calc-group-title">Adicionais</p>
            <div className="calc-options">
              {ADDONS.map((a) => (
                <button
                  key={a.id}
                  className={`calc-option ${selected[a.id] ? "is-on" : ""}`}
                  onClick={() => toggle(a.id)}
                  aria-pressed={!!selected[a.id]}
                >
                  <span className="calc-check" aria-hidden="true" />
                  <span className="calc-option-text">
                    <b>{a.label}</b>
                  </span>
                  <span className="calc-price">{brl(a.price)}</span>
                </button>
              ))}
            </div>
          </div>

          <aside className="calc-summary">
            <p className="calc-summary-label">Estimativa</p>
            <p className="calc-summary-value">
              {perPersonTotal === 0 && addonsTotal === 0 ? (
                <span className="calc-empty">Selecione uma experiência</span>
              ) : (
                <>
                  {brl(min)} <span>a</span> {brl(max)}
                </>
              )}
            </p>

            <ul className="calc-breakdown">
              <li>
                <span>Por pessoa</span>
                <b>{brl(perPersonTotal)}</b>
              </li>
              <li>
                <span>Convidados</span>
                <b>× {guestsSafe}</b>
              </li>
              {addonsTotal > 0 && (
                <li>
                  <span>Adicionais</span>
                  <b>{brl(addonsTotal)}</b>
                </li>
              )}
            </ul>

            <a
              className="btn btn-primary"
              href={whatsappLink(message)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Pedir orçamento oficial
            </a>
            <p className="calc-note">
              Valores estimados, sujeitos a confirmação conforme cardápio, data e local.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
