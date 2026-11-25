import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { categoryLabel, categoryToCalcOption, getMenuItem, menu, relatedMenu } from "@/lib/data";
import { site } from "@/lib/site";
import OrderPanel from "@/components/OrderPanel";

export function generateStaticParams() {
  return menu.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getMenuItem(slug);
  if (!item) return { title: `Cardápio — ${site.name}` };
  return {
    title: `${item.title} — ${site.name}`,
    description: item.description,
    openGraph: {
      title: `${item.title} — ${site.name}`,
      description: item.description,
      images: [item.src],
    },
  };
}

export default async function MenuItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getMenuItem(slug);
  if (!item) notFound();

  const related = relatedMenu(item.slug, item.cats[0]);
  const calcOption = categoryToCalcOption[item.cats[0]];
  const calcHref = calcOption ? `/calculadora?item=${calcOption}` : "/calculadora";

  return (
    <main className="detail">
      <div className="container">
        <nav className="crumbs" aria-label="Você está em">
          <Link href="/">Início</Link>
          <span>/</span>
          <Link href="/cardapio">Cardápio</Link>
          <span>/</span>
          <b>{item.title}</b>
        </nav>

        <div className="detail-grid">
          <div className="detail-media">
            <Image
              src={item.src}
              alt={item.title}
              fill
              priority
              sizes="(max-width: 900px) 100vw, 55vw"
              style={{ objectFit: "cover" }}
            />
          </div>

          <div className="detail-info">
            <div className="detail-cats">
              {item.cats.map((c) => (
                <Link key={c} href="/cardapio" className="detail-cat">
                  {categoryLabel(c)}
                </Link>
              ))}
            </div>

            <h1>{item.title}</h1>
            <p className="detail-desc">{item.description}</p>

            <div className="detail-ideal">
              <span className="detail-ideal-title">Ideal para</span>
              <ul>
                {item.idealFor.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>

            <p className="detail-note">
              Tudo é preparado de forma artesanal e pode ser personalizado. As
              porções e a montagem são combinadas de acordo com o seu evento.
            </p>

            <Link href={`/cardapio/3d?item=${item.slug}`} className="btn btn-ghost">
              Ver em 3D
            </Link>

            <OrderPanel itemTitle={item.title} />

            <div className="detail-calc-hint">
              <p>Quer saber a média de quanto seu evento vai custar?</p>
              <Link href={calcHref} className="btn btn-dark">
                Simular orçamento →
              </Link>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="detail-related">
            <h2>Você também vai gostar</h2>
            <div className="related-grid">
              {related.map((r) => (
                <Link key={r.slug} href={`/cardapio/${r.slug}`} className="related-card">
                  <div className="related-media">
                    <Image
                      src={r.src}
                      alt={r.title}
                      fill
                      sizes="(max-width: 700px) 100vw, 33vw"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <span>{r.title}</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
