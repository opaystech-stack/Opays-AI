/**
 * Générateur pur de métadonnées SEO par page (Gestionnaire_Meta).
 *
 * Source unique de vérité des métadonnées des pages publiques. `PUBLIC_ROUTES`
 * propage titre, description et URL canonique à partir d'une seule définition,
 * alignée sur la Navigation_Principale (`PUBLIC_PAGES`). `buildPageMeta` produit
 * les balises `<head>` consommables par l'API `head()` de TanStack Router :
 * `<title>` (1..60 caractères, unique), meta `description` (50..160 caractères)
 * et `<link rel="canonical">` absolu. Toute non-conformité (longueur hors bornes,
 * titre dupliqué, route hors navigation) lève une erreur à la construction afin
 * d'empêcher la publication d'une page non conforme.
 *
 * Ce module est mutualisé avec le spec `site-hardening-amelioration` : il
 * produit également les balises Open Graph (`og:title`, `og:description`,
 * `og:type`, `og:url`, `og:image`), la directive `noindex` à la demande et un
 * bloc de données structurées JSON-LD `Organization` décrivant Opays Tech.
 * Les URLs canonique et `og:image` sont absolues et cohérentes avec
 * `SITE_ORIGIN`, et les sorties restent déterministes (testables).
 *
 * Couvre : Requirements 12.1, 12.2, 12.3, 12.4 (refonte) et 6.1, 6.2, 6.3,
 * 6.4, 6.5, 10.2 (durcissement).
 */

import { PUBLIC_PAGES } from "@/content/navigation";

/** Origine canonique absolue du Site_Vitrine (domaine officiel d'Opays Tech). */
export const SITE_ORIGIN = "https://opays.io";

/** Bornes de conformité des balises (Requirements 12.1, 12.2). */
export const TITLE_MIN = 1;
export const TITLE_MAX = 60;
export const DESCRIPTION_MIN = 50;
export const DESCRIPTION_MAX = 160;

/** Image Open Graph par défaut (URL absolue), mutualisée avec le durcissement. */
export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/opays-og.png`;

/** Logo officiel d'Opays Tech (URL absolue), utilisé par le JSON-LD. */
export const ORGANIZATION_LOGO = `${SITE_ORIGIN}/logo-opays.svg`;

/** Raison sociale / nom de marque d'Opays Tech. */
export const ORGANIZATION_NAME = "Opays Tech";

/**
 * Type de données structurées schema.org décrivant l'organisation.
 * `Organization` est retenu (pas d'adresse physique publique à exposer) ;
 * `LocalBusiness` reste un sur-type compatible si une adresse est ajoutée.
 */
export const ORGANIZATION_JSONLD_TYPE = "Organization";

/** Slogan de marque, aligné sur la page d'accueil. */
export const ORGANIZATION_SLOGAN = "Ingénierie de l'efficience par l'IA";

/** Description de marque, alignée sur le contenu public du site (pas de donnée nominative). */
export const ORGANIZATION_DESCRIPTION =
  "Opays Tech, cabinet d'ingénierie de l'efficience, aide les organisations opérationnelles en RDC à " +
  "structurer leurs processus grâce à l'IA locale et souveraine.";

/** Entrée de métadonnées fournie à `buildPageMeta`. */
export interface PageMetaInput {
  /** Chemin de la page (commençant par « / »). */
  path: string;
  /** Titre de la page : 1 à 60 caractères. */
  title: string;
  /** Description de la page : 50 à 160 caractères. */
  description: string;
  /** Image Open Graph (URL absolue). Défaut : `DEFAULT_OG_IMAGE`. */
  ogImage?: string;
  /** Type Open Graph. Défaut : « website ». */
  ogType?: string;
  /** Marque la page comme non indexable (prototypes internes). */
  noindex?: boolean;
}

/**
 * Définition d'une route publique : source unique propageant titre, description
 * et URL canonique. Les champs `changefreq`/`priority` servent à la génération
 * du sitemap (réutilisée par le durcissement).
 */
export interface PublicRoute {
  path: string;
  title: string;
  description: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
}

/** Balise meta émise dans le `<head>` (format compatible TanStack Router). */
export type MetaTag =
  | { title: string }
  | { name: string; content: string }
  | { property: string; content: string };

/** Balise `<link>` émise dans le `<head>`. */
export interface LinkTag {
  rel: string;
  href: string;
}

/** Balise `<script>` émise dans le `<head>` (ex. JSON-LD inline). */
export interface ScriptTag {
  type: string;
  children: string;
}

/** Sortie de `buildPageMeta`, directement renvoyable par `head()`. */
export interface PageHead {
  meta: MetaTag[];
  links: LinkTag[];
  scripts: ScriptTag[];
}

/**
 * Construit l'URL canonique absolue d'un chemin à partir de `SITE_ORIGIN`.
 * Normalise les barres obliques et conserve « / » pour la racine.
 */
export function toCanonicalUrl(path: string, origin: string = SITE_ORIGIN): string {
  const trimmedOrigin = origin.replace(/\/+$/, "");
  if (path === "/" || path === "") {
    return `${trimmedOrigin}/`;
  }
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${trimmedOrigin}${normalizedPath.replace(/\/+$/, "")}`;
}

