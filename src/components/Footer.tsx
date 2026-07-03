import { Link } from "@tanstack/react-router";
import logoIcon from "/logo.png";
import { SERVICE_CATALOG } from "@/content/services/catalog";

type NavTo = Parameters<typeof Link>[0]["to"];

const NAV: { path: string; label: string }[] = [
  { path: "/", label: "Accueil" },
  { path: "/services", label: "Services" },
  { path: "/methode", label: "Méthode" },
  { path: "/offres", label: "Offres" },
  { path: "/contact", label: "Contact" },
];

const SECONDARY_NAV: { path: string; label: string }[] = [
  { path: "/a-propos", label: "À propos" },
  { path: "/portfolio", label: "Portfolio" },
  { path: "/saas", label: "SaaS" },
  { path: "/souverainete-rd", label: "R&D" },
  { path: "/faq", label: "FAQ" },
];

/**
 * Pied de page global (rendu sur toutes les pages via le layout `_public`).
 * Année de copyright dynamique (12.1) ; liens légaux fonctionnels vers
 * `/mentions-legales` et `/confidentialite` (8.3–8.5).
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 bg-card/20">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <img
                src={logoIcon}
                alt="Opays Tech"
                width={28}
                height={28}
                loading="lazy"
                decoding="async"
                className="h-7 w-7"
              />
              <span className="font-display text-sm font-semibold">
                OPAYS <span className="text-gradient">TECH</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Cabinet d'ingénierie de l'efficience. Nous structurons vos opérations grâce à l'IA,
              sous votre contrôle, pour des résultats mesurables.
            </p>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--neon-cyan)]">
              Navigation
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {NAV.map((n) => (
                <li key={n.path}>
                  <Link
                    to={n.path as NavTo}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--neon-cyan)]">
              Pages
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {SECONDARY_NAV.map((n) => (
                <li key={n.path}>
                  <Link
                    to={n.path as NavTo}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--neon-cyan)]">
              Services
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {SERVICE_CATALOG.map((s) => (
                <li key={s.path}>
                  <Link
                    to={s.path as NavTo}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--neon-cyan)]">
              Légal
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link
                  to="/mentions-legales"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link
                  to="/confidentialite"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Nous contacter
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border/50 pt-6 text-xs text-muted-foreground">
          © {currentYear} Opays Tech. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
