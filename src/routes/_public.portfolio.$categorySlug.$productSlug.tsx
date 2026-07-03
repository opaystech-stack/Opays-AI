import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, LayoutDashboard } from "lucide-react";
import dashboardData from "@/content/dashboards.json";
import { buildPageMeta } from "@/lib/seo/meta";
import { CtaDiagnostic } from "@/components/CtaDiagnostic";

type NavTo = Parameters<typeof Link>[0]["to"];

export const Route = createFileRoute("/_public/portfolio/$categorySlug/$productSlug")({
  component: ProductPage,
  head: ({ params }) => {
    const product = dashboardData.products.find((p) => p.slug === params.productSlug);
    if (!product) return {};
    return buildPageMeta({
      path: `/portfolio/${params.categorySlug}/${product.slug}`,
      title: `${product.name} — Opays Dashboards`,
      description: product.descriptionShort,
    });
  },
});

function ProductPage() {
  const { categorySlug, productSlug } = Route.useParams();
  const product = dashboardData.products.find((p) => p.slug === productSlug);
  const category = dashboardData.categories.find((c) => c.slug === categorySlug);

  if (!product || !category) {
    throw notFound();
  }

  return (
    <>
      <section className="relative overflow-hidden pt-28 pb-10">
        <div className="pointer-events-none absolute inset-0 -z-10 grid-bg opacity-40" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[var(--gradient-hero)]" aria-hidden="true" />
        <div className="mx-auto max-w-6xl px-6">
          <Link
            to={`/portfolio/${category.slug}` as NavTo}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-[color:var(--neon-cyan)]"
          >
            <ArrowLeft size={16} />
            {category.label}
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-4 max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--neon-cyan)]/30 bg-[color:var(--neon-cyan)]/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[color:var(--neon-cyan)]">
              {category.label}
            </div>
            <h1 className="mt-4 text-2xl font-bold leading-tight md:text-4xl">
              {product.name}
            </h1>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              {product.descriptionShort}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="border-t border-border/50 py-10">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="overflow-hidden rounded-2xl border border-border/60 bg-card/40 shadow-xl"
              >
                {product.screenshot ? (
                  <img
                    src={product.screenshot}
                    alt={`Capture du dashboard ${product.name}`}
                    className="h-auto w-full object-cover"
                    loading="eager"
                  />
                ) : (
                  <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                    <LayoutDashboard size={64} className="text-[color:var(--neon-cyan)]" />
                  </div>
                )}
              </motion.div>
            </div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="rounded-2xl glass p-6"
              >
                <h2 className="text-lg font-semibold">En résumé</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {product.descriptionFull
                    ? stripHtml(product.descriptionFull).slice(0, 280)
                    : product.descriptionShort}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="rounded-2xl glass p-6"
              >
                <h2 className="text-lg font-semibold">Fonctionnalités clés</h2>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {product.features.slice(0, 6).map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check size={14} className="mt-0.5 shrink-0 text-[color:var(--neon-cyan)]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <CtaDiagnostic size="md" />
                <Link
                  to="/portfolio"
                  className="inline-flex items-center justify-center gap-2 rounded-full glass px-5 py-2.5 text-sm font-semibold text-foreground transition-all hover:border-primary/50"
                >
                  Voir les autres dashboards
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function stripHtml(html: string): string {
  return html.replace(/<[^\u003e]*>/g, " ").replace(/\s+/g, " ").trim();
}
