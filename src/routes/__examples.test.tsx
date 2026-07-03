/**
 * Tests d'exemple et de cas limites — couche de rendu des routes publiques.
 *
 * Couvre — tâche 12.2 :
 * - Pages distinctes accessibles par URL directe        (Requirements 1.1, 1.4)
 * - Page d'erreur « introuvable » + retour accueil       (Requirement 1.5)
 * - Above-the-fold de la Page_Accueil                    (Requirements 2.1, 2.2, 2.4, 2.5)
 * - Public cible unique (pas de liste sectorielle)        (Requirement 2.3)
 * - Fondateurs nommés avec leurs rôles                    (Requirements 7.2, 7.3, 7.4, 7.5)
 * - Produits SaaS nommés                                  (Requirement 8.3)
 * - Page_SaaS : absence de produit → CTA conservé         (Requirement 8.5)
 * - Page_Souverainete_RD                                  (Requirements 9.1, 9.2, 9.3, 9.4, 9.5)
 * - Footer légal                                          (Requirement 12.7)
 *
 * Harnais : Vitest 3 (globals) + jsdom + @testing-library/react. Les pages
 * publiques dépendent de TanStack Router (`<Link>`, `useNavigate`) ; on monte
 * donc un mini-routeur en mémoire dont la racine rend l'`<Outlet/>` et qui
 * enregistre les six routes publiques avec leurs composants réels. Le chemin
 * courant est imposé via `createMemoryHistory({ initialEntries })`, ce qui
 * permet d'observer le rendu de chaque page à son URL dédiée sans navigateur.
 *
 * jsdom n'implémente ni `window.scrollTo` (appelé par TanStack Router lors de
 * la restauration de défilement) ni `IntersectionObserver` (utilisé par
 * framer-motion pour `whileInView`) : on les neutralise dans `beforeAll`.
 */

import { describe, it, expect, beforeAll } from "vitest";
import type { ComponentType } from "react";
import type { NotFoundRouteComponent } from "@tanstack/react-router";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import { render, screen, cleanup, within, type RenderResult } from "@testing-library/react";

import { PUBLIC_PAGES, SECONDARY_PAGES } from "@/content/navigation";
import { selectRenderableProducts } from "@/content/rules/saas";
import { Footer } from "@/components/Footer";
import { TeamSection } from "@/components/TeamSection";

import { Route as RootRoute } from "./__root";
import { Route as IndexRoute } from "./_public.index";
import { Route as AProposRoute } from "./_public.a-propos";
import { Route as MethodeRoute } from "./_public.methode";
import { Route as OffresRoute } from "./_public.offres";
import { Route as PortfolioRoute } from "./_public.portfolio";
import { Route as FaqRoute } from "./_public.faq";
import { Route as SaasRoute } from "./_public.saas";
import { Route as SouveraineteRoute } from "./_public.souverainete-rd";
import { Route as ContactRoute } from "./_public.contact";

/** Message_Pivot exact du Glossaire (Requirements 2.2, 9.3). */
const MESSAGE_PIVOT =
  "L'efficience par l'IA, sans dépendre d'infrastructures que vous ne contrôlez pas.";

/** Routes montées dans le routeur de test (pages principales + secondaires). */
const TEST_PAGES = [...PUBLIC_PAGES, ...SECONDARY_PAGES];

/** Composants de page réels, extraits de chaque route fichier. */
const PAGE_COMPONENTS: Record<string, ComponentType> = {
  "/": IndexRoute.options.component as ComponentType,
  "/a-propos": AProposRoute.options.component as ComponentType,
  "/methode": MethodeRoute.options.component as ComponentType,
  "/offres": OffresRoute.options.component as ComponentType,
  "/portfolio": PortfolioRoute.options.component as ComponentType,
  "/faq": FaqRoute.options.component as ComponentType,
  "/saas": SaasRoute.options.component as ComponentType,
  "/souverainete-rd": SouveraineteRoute.options.component as ComponentType,
  "/contact": ContactRoute.options.component as ComponentType,
};

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
 * Monte un routeur en mémoire enregistrant les routes publiques (composants
 * réels) et positionné sur `path`. Le composant correspondant à l'URL est rendu
 * dans l'`<Outlet/>` de la racine.
 */
