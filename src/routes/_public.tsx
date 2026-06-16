import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { PUBLIC_ROUTES, buildPublicPageMeta, type PageHead } from "@/lib/seo/meta";

/**
 * Layout public partagé (Decision A2 du design).
 *
 * Route de layout sans segment (« pathless ») montant `PublicLayout` pour
 * l'ensemble des pages publiques. Elle garantit de façon homogène et sans
 * duplication :
 * - la Navigation_Principale (`Navbar`), qui porte aussi l'occurrence du
 *   CTA_Diagnostic unique visible sans défilement (Requirements 1.7, 10.2) ;
 * - le pied de page légal (`Footer`) avec ses liens mentions légales et
 *   politique de confidentialité (Requirement 12.7).
 *
 * Les métadonnées (`<title>`, meta `description`, `<link rel="canonical">`)
 * sont câblées ici via l'API `head()` de TanStack Router, alimentée par la
 * source unique `PUBLIC_ROUTES` au travers de `buildPublicPageMeta`. Le chemin
 * de la page courante est lu sur la feuille de l'arbre de correspondances, ce
 * qui propage automatiquement des balises conformes à chaque page publique
 * (Requirements 12.1, 12.2, 12.4). Cohérent avec la Decision A6 (réutilisation
 * du générateur de métadonnées du durcissement).
 *
 * L'identifiant « /_public » et le rattachement des pages publiques à ce layout
 * sont connus du typage généré (`routeTree.gen.ts`).
 *
 * Couvre : Requirements 1.7, 10.2, 12.1, 12.2, 12.4, 12.7.
 */

export const Route = createFileRoute("/_public")({
  component: PublicLayout,
  head: ({ matches }) => {
    // La feuille de l'arbre de correspondances porte le chemin réel de la page
    // courante (le layout étant sans segment, il partage ce chemin).
    const path = matches.at(-1)?.pathname ?? matches.at(-1)?.fullPath;
    return headForPublicPath(path);
  },
});

/**
 * Construit les métadonnées d'une page publique connue à partir de son chemin.
 * Renvoie un en-tête vide pour tout chemin hors `PUBLIC_ROUTES`, laissant alors
 * une éventuelle route enfant fournir ses propres balises.
 */
function headForPublicPath(path: string | undefined): PageHead | Record<string, never> {
  if (!path) return {};
  const normalized = path !== "/" ? path.replace(/\/+$/, "") : path;
  const isPublic = PUBLIC_ROUTES.some((route) => route.path === normalized);
  return isPublic ? buildPublicPageMeta(normalized) : {};
}

/**
 * PublicLayout — coquille de rendu commune : Navbar + contenu de page
 * (`<Outlet/>`) + Footer, avec le conteneur de notifications. Conserve
 * l'ossature visuelle de l'ancien one-pager (fond, couleurs, anticrénelage).
 */
function PublicLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
