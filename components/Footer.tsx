import Image from "next/image";
import { instagramLink, nav, site, whatsappLink } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <a href="#top" className="brand">
            <Image
              src="/logolaemcasa.png"
              alt={`Logo ${site.name}`}
              width={80}
              height={80}
              className="brand-logo"
            />
            <span className="brand-name">
              <span className="script" style={{ fontSize: "1.5rem", color: "var(--creme)" }}>
                Lá em casa
              </span>
              <small>{site.tagline}</small>
            </span>
          </a>

          <nav className="footer-links">
            {nav.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="footer-bottom">
          <span>
            &copy; {new Date().getFullYear()} {site.name}. Sabores que reúnem a família.
          </span>
          <span>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>{" "}
            &middot;{" "}
            <a href={instagramLink()} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
