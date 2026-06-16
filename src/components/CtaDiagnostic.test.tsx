/**
 * Test par propriété du composant CtaDiagnostic (couche de rendu).
 *
 * Couvre :
 * - Property 20 « Action principale unique et présente » (Requirements 10.2, 10.5)
 *
 * Harnais : Vitest 3 (globals) + jsdom + @testing-library/react + fast-check,
 * numRuns = 100.
 *
 * CtaDiagnostic dépend de `useNavigate` (TanStack Router) ; il ne peut donc se
 * monter qu'à l'intérieur d'un RouterProvider. On construit un mini-routeur en
 * mémoire (createRootRoute + route /contact, createRouter + createMemoryHistory)
 * dans lequel le CTA est rendu une seule fois depuis la racine, à côté de
 * l'Outlet. Cela garantit qu'il reste monté quelle que soit la page courante,
 * ce qui permet de vérifier l'invariant « action principale unique et présente »
 * et la préservation du contexte de navigation.
 *
 * La source de vérité du libellé/cible reste `CTA_DIAGNOSTIC` (navigation.ts),
 * résolue par `resolveCta()` : les assertions y sont adossées plutôt que de
 * dupliquer la chaîne attendue.
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
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CtaDiagnostic, type CtaDiagnosticProps } from "./CtaDiagnostic";
import { resolveCta } from "@/content/rules/cta";
import { CTA_DIAGNOSTIC } from "@/content/navigation";

const NUM_RUNS = 100;

// Marge de temps : jusqu'à 100 montages successifs d'un routeur en mémoire par
// propriété.
const PBT_TIMEOUT = 60_000;

// jsdom n'implémente ni window.scrollTo (appelé par TanStack Router lors de la
// restauration de défilement à chaque transition) ni IntersectionObserver
// (utilisé par framer-motion). On les neutralise comme dans les autres tests de
// composants (Navbar.test.tsx, _public.offres.test.tsx) pour éviter le bruit
// « Not implemented » et surtout toute tâche asynchrone qui fuiterait en
// accédant à `window` après le démontage de l'environnement de test.
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
 * Monte un mini-routeur en mémoire :
 * - la racine rend l'unique CtaDiagnostic + l'Outlet (le CTA reste donc monté
 *   quelle que soit la route, ce qui modélise sa présence sur chaque page) ;
 * - une route "/" et une route "/contact" (cible du CTA) existent pour que la
 *   navigation se résolve.
 */
async function renderCta(props: CtaDiagnosticProps) {
  const rootRoute = createRootRoute({
    component: () => (
      <>
        <CtaDiagnostic {...props} />
        <Outlet />
      </>
    ),
  });

  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: () => <main>Page courante</main>,
  });

  const contactRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/contact",
    component: () => <main>Page de prise de rendez-vous</main>,
  });

  const router = createRouter({
    routeTree: rootRoute.addChildren([indexRoute, contactRoute]),
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });

  render(<RouterProvider router={router} />);
  const button = await screen.findByRole("button");
  return { router, button };
}

describe("CtaDiagnostic", () => {
  it("rend l'unique CTA portant le libellé constant « Diagnostic gratuit »", async () => {
    const { button } = await renderCta({});
    expect(button.textContent?.trim()).toBe("Diagnostic gratuit");
    expect(resolveCta()).toEqual({ label: "Diagnostic gratuit", target: "/contact" });
    cleanup();
  });

  // Property 20: Action principale unique et présente — Validates: Requirements 10.2, 10.5
  it("Property 20: pour toute combinaison de props, rend exactement une action principale (le CTA), au libellé/cible invariants", async () => {
    const { label, target } = resolveCta();

    await fc.assert(
      fc.asyncProperty(
        fc.record({
          variant: fc.option(fc.constantFrom("primary", "secondary"), { nil: undefined }),
          size: fc.option(fc.constantFrom("sm", "md", "lg"), { nil: undefined }),
          showIcon: fc.option(fc.boolean(), { nil: undefined }),
          fullWidth: fc.option(fc.boolean(), { nil: undefined }),
        }),
        async (props) => {
          const { button } = await renderCta(props as CtaDiagnosticProps);

          // Présence : au moins une occurrence du CTA.
          // Unicité : exactement un bouton (l'action principale) est rendu.
          const buttons = screen.getAllByRole("button");
          expect(buttons).toHaveLength(1);

          // Invariant de libellé : strictement identique (texte et casse) à la
          // constante unique CTA_DIAGNOSTIC, indépendamment des props visuelles.
          expect(button.textContent?.trim()).toBe(label);
          expect(label).toBe(CTA_DIAGNOSTIC.label);

          // Invariant de cible : l'action principale vise la Page_Contact.
          expect(target).toBe("/contact");

          cleanup();
        },
      ),
      { numRuns: NUM_RUNS },
    );
  }, PBT_TIMEOUT);

  // Best-effort : confirme que l'activation tente la navigation vers /contact et
  // que, dans tous les cas, le contexte (le CTA) reste présent sur la page —
  // aucune perte de contexte ni disparition de l'action principale.
  it("préserve le contexte de navigation à l'activation (CTA toujours présent)", async () => {
    const user = userEvent.setup();
    const { button, router } = await renderCta({});

    await user.click(button);

    // On attend que la transition du routeur soit complètement résolue (la
    // navigation TanStack Router programme des tâches asynchrones — résolution
    // de la route, restauration de défilement — qui, si elles ne sont pas
    // attendues, s'exécutent après le démontage et accèdent à `window` une fois
    // l'environnement de test détruit). On attend donc d'atteindre la cible,
    // puis on laisse le dernier cycle de chargement se résoudre.
    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/contact");
    });
    await router.latestLoadPromise?.catch(() => {});

    // Aucune rupture de contexte : le CTA reste monté (présent) et la navigation
    // a abouti vers /contact, soit un message d'indisponibilité est signalé tout
    // en restant sur place.
    await waitFor(() => {
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    const onContact = router.state.location.pathname === "/contact";
    const alert = screen.queryByRole("alert");
    expect(onContact || alert !== null).toBe(true);
    if (alert) {
      expect(alert).toHaveTextContent(/indisponible/i);
    }

    cleanup();
  });
});
