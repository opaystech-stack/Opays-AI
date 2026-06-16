import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight, Boxes, PackageOpen } from "lucide-react";
import { SectionHeader } from "@/components/Approche";
import { CtaDiagnostic } from "@/components/CtaDiagnostic";
import { SAAS_PRODUCTS, type SaasProduct } from "@/content/saas";
import { resolveProductAction, selectRenderableProducts } from "@/content/rules/saas";

/**
 * Page_SaaS — produits SaaS développés par Opays.
 *
 * Consomme exclusivement le noyau de logique pure :
 * - `selectRenderableProducts(SAAS_PRODUCTS)` ne retient que les produits
 *   valides (nom 1..60, description 40..300) et plafonne la liste à 12 ;
 * - `resolveProductAction(produit)` détermine l'action de chaque produit : un
 *   lien d'accès si l'URL est renseignée et valide, sinon un repli sur le
 *   CTA_Diagnostic, garantissant au moins une action par produit.
 *
 * Si aucun produit n'est affichable, la page présente un message d'absence de
 * produit et conserve l'accès au CTA_Diagnostic global (Requirement 8.5).
 *
 * Identité visuelle : effets glass, néon et animations framer-motion, avec
 * lisibilité prioritaire du message clé (Requirements 11.1, 11.2).
 *
 * Cette page est montée sous le layout public `_public` (Navbar + Footer + au
 * moins une occurrence du CTA_Diagnostic), rattachement reflété dans la table
 * de routage générée (`routeTree.gen.ts`).
 *
 * Couvre : Requirements 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 10.2, 11.1.
 */

export const Route = createFileRoute("/_public/saas")({
  component: SaasPage,
});

function SaasPage() {
  const products = selectRenderableProducts(SAAS_PRODUCTS);

  return (
    <>
      <SaasHero />
      <section id="produits-saas" className="relative pb-28">
        <div className="mx-auto max-w-7xl px-6">
          {products.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {products.map((product, index) => (
                <ProductCard key={product.name} product={product} index={index} />
              ))}
            </div>
          )}

          {/* CTA_Diagnostic global de la page, toujours présent. */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-16 flex flex-col items-center gap-4 rounded-2xl glass p-10 text-center"
          >
            <h2 className="text-2xl font-semibold md:text-3xl">
              Un produit à déployer dans votre organisation&nbsp;?
            </h2>
            <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
              Partons de votre terrain. Un diagnostic gratuit clarifie l'usage le plus utile pour
              vos équipes.
            </p>
            <CtaDiagnostic size="lg" />
          </motion.div>
        </div>
      </section>
    </>
  );
}

/** En-tête de page : message clé lisible avant tout effet décoratif. */
function SaasHero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-16">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Produits SaaS"
          title="Nos produits en libre-service, conçus par Opays."
          subtitle="Des logiciels nés du terrain pour appliquer la même méthode, sans erreur et sans dépendre d'outils que vous ne contrôlez pas."
        />
      </div>
    </section>
  );
}

/** Carte d'un Produit_SaaS avec son action résolue (lien d'accès ou CTA). */
function ProductCard({ product, index }: { product: SaasProduct; index: number }) {
  const action = resolveProductAction(product);

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl glass p-8 transition-all hover:-translate-y-1 hover:border-primary/40"
    >
      <div className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-primary/10 opacity-0 blur-3xl transition-opacity group-hover:opacity-100" />

      <div className="relative flex flex-1 flex-col">
        <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-primary/30 bg-gradient-to-br from-primary/20 to-accent/20">
          <Boxes size={22} className="text-[color:var(--neon-cyan)]" />
        </div>

        {/* Message clé lisible : nom du produit. */}
        <h3 className="text-xl font-semibold text-foreground">{product.name}</h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
          {product.description}
        </p>

        <div className="mt-6">
          {action.kind === "access" ? (
            <a
              href={action.url}
              className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm font-semibold text-foreground transition-all hover:border-primary/50"
            >
              Accéder au produit
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          ) : (
            <CtaDiagnostic variant="secondary" />
          )}
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity group-hover:opacity-100"
        style={{ boxShadow: "var(--shadow-neon)" }}
      />
    </motion.article>
  );
}

/** Aucun produit affichable : message d'absence, CTA conservé en aval. */
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center gap-4 rounded-2xl glass p-12 text-center"
    >
      <div className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
        <PackageOpen size={26} className="text-[color:var(--neon-cyan)]" />
      </div>
      <h2 className="text-xl font-semibold text-foreground">
        Aucun produit à présenter pour le moment.
      </h2>
      <p className="max-w-xl text-sm text-muted-foreground">
        Nos produits SaaS arrivent. En attendant, échangeons sur votre besoin lors d'un diagnostic
        gratuit.
      </p>
    </motion.div>
  );
}
