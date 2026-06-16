/**
 * Tests par propriétés de la Page_Offres (_public.offres.tsx, couche de rendu).
 *
 * Couvre — tâche 11.4 :
 * - Property 4 « Absence de montant tarifaire »                 (Requirement 3.2)
 * - Property 5 « Unicité et placement des marqueurs de palier » (Requirements 3.3, 3.4)
 * - Property 6 « CTA présent dans chaque palier »               (Requirement 3.5)
 *
 * Harnais : Vitest 3 (globals) + jsdom + @testing-library/react + fast-check,
 * numRuns = 100.
 *
 * La Page_Offres rend un `CtaDiagnostic` par Palier, lequel dépend de
 * `useNavigate` (TanStack Router) ; le composant ne peut donc se monter qu'à
 * l'intérieur d'un RouterProvider. On construit un mini-routeur en mémoire dont
 * la racine rend le composant de page + l'Outlet, avec une route `/contact`
 * (cible du CTA) enregistrée, afin que la résolution de navigation aboutisse.
 *
 * Le composant consomme la source unique `OFFERS` via `selectRenderableOffers`
 * (aucune prop d'entrée) : son rendu est déterministe. La variation des
 * propriétés porte donc sur le Palier rendu (`fc.constantFrom`) pour vérifier
 * les invariants par carte, complétés par des invariants globaux sur la page.
 *
 * Conventions de structure exploitées (sans coupler aux classes CSS) :
 * - chaque Palier est rendu dans une `<article>` (role « article ») ;
 * - chaque carte est identifiée par le titre de son Offre (source `OFFERS`) ;
 * - les marqueurs « Recommandé » et « Porte d'entrée » sont les libellés
 *   capitalisés des badges, distincts des mentions éditoriales en minuscules.
 */

import fc from "fast-check";
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
import { render, screen, cleanup, within } from "@testing-library/react";
import { Route as OffresRoute } from "./_public.offres";
import { OFFERS, type OfferTier } from "@/content/offers";
import { selectRenderableOffers } from "@/content/rules/offers";
import { resolveCta } from "@/content/rules/cta";
import { CTA_DIAGNOSTIC } from "@/content/navigation";

const NUM_RUNS = 100;

// Marge de temps : jusqu'à 100 montages successifs d'un routeur en mémoire par
// propriété.
const PBT_TIMEOUT = 60_000;

// Composant de page extrait de la route fichier (la page n'exporte que `Route`).
const PageOffres = OffresRoute.options.component as ComponentType;

// Paliers effectivement rendus (résumés valides), source de la variation fc.
const RENDERABLE_TIERS: OfferTier[] = selectRenderableOffers(OFFERS).renderable.map(
  (o) => o.tier,
);

/**
 * Détecteur de montant / unité monétaire. On vise les symboles et codes ISO
 * usuels ainsi que les mots « euro(s) » / « dollar(s) ». On exclut volontairement
 * « prix » et « tarif », qui apparaissent légitimement dans la promesse
 * éditoriale « sans prix avant la compréhension du besoin ».
 */
const CURRENCY_PATTERN =
  /[€$£¥]|\b(?:eur|usd|gbp|chf|cad|euros?|dollars?)\b/i;

