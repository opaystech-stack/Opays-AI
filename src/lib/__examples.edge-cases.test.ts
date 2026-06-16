/**
 * Tests d'exemple et de cas limites — noyau pur (SEO, sitemap, chantiers externes).
 *
 * Couvre — tâche 12.2 :
 * - Métadonnées non conformes → échec de construction        (Requirement 12.3)
 * - Échec d'ajout au sitemap → état antérieur conservé        (Requirement 12.9)
 * - Périmètre des chantiers externes (registre, aucun lien)   (Requirement 13.1)
 *
 * Ces fonctions sont pures (sans I/O) : les tests exercent directement leurs
 * sorties et conditions d'erreur, sans DOM ni routeur.
 */

import { describe, it, expect } from "vitest";

import { buildPageMeta } from "@/lib/seo/meta";
import { addPublicRouteToSitemap, buildSitemapXml, PROTOTYPE_PATHS } from "@/lib/seo/sitemap";
import type { PublicRoute } from "@/lib/seo/meta";
import { EXTERNAL_PROJECTS } from "@/content/externalProjects";
import { resolveExternalLink } from "@/content/rules/externalLinks";

describe("Métadonnées de page — conformité bloquante (Requirement 12.3)", () => {
  const validDescription = "D".repeat(80); // 50..160 caractères : conforme.

  it("Requirement 12.3 : un titre vide fait échouer la construction", () => {
    expect(() => buildPageMeta({ path: "/x", title: "", description: validDescription })).toThrow();
  });

  it("Requirement 12.3 : un titre de plus de 60 caractères fait échouer la construction", () => {
    expect(() =>
      buildPageMeta({ path: "/x", title: "T".repeat(61), description: validDescription }),
    ).toThrow();
  });

  it("Requirement 12.3 : une description trop courte (< 50) fait échouer la construction", () => {
    expect(() =>
      buildPageMeta({ path: "/x", title: "Titre conforme", description: "trop court" }),
    ).toThrow();
  });

  it("Requirement 12.3 : une description trop longue (> 160) fait échouer la construction", () => {
    expect(() =>
      buildPageMeta({ path: "/x", title: "Titre conforme", description: "D".repeat(200) }),
    ).toThrow();
  });

  it("Requirement 12.3 : des métadonnées conformes ne lèvent pas d'erreur", () => {
    expect(() =>
      buildPageMeta({ path: "/x", title: "Titre conforme", description: validDescription }),
    ).not.toThrow();
  });
});

describe("Sitemap — conservation de l'état antérieur en cas d'échec (Requirement 12.9)", () => {
  const currentRoutes: PublicRoute[] = [
    { path: "/", title: "Accueil", description: "D".repeat(80) },
    { path: "/offres", title: "Offres", description: "D".repeat(80) },
    { path: "/contact", title: "Contact", description: "D".repeat(80) },
  ];
  const baselineXml = buildSitemapXml(currentRoutes);

  it("Requirement 12.9 : l'ajout d'un prototype interne échoue et conserve le sitemap antérieur", () => {
    const prototypePath = PROTOTYPE_PATHS[0];
    const result = addPublicRouteToSitemap(currentRoutes, {
      path: prototypePath,
      title: "Prototype",
      description: "D".repeat(80),
    });

    expect(result.ok).toBe(false);
    expect(result.xml).toBe(baselineXml);
    if (!result.ok) {
      expect(result.rejectedUrl).toContain(prototypePath);
    }
  });

  it("Requirement 12.9 : l'ajout d'une URL canonique en doublon échoue et conserve le sitemap antérieur", () => {
    const result = addPublicRouteToSitemap(currentRoutes, {
      path: "/offres",
      title: "Offres bis",
      description: "D".repeat(80),
    });

    expect(result.ok).toBe(false);
    expect(result.xml).toBe(baselineXml);
  });

  it("Requirement 12.8/12.9 : l'ajout d'une nouvelle page publique réussit et inclut son URL", () => {
    const result = addPublicRouteToSitemap(currentRoutes, {
      path: "/nouvelle-page",
      title: "Nouvelle page",
      description: "D".repeat(80),
    });

    expect(result.ok).toBe(true);
    expect(result.xml).toContain("/nouvelle-page");
    expect(result.xml).not.toBe(baselineXml);
  });
});

describe("Chantiers externes — périmètre et absence de lien (Requirement 13.1)", () => {
  it("Requirement 13.1 : le registre liste les chantiers hors périmètre (audit IA, Opays Commons)", () => {
    const ids = EXTERNAL_PROJECTS.map((p) => p.id);
    expect(ids).toContain("audit-ia");
    expect(ids).toContain("opays-commons");
  });

  it("Requirement 13.1 : aucun lien n'est rendu tant que les URL ne sont pas renseignées", () => {
    for (const project of EXTERNAL_PROJECTS) {
      expect(project.url).toBeNull();
      expect(resolveExternalLink(project)).toEqual({ visible: false });
    }
  });
});
