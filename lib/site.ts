// Informações da marca e contato.
// TODO (dono): substitua os placeholders de contato pelos dados reais.
export const site = {
  name: "Lá em Casa",
  tagline: "Buffet & Finger Food",
  // Frase-conceito da marca
  concept: "Sabores que reúnem sua família em volta da mesa.",
  // Contato — troque pelos dados oficiais antes de publicar
  whatsapp: "5500000000000", // formato internacional, só dígitos. Ex: 5591999999999
  instagram: "laemcasa",
  email: "contato@laemcasa.com.br",
  city: "Belém — PA",
} as const;

export const nav = [
  { href: "/cardapio", label: "Cardápio" },
  { href: "/#experiencias", label: "Experiências" },
  { href: "/sobrenos", label: "Sobre nós" },
  { href: "/calculadora", label: "Calculadora" },
  { href: "/seu-evento", label: "Seu evento" },
] as const;

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${site.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function instagramLink() {
  return `https://instagram.com/${site.instagram}`;
}
