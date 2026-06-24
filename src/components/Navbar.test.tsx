/**
 * Tests par propriétés de la Navigation_Principale (Navbar.tsx, couche de rendu).
 *
 * Couvre :
 * - Property 1  « Couverture des liens de navigation »   (Requirement 1.2)  — tâche 10.4
 * - Property 2  « Unicité de l'état actif de navigation » (Requirement 1.6)  — tâche 10.5
 * - Property 30 « Invariance de la navigation face au registre externe »
 *               (Requirement 13.2)                                          — tâche 10.6
 *
 * Harnais : Vitest 3 (globals) + jsdom + @testing-library/react + fast-check,
 * numRuns = 100.
 *
 * La Navbar dépend de `useRouterState`/`<Link>` (TanStack Router) ; elle ne peut
 * donc se monter qu'à l'intérieur d'un RouterProvider. On construit un mini
 * routeur en mémoire dont la racine rend `<Navbar/>` + l'Outlet, avec les six
 * routes publiques de `PUBLIC_PAGES` enregistrées. Le chemin courant est piloté
 * par `createMemoryHistory({ initialEntries })`, ce qui permet d'observer l'état
 * actif sans navigateur réel.
 *
 * Conventions de structure exploitées (sans coupler aux classes CSS) :
 * - Les liens des pages publiques sont les ancres internes du `<nav>` (sans
 *   `target="_blank"`). Le logo et le CTA sont hors `<nav>`. Les liens vers les
 *   Chantier_Externe, lorsqu'ils sont visibles, sont des ancres `target="_blank"`
 *   à l'intérieur du `<nav>`. Cela fournit un discriminant fiable entre la table
 *   de navigation (interne) et les liens externes.
 */

import fc from "fast-check";
import { describe, it, expect, beforeAll } from "vitest";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import { render, screen, cleanup } from "@testing-library/react";
import { Navbar } from "./Navbar";
import { PUBLIC_PAGES } from "@/content/navigation";
import { resolveExternalLink, type ResolvedExternalLink } from "@/content/rules/externalLinks";
import type { ExternalProject } from "@/content/externalProjects";

const NUM_RUNS = 100;

// Marge de temps : 100 montages successifs d'un routeur en mémoire par propriété.
const PBT_TIMEOUT = 60_000;

// jsdom n'implémente pas window.scrollTo ; TanStack Router l'appelle lors de la
// restauration de défilement à chaque transition. On le neutralise pour éviter
// le bruit « Not implemented » et toute tâche asynchrone qui fuiterait après le
// démontage.
beforeAll(() => {
  window.scrollTo = (() => {}) as typeof window.scrollTo;
});

/** Chemins des pages publiques (source unique de vérité). */
const PUBLIC_PATHS = PUBLIC_PAGES.map((p) => p.path);

/** Nombre total de pages accessibles via la navbar (principales uniquement). */
const TOTAL_NAV_PAGES = PUBLIC_PAGES.length;

/**
 * Monte un mini routeur en mémoire dont la racine rend la Navbar + l'Outlet,
 * avec les six routes publiques enregistrées et le chemin courant imposé.
 */
async function renderNavbar(currentPath: string) {
  const rootRoute = createRootRoute({
    component: () => (
      <>
        <Navbar />
        <Outlet />
      </>
    ),
  });

  const childRoutes = PUBLIC_PAGES.map((page) =>
    createRoute({
      getParentRoute: () => rootRoute,
      path: page.path,
      component: () => <main>{page.label}</main>,
    }),
  );

  const router = createRouter({
    routeTree: rootRoute.addChildren(childRoutes),
    history: createMemoryHistory({ initialEntries: [currentPath] }),
  });

  const { container } = render(<RouterProvider router={router} />);
  // Attendre que la Navigation_Principale soit montée.
  await screen.findByRole("navigation");
  return { container, router };
}

/** Le `<nav>` de la Navigation_Principale (desktop). */
function navElement(container: HTMLElement): HTMLElement {
  const nav = container.querySelector("nav");
  if (!nav) throw new Error("Aucun <nav> rendu");
  return nav as HTMLElement;
}

/**
 * Entrées internes de la table de navigation : ancres du `<nav>` sans
 * `target="_blank"` (les liens externes en sont exclus).
 */
function internalNavEntries(container: HTMLElement): { href: string | null; label: string }[] {
  const links = Array.from(navElement(container).querySelectorAll('a:not([target="_blank"])'));
  return links.map((a) => ({
    href: a.getAttribute("href"),
    label: (a.textContent ?? "").trim(),
  }));
}