/** Marqueur de Palier recommandé (badge capitalisé). */
const RECOMMENDED_MARKER = /Recommandé/;
/** Marqueur de porte d'entrée (badge capitalisé, apostrophe droite ou typographique). */
const ENTRY_MARKER = /Porte d['’]entrée/;

// jsdom n'implémente ni window.scrollTo (appelé par TanStack Router lors de la
// restauration de défilement) ni IntersectionObserver (utilisé par framer-motion
// pour `whileInView`). On les neutralise pour éviter le bruit et les fuites
// asynchrones après démontage.
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
 * - la racine rend la Page_Offres + l'Outlet ;
 * - une route `/contact` (cible du CTA) existe pour que la navigation se résolve.
 * Retourne le conteneur et les cartes de Palier rendues.
 */
async function renderOffresPage() {
  const rootRoute = createRootRoute({
    component: () => (
      <>
        <PageOffres />
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
  });

  const { container } = render(<RouterProvider router={router} />);
  const articles = (await screen.findAllByRole("article")) as HTMLElement[];
  return { container, router, articles };
}

/** Retrouve la carte d'un Palier via le titre de son Offre (source `OFFERS`). */
function cardForTier(articles: HTMLElement[], tier: OfferTier): HTMLElement {
  const title = OFFERS.find((o) => o.tier === tier)!.title;
  const card = articles.find((a) => (a.textContent ?? "").includes(title));
  if (!card) throw new Error(`Carte de Palier introuvable pour « ${tier} »`);
  return card;
}

/** Compte les occurrences (globales) d'un motif dans un texte. */
function countMatches(text: string, re: RegExp): number {
  return (text.match(re) ?? []).length;
}

describe("Page_Offres — rendu des Paliers", () => {
  // Property 4: Absence de montant tarifaire — Validates: Requirements 3.2
  it("Property 4: pour toute offre rendue, ni la page ni la carte du Palier ne contiennent de montant ou d'unité monétaire", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...RENDERABLE_TIERS),
        async (tier) => {
          const { container, articles } = await renderOffresPage();

          // Invariant global : aucune trace monétaire sur l'ensemble de la page.
          expect(CURRENCY_PATTERN.test(container.textContent ?? "")).toBe(false);

          // Invariant par Palier : la carte sélectionnée n'expose aucun montant.
          const card = cardForTier(articles, tier);
          expect(CURRENCY_PATTERN.test(card.textContent ?? "")).toBe(false);

          cleanup();
        },
      ),
      { numRuns: NUM_RUNS },
    );
  }, PBT_TIMEOUT);

  // Property 5: Unicité et placement des marqueurs de palier
  // Validates: Requirements 3.3, 3.4
  it("Property 5: « Recommandé » n'est présent que sur le Palier_Systeme et « Porte d'entrée » que sur le Palier_Diagnostic, exactement une fois chacun", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...RENDERABLE_TIERS),
        async (tier) => {
          const { container, articles } = await renderOffresPage();
          const offer = OFFERS.find((o) => o.tier === tier)!;
          const card = cardForTier(articles, tier);

          // Placement : le marqueur n'apparaît sur la carte que si l'Offre le
          // porte (Recommandé ⇔ Palier_Systeme, Porte d'entrée ⇔ Palier_Diagnostic).
          expect(RECOMMENDED_MARKER.test(card.textContent ?? "")).toBe(
            offer.recommended,
          );
          expect(ENTRY_MARKER.test(card.textContent ?? "")).toBe(
            offer.isEntryPoint,
          );

          // Unicité : chaque marqueur apparaît exactement une fois sur la page.
          const pageText = container.textContent ?? "";
          expect(countMatches(pageText, /Recommandé/g)).toBe(1);
          expect(countMatches(pageText, /Porte d['’]entrée/g)).toBe(1);

          cleanup();
        },
      ),
      { numRuns: NUM_RUNS },
    );
  }, PBT_TIMEOUT);

  // Property 6: CTA présent dans chaque palier — Validates: Requirements 3.5
  it("Property 6: pour toute offre rendue, la carte du Palier contient exactement une occurrence activable du CTA_Diagnostic", async () => {
    const { label } = resolveCta();

    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...RENDERABLE_TIERS),
        async (tier) => {
          const { articles } = await renderOffresPage();

          // Invariant global : chaque carte de Palier porte un CTA activable.
          for (const article of articles) {
            const buttons = within(article).getAllByRole("button");
            expect(buttons).toHaveLength(1);
            expect(buttons[0].textContent?.trim()).toBe(label);
          }

          // Invariant par Palier : la carte sélectionnée porte le CTA, dont le
          // libellé est strictement identique à la constante unique.
          const card = cardForTier(articles, tier);
          const button = within(card).getByRole("button");
          expect(button.textContent?.trim()).toBe(label);
          expect(label).toBe(CTA_DIAGNOSTIC.label);

          cleanup();
        },
      ),
      { numRuns: NUM_RUNS },
    );
  }, PBT_TIMEOUT);
});
