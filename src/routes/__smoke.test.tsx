/**
 * Tests d'intégration et de smoke de la refonte (tâche 12.3).
 *
 * Couvre les exigences testables hors propriétés pures :
 * - Requirement 1.7 : navigation entre pages publiques côté client, sans
 *   rechargement complet (le contenu est échangé via l'`<Outlet/>`, l'URL du
 *   navigateur n'est pas remplacée par un chargement de document).
 * - Requirements 1.3 / 10.3 : la transition vers la page cible aboutit dans un
 *   budget de temps généreux (< 2000 ms) sur le harnais de test.
 * - Requirement 11.2 : le message clé de la Page_Accueil est présent dans le
 *   DOM avant tout effet visuel décoratif (les animations « whileInView » ne
 *   conditionnent pas la présence du contenu, IntersectionObserver étant neutralisé).
 * - Requirement 12 (proxys testables) : génération des métadonnées par page
 *   (titre + description + canonical) et génération du sitemap / robots.txt à
 *   partir de la source unique `PUBLIC_ROUTES`.
 *
 * Note : « build et lint sans erreur » n'est pas exécutable dans un test
 * unitaire ; on en teste les proxys vérifiables (génération des métadonnées et
 * du sitemap, rendu de la page d'accueil) conformément à la tâche.
 *
 * Harnais : Vitest 3 (globals) + jsdom + @testing-library/react + user-event.
 *
 * Les pages réelles dépendent de TanStack Router (`<Link>`, `useNavigate`,
 * `useRouterState`) : elles ne peuvent se monter qu'à l'intérieur d'un
 * RouterProvider. On construit donc un mini-routeur en mémoire piloté par
 * `createMemoryHistory`.
 */

import { describe, it, expect, beforeAll } from "vitest";
import type { ComponentType } from "react";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Navbar } from "@/components/Navbar";
import { Route as IndexRoute } from "./_public.index";
import { Route as RootRoute } from "./__root";
const DefaultNotFound = RootRoute.options.notFoundComponent as import("@tanstack/react-router").NotFoundRouteComponent;
import { PUBLIC_PAGES } from "@/content/navigation";
import {
  PUBLIC_ROUTES,
  buildPublicPageMeta,
  buildPageMeta,
  toCanonicalUrl,
  TITLE_MIN,
  TITLE_MAX,
  DESCRIPTION_MIN,
  DESCRIPTION_MAX,
  type PageHead,
} from "@/lib/seo/meta";
import { buildSitemapXml, buildRobotsTxt, PROTOTYPE_PATHS } from "@/lib/seo/sitemap";

/** Budget de temps généreux pour la transition de navigation (Req. 1.3, 10.3). */
const NAV_TIME_BUDGET_MS = 2000;

/** Message_Pivot exact (Glossaire) — fragment distinctif, sans les guillemets/nbsp. */
const MESSAGE_PIVOT_FRAGMENT =
  "L'efficience par l'IA, sans dépendre d'infrastructures que vous ne contrôlez pas.";

// jsdom n'implémente ni `window.scrollTo` (appelé par TanStack Router lors de la
// restauration de défilement à chaque transition) ni `IntersectionObserver`
// (utilisé par framer-motion pour `whileInView`). On les neutralise pour éviter
// le bruit « Not implemented » et les fuites asynchrones après démontage, et
// pour vérifier que la présence du contenu ne dépend pas de l'observateur.
beforeAll(() => {
  window.scrollTo = (() => {}) as typeof window.scrollTo;
  if (!("IntersectionObserver" in window)) {
    class IntersectionObserverStub {
      root: Element | null = null;
      rootMargin = "";
      thresholds: ReadonlyArray<number> = [];
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords(): IntersectionObserverEntry[] {
        return [];
      }
    }
    // @ts-expect-error : stub de test pour jsdom
    window.IntersectionObserver = IntersectionObserverStub;
    // @ts-expect-error : stub de test pour jsdom
    globalThis.IntersectionObserver = IntersectionObserverStub;
  }
});

/**
 * Monte un mini-routeur en mémoire dont la racine rend la vraie
 * Navigation_Principale (`Navbar`) + l'`<Outlet/>`. Chaque page publique est
 * une route enfant rendant un marqueur identifiable (son chemin), ce qui suffit
 * à observer l'échange de contenu lors d'une navigation côté client sans
 * coupler le test au contenu réel de chaque page.
 */
async function renderAppNav(initialPath = "/") {
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
      component: () => (
        <main data-testid="route-content" data-path={page.path}>
          Contenu de la page : {page.label}
        </main>
      ),
    }),
  );

  const router = createRouter({
    routeTree: rootRoute.addChildren(childRoutes),
    history: createMemoryHistory({ initialEntries: [initialPath] }),
    defaultNotFoundComponent: DefaultNotFound,
  });

  const { container } = render(<RouterProvider router={router} />);
  await screen.findByRole("navigation");
  return { container, router };
}

