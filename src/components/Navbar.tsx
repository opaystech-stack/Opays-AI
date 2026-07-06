import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ExternalLink as ExternalLinkIcon, Menu, X } from "lucide-react";
const logoIcon = "/logo.png";
import { PUBLIC_PAGES, SECONDARY_PAGES } from "@/content/navigation";
import { EXTERNAL_PROJECTS } from "@/content/externalProjects";
import { resolveCta } from "@/content/rules/cta";
import { resolveExternalLink } from "@/content/rules/externalLinks";

/**
 * Navigation_Principale : liens pilotés par `PUBLIC_PAGES` + un lien direct vers
 * la page « Services » (pas de sous-menu). État actif via `useRouterState`,
 * CTA unique via `resolveCta()`, liens externes conditionnels, navigation client.
 */

const ALL_NAV_PAGES = [...PUBLIC_PAGES, ...SECONDARY_PAGES];

type NavTo = Parameters<typeof Link>[0]["to"];

const cta = resolveCta();

const externalLinks = EXTERNAL_PROJECTS.map(resolveExternalLink).filter(
  (link): link is Extract<typeof link, { visible: true }> => link.visible,
);

const linkBase =
  "text-[13px] font-medium transition-colors relative after:absolute after:left-0 after:-bottom-1 after:h-px after:bg-primary after:transition-all";

/** Liste affichée : pages publiques uniquement (source unique de vérité). */
const NAV_LINKS: { path: string; label: string }[] = PUBLIC_PAGES;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const isActive = (path: string) => pathname === path;

  return (
    <header className="fixed inset-x-0 top-6 z-50 px-6">
      <div className="mx-auto max-w-5xl rounded-full border border-white/30 bg-background/20 backdrop-blur-lg shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300">
        <div className="flex h-12 items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <img
              src={logoIcon}
              alt="Opays Tech"
              width={24}
              height={24}
              decoding="async"
              className="h-6 w-6 object-contain bg-transparent transition-transform group-hover:scale-110"
            />
            <span className="font-display text-sm font-semibold tracking-tight">
              OPAYS <span className="text-gradient">TECH</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((page) => {
              const active = isActive(page.path);
              return (
                <Link
                  key={page.path}
                  to={page.path as NavTo}
                  aria-current={active ? "page" : undefined}
                  className={`${linkBase} ${
                    active
                      ? "text-foreground after:w-full"
                      : "text-muted-foreground hover:text-foreground after:w-0 hover:after:w-full"
                  }`}
                >
                  {page.label}
                </Link>
              );
            })}
            {externalLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
                <ExternalLinkIcon size={12} aria-label="Lien externe (nouvel onglet)" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4 shrink-0">
            <Link
              to={cta.target as NavTo}
              className="hidden md:inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_20px_rgba(37,99,235,0.6)] transition-all"
            >
              {cta.label}
            </Link>
            <button
              className="md:hidden text-foreground p-1"
              onClick={() => setOpen((o) => !o)}
              aria-label="Menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden mt-2 rounded-2xl border border-white/30 bg-background/90 backdrop-blur-xl p-4 space-y-1 shadow-xl">
          {NAV_LINKS.map((page) => {
            const active = isActive(page.path);
            return (
              <Link
                key={page.path}
                to={page.path as NavTo}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={`block text-sm font-medium px-2 py-1.5 ${
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {page.label}
              </Link>
            );
          })}
          {externalLinks.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground px-2 py-1.5"
            >
              {link.label}
              <ExternalLinkIcon size={14} aria-label="Lien externe (nouvel onglet)" />
            </a>
          ))}
          <Link
            to={cta.target as NavTo}
            onClick={() => setOpen(false)}
            className="mt-2 flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]"
          >
            {cta.label}
          </Link>
        </div>
      )}
    </header>
  );
}