function renderAt(path: string): RenderResult {
  const rootRoute = createRootRoute({
    component: () => <Outlet />,
    notFoundComponent: RootRoute.options.notFoundComponent as NotFoundRouteComponent,
  });
  const children = TEST_PAGES.map((page) =>
    createRoute({
      getParentRoute: () => rootRoute,
      path: page.path,
      component: PAGE_COMPONENTS[page.path],
    }),
  );
  const router = createRouter({
    routeTree: rootRoute.addChildren(children),
    history: createMemoryHistory({ initialEntries: [path] }),
  });
  return render(<RouterProvider router={router} />);
}

/**
 * Monte le Footer dans un routeur en mémoire. Le Footer utilise des `<Link>`
 * TanStack Router : un contexte routeur est donc requis pour le rendu. Les deux
 * routes légales cibles sont enregistrées afin que les liens se résolvent.
 */
function renderFooter(): RenderResult {
  const rootRoute = createRootRoute({
    component: () => <Footer />,
    notFoundComponent: RootRoute.options.notFoundComponent as NotFoundRouteComponent,
  });
  const legalRoutes = ["/mentions-legales", "/confidentialite"].map((path) =>
    createRoute({
      getParentRoute: () => rootRoute,
      path,
      component: () => null,
    }),
  );
  const router = createRouter({
    routeTree: rootRoute.addChildren(legalRoutes),
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });
  return render(<RouterProvider router={router} />);
}