describe("Smoke — navigation client sans rechargement (Req. 1.7, 1.3, 10.3)", () => {
  // Les pages cibles (toutes sauf l'accueil), atteintes depuis l'accueil.
  const TARGET_PAGES = PUBLIC_PAGES.filter((p) => p.path !== "/");

  it.each(TARGET_PAGES)(
    "navigue vers « $label » ($path) en échangeant le contenu via l'Outlet, sans rechargement, sous le budget de temps",
    async (page) => {
      const user = userEvent.setup();
      const { container } = await renderAppNav("/");

      // L'URL du document avant navigation (témoin d'absence de rechargement).
      const hrefBefore = window.location.href;

      // Contenu de l'accueil rendu au départ.
      const initial = screen.getByTestId("route-content");
      expect(initial.getAttribute("data-path")).toBe("/");

      // La Navigation_Principale est un élément persistant du layout : on
      // capture le nœud pour vérifier qu'il survit à la transition (pas de
      // remontage de document).
      const navBefore = container.querySelector("nav");
      expect(navBefore).not.toBeNull();

      // Activation du lien de navigation de la page cible.
      const link = screen.getByRole("link", { name: page.label });

      const start = performance.now();
      await user.click(link);

      // Le contenu cible apparaît (échange via l'Outlet).
      const target = await screen.findByText(`Contenu de la page : ${page.label}`);
      const elapsed = performance.now() - start;

      // Requirements 1.3 / 10.3 : transition aboutie sous le budget de temps.
      expect(elapsed).toBeLessThan(NAV_TIME_BUDGET_MS);

      // Le contenu a bien été échangé : la cible est rendue…
      expect(target).toBeInTheDocument();
      expect(screen.getByTestId("route-content").getAttribute("data-path")).toBe(page.path);

      // Requirement 1.7 : navigation côté client. L'URL du document n'a pas été
      // remplacée par un chargement complet (history en mémoire), et la
      // Navigation_Principale persistante n'a pas été remontée.
      expect(window.location.href).toBe(hrefBefore);
      expect(container.querySelector("nav")).toBe(navBefore);

      cleanup();
    },
  );

  it("revient à l'accueil depuis une page interne, toujours côté client", async () => {
    const user = userEvent.setup();
    await renderAppNav("/methode");

    expect(screen.getByTestId("route-content").getAttribute("data-path")).toBe("/methode");

    const hrefBefore = window.location.href;
    await user.click(screen.getByRole("link", { name: "Accueil" }));

    await screen.findByText("Contenu de la page : Accueil");
    expect(screen.getByTestId("route-content").getAttribute("data-path")).toBe("/");
    expect(window.location.href).toBe(hrefBefore);
  });
});

describe("Smoke — message clé de la Page_Accueil visible avant effets (Req. 11.2)", () => {
  // Composant de page extrait de la route fichier (la page n'exporte que `Route`).
  const PageIndex = IndexRoute.options.component as ComponentType;

  /**
   * Monte la vraie Page_Accueil dans un routeur en mémoire, avec une route
   * `/contact` (cible du CTA) afin que la résolution de navigation aboutisse.
   */
  async function renderHome() {
    const rootRoute = createRootRoute({
      component: () => (
        <>
          <PageIndex />
          <Outlet />
        </>
      ),
    });

    const contactRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: "/contact",
      component: () => <main>Page de prise de rendez-vous</main>,
    });

    const router = createRouter({
      routeTree: rootRoute.addChildren([contactRoute]),
      history: createMemoryHistory({ initialEntries: ["/"] }),
      defaultNotFoundComponent: DefaultNotFound,
    });

    const result = render(<RouterProvider router={router} />);
    // Attendre la résolution asynchrone du routeur : le message clé (titre)
    // doit être rendu avant toute assertion sur le contenu.
    await screen.findByRole("heading", { name: /gagnez en efficience/i });
    return result;
  }

  it("rend le Message_Pivot exact dans le DOM (IntersectionObserver neutralisé)", async () => {
    const { container } = await renderHome();

    // Le message-pivot est présent dans le DOM, indépendamment des animations
    // « whileInView » (l'observateur est stubbé et n'émet aucune entrée).
    expect(container.textContent ?? "").toContain(MESSAGE_PIVOT_FRAGMENT);
  });

  it("rend la désignation du Public_Cible et le titre clé above-the-fold", async () => {
    const { container } = await renderHome();
    const text = container.textContent ?? "";

    // Désignation explicite du Public_Cible.
    expect(text).toContain("Pour les organisations opérationnelles en RDC");

    // Titre clé (proposition de valeur) présent dès le rendu, avant tout effet.
    expect(screen.getByRole("heading", { name: /gagnez en efficience/i })).toBeInTheDocument();
  });
});