/**
 * Garantit une URL absolue cohérente avec l'origine canonique. Une URL déjà
 * absolue (http/https) est renvoyée telle quelle ; un chemin relatif est
 * résolu sur `SITE_ORIGIN`. Utilisé pour `og:image` (Requirement 6.5).
 */
export function toAbsoluteUrl(value: string, origin: string = SITE_ORIGIN): string {
  if (/^https?:\/\//i.test(value)) {
    return value;
  }
  return toCanonicalUrl(value, origin);
}

/**
 * Valide la conformité d'un titre et d'une description. Lève une erreur
 * explicite si une borne n'est pas respectée, ce qui fait échouer la
 * construction de la page (Requirement 12.3).
 */
function assertMetaConformance(input: Pick<PageMetaInput, "path" | "title" | "description">): void {
  const title = input.title.trim();
  const description = input.description.trim();

  if (title.length < TITLE_MIN || title.length > TITLE_MAX) {
    throw new Error(
      `[seo/meta] Titre non conforme pour « ${input.path} » : ${title.length} caractère(s), ` +
        `attendu entre ${TITLE_MIN} et ${TITLE_MAX}.`,
    );
  }
  if (description.length < DESCRIPTION_MIN || description.length > DESCRIPTION_MAX) {
    throw new Error(
      `[seo/meta] Description non conforme pour « ${input.path} » : ${description.length} caractère(s), ` +
        `attendu entre ${DESCRIPTION_MIN} et ${DESCRIPTION_MAX}.`,
    );
  }
}

/**
 * Produit les balises `<head>` d'une page : `<title>`, meta `description`,
 * Open Graph et `<link rel="canonical">` absolu. Lève une erreur si le titre
 * ou la description ne respecte pas les bornes (échec de build).
 */
export function buildPageMeta(input: PageMetaInput): PageHead {
  assertMetaConformance(input);

  const title = input.title.trim();
  const description = input.description.trim();
  const canonical = toCanonicalUrl(input.path);
  const ogImage = toAbsoluteUrl(input.ogImage ?? DEFAULT_OG_IMAGE);
  const ogType = input.ogType ?? "website";

  const meta: MetaTag[] = [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: ogType },
    { property: "og:url", content: canonical },
    { property: "og:image", content: ogImage },
  ];

  if (input.noindex) {
    meta.push({ name: "robots", content: "noindex, nofollow" });
  }

  return {
    meta,
    links: [{ rel: "canonical", href: canonical }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(buildOrganizationJsonLd()),
      },
    ],
  };
}

/**
 * Construit le bloc de données structurées JSON-LD décrivant Opays Tech
 * (Requirement 6.4). Renvoie un objet analysable de type `Organization`
 * (sur-type compatible `LocalBusiness`), avec uniquement des données de marque
 * publiques (aucune donnée nominative). URLs absolues issues de `SITE_ORIGIN`.
 */
export function buildOrganizationJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": ORGANIZATION_JSONLD_TYPE,
    name: ORGANIZATION_NAME,
    url: `${SITE_ORIGIN}/`,
    logo: ORGANIZATION_LOGO,
    image: DEFAULT_OG_IMAGE,
    slogan: ORGANIZATION_SLOGAN,
    description: ORGANIZATION_DESCRIPTION,
  };
}

/**
 * Les six pages publiques avec leurs métadonnées. Source unique propageant
 * titre/description/canonical, alignée sur `PUBLIC_PAGES` (même ensemble de
 * chemins). Toute modification de la navigation doit être répercutée ici.
 */