describe("Structure multi-pages — pages distinctes et URL directes", () => {
  // Requirement 1.1 : pages publiques principales distinctes, chacune à une URL unique.
  it("Requirement 1.1 : PUBLIC_PAGES expose huit chemins distincts et uniques", () => {
    const paths = PUBLIC_PAGES.map((p) => p.path);
    expect(new Set(paths).size).toBe(paths.length);
    expect(paths).toEqual([
      "/",
      "/a-propos",
      "/methode",
      "/offres",
      "/portfolio",
      "/saas",
      "/souverainete-rd",
      "/contact",
    ]);
  });

  // Requirement 1.1b : la FAQ est accessible mais hors navigation principale.
  it("Requirement 1.1b : FAQ est listée dans SECONDARY_PAGES, pas dans PUBLIC_PAGES", () => {
    const publicPaths = new Set(PUBLIC_PAGES.map((p) => p.path));
    expect(publicPaths.has("/faq")).toBe(false);
    expect(SECONDARY_PAGES.map((p) => p.path)).toContain("/faq");
  });

  // Requirement 1.4 : ouvrir directement une URL affiche la page correspondante.
  it.each([
    ["/", /Pour les organisations opérationnelles en RDC/],
    ["/a-propos", /organisations opérationnelles en RDC/],
    ["/methode", /Des phases concrètes, des livrables, des délais\./],
    ["/offres", /Trois paliers d'efficience/],
    ["/portfolio", /automatisation, chatbots, agents/],
    ["/faq", /Questions fréquentes/],
    ["/saas", /Opays Fox/],
    ["/souverainete-rd", /L'IA chez vous, sous votre contrôle\./],
    ["/contact", /Réservez votre Diagnostic gratuit\./],
  ])("Requirement 1.4 : l'URL directe %s rend sa page dédiée", async (path, marker) => {
    renderAt(path as string);
    expect(await screen.findByText(marker as RegExp)).toBeInTheDocument();
    cleanup();
  });

  // Requirement 1.5 : une URL inconnue rend la page 404 avec retour à l'accueil.
  it("Requirement 1.5 : une URL inconnue affiche la page introuvable et un lien retour accueil", async () => {
    const NotFound = RootRoute.options.notFoundComponent as NotFoundRouteComponent;
    expect(NotFound).toBeTypeOf("function");

    const rootRoute = createRootRoute({
      notFoundComponent: NotFound as NotFoundRouteComponent,
    });
    const indexRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: "/",
      component: () => <main>Accueil</main>,
    });
    const router = createRouter({
      routeTree: rootRoute.addChildren([indexRoute]),
      history: createMemoryHistory({ initialEntries: ["/url-inexistante-xyz"] }),
    });
    render(<RouterProvider router={router} />);

    expect(await screen.findByText("404")).toBeInTheDocument();
    expect(screen.getByText(/introuvable/i)).toBeInTheDocument();

    const homeLink = screen.getByRole("link", { name: /Retour à l'accueil/ });
    expect(homeLink).toHaveAttribute("href", "/");
  });
});

describe("Page_Accueil — above-the-fold et public cible unique", () => {
  // Requirement 2.1 : désignation explicite du Public_Cible.
  it("Requirement 2.1 : désigne explicitement les organisations opérationnelles en RDC", async () => {
    renderAt("/");
    expect(
      await screen.findByText(/Pour les organisations opérationnelles en RDC/),
    ).toBeInTheDocument();
  });

  // Requirements 2.2, 2.5 : Message_Pivot reproduit exactement.
  it("Requirements 2.2, 2.5 : reproduit exactement le Message_Pivot du glossaire", async () => {
    const { container } = renderAt("/");
    await screen.findByText(/Pour les organisations opérationnelles en RDC/);
    expect(container.textContent).toContain(MESSAGE_PIVOT);
  });

  // Requirement 2.4 : trois axes différenciants énoncés explicitement.
  it("Requirement 2.4 : énonce les trois axes — souveraineté, IA locale, ancrage RDC et terrain", async () => {
    renderAt("/");
    expect(await screen.findByText("Souveraineté")).toBeInTheDocument();
    expect(screen.getByText("IA locale")).toBeInTheDocument();
    expect(screen.getByText("Ancrage RDC et terrain")).toBeInTheDocument();
  });

  // Requirement 2.3 : public cible unique, sans liste de secteurs d'activité.
  it("Requirement 2.3 : présente un public unique sans liste sectorielle", async () => {
    const { container } = renderAt("/");
    await screen.findByText(/Pour les organisations opérationnelles en RDC/);
    // Une seule désignation de public, et aucune segmentation par secteurs.
    expect(screen.getByText(/Pour les organisations opérationnelles en RDC/)).toBeInTheDocument();
    expect(container.textContent ?? "").not.toMatch(/secteur/i);
  });
});

describe("Section_Equipe — fondateurs nommés avec leurs rôles", () => {
  /** Récupère la carte (élément parent du titre) d'un membre par son nom. */
  async function cardOf(fullName: string): Promise<HTMLElement> {
    const heading = await screen.findByText(fullName);
    return heading.parentElement as HTMLElement;
  }

  // Requirement 7.2 : Fénelon Lamsasiri — Directeur Général et Lead R&D.
  it("Requirement 7.2 : Fénelon Lamsasiri porte les rôles Directeur Général et Lead R&D", async () => {
    render(<TeamSection />);
    const card = await cardOf("Fénelon Lamsasiri");
    expect(within(card).getByText("Directeur Général")).toBeInTheDocument();
    expect(within(card).getByText("Lead R&D")).toBeInTheDocument();
  });

  // Requirement 7.3 : Prince Bagheni — Directeur Commercial (CSO).
  it("Requirement 7.3 : Prince Bagheni porte le rôle Directeur Commercial (CSO)", async () => {
    render(<TeamSection />);
    const card = await cardOf("Prince Bagheni");
    expect(within(card).getByText("Directeur Commercial (CSO)")).toBeInTheDocument();
  });

  // Requirement 7.4 : Patricia Zamwana — Ventes, Comptabilité, Trésorerie.
  it("Requirement 7.4 : Patricia Zamwana porte les rôles Ventes, Comptabilité et Trésorerie", async () => {
    render(<TeamSection />);
    const card = await cardOf("Patricia Zamwana");
    expect(within(card).getByText("Ventes")).toBeInTheDocument();
    expect(within(card).getByText("Comptabilité")).toBeInTheDocument();
    expect(within(card).getByText("Trésorerie")).toBeInTheDocument();
  });

  // Requirement 7.5 : Zaina Bwale Godlove — Ventes et Communication.
  it("Requirement 7.5 : Zaina Bwale Godlove porte les rôles Ventes et Communication", async () => {
    render(<TeamSection />);
    const card = await cardOf("Zaina Bwale Godlove");
    expect(within(card).getByText("Ventes")).toBeInTheDocument();
    expect(within(card).getByText("Communication")).toBeInTheDocument();
  });
});

describe("Page_SaaS — produits nommés et CTA conservé", () => {
  // Requirement 8.3 : la page inclut au minimum Opays Fox et Opays Biz.
  it("Requirement 8.3 : affiche Opays Fox et Opays Biz", async () => {
    renderAt("/saas");
    expect(await screen.findByText("Opays Fox")).toBeInTheDocument();
    expect(screen.getByText("Opays Biz")).toBeInTheDocument();
  });

  // Requirement 8.5 : sans produit affichable, la page conserve le CTA_Diagnostic global.
  it("Requirement 8.5 : aucun produit valide → liste vide (déclencheur du message d'absence)", () => {
    // Déclencheur : une entrée invalide n'est jamais retenue.
    expect(selectRenderableProducts([])).toEqual([]);
    expect(
      selectRenderableProducts([{ name: "", description: "x".repeat(50), accessUrl: null }]),
    ).toEqual([]);
  });

  it("Requirement 8.5 : le CTA_Diagnostic global reste présent sur la Page_SaaS", async () => {
    renderAt("/saas");
    expect(
      await screen.findByText(/Un produit à déployer dans votre organisation/),
    ).toBeInTheDocument();
    const ctaButtons = screen
      .getAllByRole("button")
      .filter((b) => /Diagnostic gratuit/.test(b.textContent ?? ""));
    expect(ctaButtons.length).toBeGreaterThanOrEqual(1);
  });
});

describe("Page_Souverainete_RD — IA locale, transformation et R&D", () => {
  // Requirement 9.1 : section IA locale + principe « sans dépendre d'infrastructures... ».
  it("Requirement 9.1 : présente une section IA locale énonçant le principe de souveraineté", async () => {
    const { container } = renderAt("/souverainete-rd");
    expect(await screen.findByText("Une IA qui s'exécute chez vous.")).toBeInTheDocument();
    expect(container.textContent).toContain(
      "sans dépendre d'infrastructures que vous ne contrôlez pas",
    );
    expect(screen.getByText("Ancrage RDC et terrain")).toBeInTheDocument();
  });

  // Requirement 9.2 : patrimoine cognitif propriétaire, élément du Palier_Transformation.
  it("Requirement 9.2 : décrit le patrimoine cognitif propriétaire et son contrôle conjoint", async () => {
    const { container } = renderAt("/souverainete-rd");
    await screen.findByText("Une IA qui s'exécute chez vous.");
    expect(screen.getByText(/Patrimoine cognitif propriétaire/)).toBeInTheDocument();
    expect(container.textContent).toContain("sous contrôle conjoint d'Opays et du client");
  });

  // Requirement 9.4 : contrôle d'accès par rôles (RBAC), élément du Palier_Transformation.
  it("Requirement 9.4 : décrit le contrôle d'accès par rôles (RBAC)", async () => {
    const { container } = renderAt("/souverainete-rd");
    await screen.findByText("Une IA qui s'exécute chez vous.");
    expect(screen.getByText(/Contrôle d'accès par rôles \(RBAC\)/)).toBeInTheDocument();
    expect(container.textContent).toContain(
      "restreint les accès aux données et aux modèles selon les rôles",
    );
  });

  // Requirement 9.3 : Message_Pivot exact présent (et lien vers l'accueil).
  it("Requirement 9.3 : affiche le Message_Pivot exact et un lien vers l'accueil", async () => {
    const { container } = renderAt("/souverainete-rd");
    await screen.findByText("Une IA qui s'exécute chez vous.");
    expect(container.textContent).toContain(MESSAGE_PIVOT);
    const homeLink = screen.getByRole("link", { name: /Revenir à l'accueil/ });
    expect(homeLink).toHaveAttribute("href", "/");
  });

  // Requirement 9.5 : branche recherche nommant Fénelon Lamsasiri comme Lead R&D.
  it("Requirement 9.5 : nomme Fénelon Lamsasiri comme Lead R&D dans la branche recherche", async () => {
    renderAt("/souverainete-rd");
    await screen.findByText("Une IA qui s'exécute chez vous.");
    expect(screen.getAllByText("Fénelon Lamsasiri").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Lead R&D").length).toBeGreaterThanOrEqual(1);
  });
});

describe("Footer — liens légaux (Requirement 12.7)", () => {
  it("Requirement 12.7 : fournit les liens mentions légales et politique de confidentialité", async () => {
    renderFooter();
    expect(await screen.findByRole("link", { name: "Mentions légales" })).toHaveAttribute(
      "href",
      "/mentions-legales",
    );
    expect(screen.getByRole("link", { name: "Politique de confidentialité" })).toHaveAttribute(
      "href",
      "/confidentialite",
    );
  });
});