describe("Smoke — génération des métadonnées par page (Req. 12.1, 12.2, 12.4)", () => {
  /** Récupère le `<title>` d'un en-tête de page. */
  function titleOf(head: PageHead): string | undefined {
    const tag = head.meta.find((m): m is { title: string } => "title" in m);
    return tag?.title;
  }

  /** Récupère la meta `description` d'un en-tête de page. */
  function descriptionOf(head: PageHead): string | undefined {
    const tag = head.meta.find(
      (m): m is { name: string; content: string } => "name" in m && m.name === "description",
    );
    return tag?.content;
  }

  /** Récupère le `<link rel="canonical">` d'un en-tête de page. */
  function canonicalOf(head: PageHead): string | undefined {
    return head.links.find((l) => l.rel === "canonical")?.href;
  }

  it("PUBLIC_ROUTES couvre exactement les pages publiques (cohérence navigation ↔ métadonnées)", () => {
    expect(PUBLIC_ROUTES.length).toBe(PUBLIC_PAGES.length);
    const metaPaths = PUBLIC_ROUTES.map((r) => r.path).sort();
    const navPaths = PUBLIC_PAGES.map((p) => p.path).sort();
    expect(metaPaths).toEqual(navPaths);
  });

  it.each(PUBLIC_ROUTES)(
    "buildPublicPageMeta(« $path ») produit un titre, une description et un canonical conformes",
    (route) => {
      const head = buildPublicPageMeta(route.path);

      const title = titleOf(head);
      expect(title, `titre manquant pour ${route.path}`).toBeTruthy();
      expect(title!.length).toBeGreaterThanOrEqual(TITLE_MIN);
      expect(title!.length).toBeLessThanOrEqual(TITLE_MAX);

      const description = descriptionOf(head);
      expect(description, `description manquante pour ${route.path}`).toBeTruthy();
      expect(description!.length).toBeGreaterThanOrEqual(DESCRIPTION_MIN);
      expect(description!.length).toBeLessThanOrEqual(DESCRIPTION_MAX);

      // Canonical absolu et cohérent avec le chemin de la page.
      const canonical = canonicalOf(head);
      expect(canonical).toBe(toCanonicalUrl(route.path));
      expect(canonical!.startsWith("https://")).toBe(true);
    },
  );

  it("les titres des pages publiques sont uniques", () => {
    const titles = PUBLIC_ROUTES.map((r) => titleOf(buildPublicPageMeta(r.path)));
    expect(new Set(titles).size).toBe(titles.length);
  });

  it("buildPageMeta produit un en-tête conforme pour une entrée directe", () => {
    const head = buildPageMeta({
      path: "/exemple",
      title: "Titre d'exemple conforme",
      description:
        "Une description d'exemple suffisamment longue pour respecter la borne minimale de cinquante caractères.",
    });
    expect(titleOf(head)).toBe("Titre d'exemple conforme");
    expect(canonicalOf(head)).toBe(toCanonicalUrl("/exemple"));
  });
});

describe("Smoke — génération du sitemap et du robots.txt (Req. 12.6, 12.8, 13.5)", () => {
  it("buildSitemapXml inclut les URL canoniques des pages publiques", () => {
    const xml = buildSitemapXml(PUBLIC_ROUTES);
    for (const route of PUBLIC_ROUTES) {
      const url = toCanonicalUrl(route.path);
      expect(xml, `URL absente du sitemap : ${url}`).toContain(url);
    }
    // Exactement autant d'entrées <url> que de routes publiques.
    const count = (xml.match(/<url>/g) ?? []).length;
    expect(count).toBe(PUBLIC_ROUTES.length);
  });

  it("buildSitemapXml exclut les prototypes internes", () => {
    const xml = buildSitemapXml(PUBLIC_ROUTES);
    for (const proto of PROTOTYPE_PATHS) {
      expect(xml).not.toContain(`<loc>${toCanonicalUrl(proto)}</loc>`);
    }
  });

  it("buildSitemapXml exclut un prototype même s'il est injecté dans les routes", () => {
    const withProto = [
      ...PUBLIC_ROUTES,
      { path: "/tenant-0", title: "Proto", description: "x".repeat(60) },
    ];
    const xml = buildSitemapXml(withProto);
    expect(xml).not.toContain(toCanonicalUrl("/tenant-0"));
    expect((xml.match(/<url>/g) ?? []).length).toBe(PUBLIC_ROUTES.length);
  });

  it("buildRobotsTxt référence le sitemap et interdit les prototypes", () => {
    const robots = buildRobotsTxt();
    expect(robots).toContain("Sitemap:");
    expect(robots).toContain("/sitemap.xml");
    for (const proto of PROTOTYPE_PATHS) {
      expect(robots).toContain(`Disallow: ${proto}`);
    }
  });
});