export const PUBLIC_ROUTES: PublicRoute[] = [
  {
    path: "/",
    title: "Opays Tech — Ingénierie de l'efficience par l'IA",
    description:
      "Opays Tech aide les organisations opérationnelles en RDC à structurer leurs processus avec l'IA locale et souveraine, sous leur contrôle.",
    changefreq: "weekly",
    priority: 1,
  },
  {
    path: "/a-propos",
    title: "À propos — Opays Tech",
    description:
      "Découvrez Opays Tech : cabinet d'ingénierie de l'efficience en RDC, sa vision, son équipe fondatrice et ses engagements souverains.",
    changefreq: "monthly",
    priority: 0.8,
  },
  {
    path: "/methode",
    title: "La méthode Opays — phases, livrables et durées",
    description:
      "Découvrez la méthode Opays en phases concrètes : lecture du terrain, cartographie des frictions, construction et mise en service, avec livrables et durées.",
    changefreq: "monthly",
    priority: 0.8,
  },
  {
    path: "/offres",
    title: "Nos offres — Diagnostic, Système, Transformation",
    description:
      "Trois paliers d'efficience présentés sans montant : Diagnostic d'Efficience, Système d'Efficience et Transformation Souveraine, avec leurs livrables.",
    changefreq: "monthly",
    priority: 0.9,
  },
  {
    path: "/portfolio",
    title: "Portfolio — Réalisations Opays Tech",
    description:
      "Retrouvez les réalisations d'Opays Tech : automatisation, chatbots, agents IA et systèmes souverains pour les organisations opérationnelles en RDC.",
    changefreq: "monthly",
    priority: 0.7,
  },
  {
    path: "/faq",
    title: "FAQ — Questions fréquentes Opays Tech",
    description:
      "Questions fréquentes sur l'efficience, l'IA locale, la souveraineté des données et la méthode Opays Tech.",
    changefreq: "monthly",
    priority: 0.6,
  },
  {
    path: "/saas",
    title: "Produits SaaS Opays — Nexus et Brand Content OS",
    description:
      "Explorez les produits SaaS développés par Opays Tech, dont Opays Nexus et Brand Content OS, pensés pour appliquer la même méthode d'efficience sans erreur.",
    changefreq: "monthly",
    priority: 0.7,
  },
  {
    path: "/souverainete-rd",
    title: "Souveraineté & R&D — IA locale et contrôle",
    description:
      "L'angle différenciant d'Opays Tech : IA locale, contrôle d'accès RBAC, patrimoine cognitif propriétaire et recherche, pour une efficience réellement souveraine.",
    changefreq: "monthly",
    priority: 0.7,
  },
  {
    path: "/contact",
    title: "Contact — réservez votre Diagnostic gratuit",
    description:
      "Réservez votre Diagnostic gratuit avec Opays Tech : un audit de vos processus et des recommandations chiffrées pour gagner en efficience, sans engagement.",
    changefreq: "yearly",
    priority: 0.6,
  },
];

/**
 * Récupère la définition d'une route publique par son chemin.
 * Lève une erreur si le chemin n'est pas une page publique connue.
 */
export function getPublicRoute(path: string): PublicRoute {
  const route = PUBLIC_ROUTES.find((entry) => entry.path === path);
  if (!route) {
    throw new Error(`[seo/meta] Aucune route publique connue pour le chemin « ${path} ».`);
  }
  return route;
}

/**
 * Construit les métadonnées d'une page publique à partir de la source unique
 * `PUBLIC_ROUTES`. À utiliser dans le `head()` de chaque route publique.
 */
export function buildPublicPageMeta(path: string): PageHead {
  const route = getPublicRoute(path);
  return buildPageMeta({
    path: route.path,
    title: route.title,
    description: route.description,
  });
}

/**
 * Valide l'intégralité du registre `PUBLIC_ROUTES` :
 * - chaque titre/description respecte les bornes (Requirements 12.1, 12.2) ;
 * - les titres sont uniques parmi les pages publiques (Requirement 12.1) ;
 * - le registre couvre exactement les chemins de `PUBLIC_PAGES` (cohérence
 *   navigation ↔ métadonnées, Requirement 12.4).
 *
 * Lève une erreur en cas de non-conformité afin de faire échouer la
 * construction (Requirement 12.3).
 */
export function assertPublicRoutesValid(): void {
  // Conformité des longueurs.
  for (const route of PUBLIC_ROUTES) {
    assertMetaConformance(route);
  }

  // Unicité des titres.
  const titles = PUBLIC_ROUTES.map((route) => route.title.trim());
  const duplicates = titles.filter((title, index) => titles.indexOf(title) !== index);
  if (duplicates.length > 0) {
    throw new Error(
      `[seo/meta] Titres dupliqués parmi les pages publiques : ${[...new Set(duplicates)].join(", ")}.`,
    );
  }

  // Cohérence avec la Navigation_Principale.
  const navPaths = new Set(PUBLIC_PAGES.map((page) => page.path));
  const metaPaths = new Set(PUBLIC_ROUTES.map((route) => route.path));
  const missingInMeta = [...navPaths].filter((path) => !metaPaths.has(path));
  const missingInNav = [...metaPaths].filter((path) => !navPaths.has(path));
  if (missingInMeta.length > 0 || missingInNav.length > 0) {
    throw new Error(
      `[seo/meta] Incohérence navigation ↔ métadonnées. ` +
        `Manquants dans PUBLIC_ROUTES : [${missingInMeta.join(", ")}]. ` +
        `Manquants dans PUBLIC_PAGES : [${missingInNav.join(", ")}].`,
    );
  }
}

// Valide le registre au chargement du module : toute non-conformité fait
// échouer la construction avant le rendu d'une page (Requirement 12.3).
assertPublicRoutesValid();
