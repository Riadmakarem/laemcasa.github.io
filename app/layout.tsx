import type { Metadata } from "next";
import { Playfair_Display, Nunito, Dancing_Script } from "next/font/google";
import { site } from "@/lib/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-nunito",
  display: "swap",
});

const script = Dancing_Script({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-script",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://laemcasa.com.br"),
  title: `${site.name} — ${site.tagline}`,
  description:
    "Lá em Casa: finger food, buffet completo, mesas elegantes, boxes gourmet e sobremesas para tornar cada evento inesquecível. Sabores que reúnem sua família em volta da mesa.",
  keywords: [
    "buffet",
    "finger food",
    "mesas elegantes",
    "boxes gourmet",
    "sobremesas",
    "eventos",
    "Lá em Casa",
  ],
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description:
      "Finger food, buffet, mesas elegantes, boxes gourmet e sobremesas para o seu evento.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${nunito.variable} ${script.variable}`}>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