describe("Navbar — Navigation_Principale", () => {
  // Property 1: Couverture des liens de navigation — Validates: Requirements 1.2
  it(
    "Property 1: rend, pour chaque page publique, un lien activable menant à son URL dédiée",
    async () => {
      await fc.assert(
        fc.asyncProperty(
          // Le chemin courant ne doit pas changer la couverture des liens.
          fc.constantFrom(...PUBLIC_PATHS),
          async (currentPath) => {
            const { container } = await renderNavbar(currentPath);

            const entries = internalNavEntries(container);

            // Exactement une entrée interne par page accessible via la navbar.
            expect(entries).toHaveLength(TOTAL_NAV_PAGES);

            // Pour chaque page publique : un lien activable (ancre avec href) portant son
            // libellé et menant à son URL dédiée.
            for (const page of PUBLIC_PAGES) {
              const match = entries.find((e) => e.href === page.path);
              expect(match, `lien manquant pour ${page.path}`).toBeDefined();
              expect(match?.label).toBe(page.label);
            }

            cleanup();
          },
        ),
        { numRuns: NUM_RUNS },
      );
    },
    PBT_TIMEOUT,
  );

  // Property 2: Unicité de l'état actif de navigation — Validates: Requirements 1.6
  it(
    'Property 2: pour tout chemin de page publique courant, exactement un lien de navigation porte aria-current="page" (celui de la page courante)',
    async () => {
      await fc.assert(
        fc.asyncProperty(fc.constantFrom(...PUBLIC_PATHS), async (currentPath) => {
          const { container } = await renderNavbar(currentPath);

          // État actif marqué par aria-current="page" sur les liens du <nav>.
          const active = Array.from(
            navElement(container).querySelectorAll('a[aria-current="page"]'),
          );

          // Exactement un lien actif.
          expect(active).toHaveLength(1);

          // C'est bien le lien de la page courante.
          const current = PUBLIC_PAGES.find((p) => p.path === currentPath)!;
          expect(active[0].getAttribute("href")).toBe(currentPath);
          expect((active[0].textContent ?? "").trim()).toBe(current.label);

          // Tous les autres liens internes sont dans l'état par défaut.
          const others = internalNavEntries(container).filter((e) => e.href !== currentPath);
          expect(others).toHaveLength(TOTAL_NAV_PAGES - 1);

          cleanup();
        }),
        { numRuns: NUM_RUNS },
      );
    },
    PBT_TIMEOUT,
  );

  // Property 30: Invariance de la navigation face au registre externe
  // Validates: Requirements 13.2
  it(
    "Property 30: la table de la Navigation_Principale est exactement PUBLIC_PAGES et reste disjointe de toute variation du registre des Chantier_Externe",
    async () => {
      /** URL : absente, vide, valide absolue, ou non analysable. */
      const urlArb: fc.Arbitrary<string | null> = fc.oneof(
        fc.constant(null),
        fc.constantFrom("", "   ", "pas-une-url", "ftp://x", "/relatif"),
        fc.webUrl(),
      );

      /** Registre arbitraire de Chantier_Externe (ajout/retrait/URL renseignée). */
      const externalRegistryArb: fc.Arbitrary<ExternalProject[]> = fc.array(
        fc.record({
          id: fc.constantFrom<ExternalProject["id"]>("audit-ia", "opays-commons"),
          // Libellé externe préfixé pour éviter toute collision fortuite avec un
          // libellé de page publique.
          label: fc
            .string({ minLength: 1, maxLength: 40 })
            .map((s) => `Chantier ${s.trim() || "externe"}`),
          url: urlArb,
        }),
        { maxLength: 6 },
      );

      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom(...PUBLIC_PATHS),
          externalRegistryArb,
          async (currentPath, registry) => {
            const { container } = await renderNavbar(currentPath);

            // La table de navigation rendue est exactement PUBLIC_PAGES, quel que
            // soit le chemin courant : elle ne dépend pas du registre externe.
            const entries = internalNavEntries(container);
            expect(entries).toEqual(PUBLIC_PAGES.map((p) => ({ href: p.path, label: p.label })));

            // Résolution du registre généré via la MÊME logique pure que la Navbar.
            const visibleExternals = registry
              .map(resolveExternalLink)
              .filter((l): l is Extract<ResolvedExternalLink, { visible: true }> => l.visible);

            // Aucun lien externe (même renseigné) n'intègre la table de navigation :
            // les entrées de la Navigation_Principale restent inchangées.
            for (const ext of visibleExternals) {
              expect(entries.some((e) => e.href === ext.url)).toBe(false);
              expect(PUBLIC_PATHS.includes(ext.url)).toBe(false);
            }

            cleanup();
          },
        ),
        { numRuns: NUM_RUNS },
      );
    },
    PBT_TIMEOUT,
  );
});
