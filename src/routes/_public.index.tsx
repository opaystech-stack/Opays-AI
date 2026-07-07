import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Cpu, LayoutDashboard, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { ProofBlock } from "@/components/ProofBlock";
import { Container, Section, SectionTitle } from "@/components/marketing/Sections";
import { SERVICE_CATALOG } from "@/content/services/catalog";
import dashboardData from "@/content/dashboards.json";

type NavTo = Parameters<typeof Link>[0]["to"];

const AXES = [
  { icon: ShieldCheck, title: "Souveraineté", text: "Vos données et vos modèles restent sous votre contrôle." },
  { icon: Cpu, title: "IA locale", text: "L'IA opérée au plus près de vos opérations, en circuit maîtrisé." },
  { icon: MapPin, title: "Ancrage RDC et terrain", text: "On part de votre réalité opérationnelle, pas d'une théorie." },
];

const CATEGORIES = dashboardData.categories.slice(0, 5);
const FEATURED_PRODUCTS = [
  dashboardData.products.find((p) => p.slug === "pack-ong-projets-de-dveloppement"),
  dashboardData.products.find((p) => p.slug === "tdb-pices-auto-catalogue-stock-ventes-devis-garage"),
  dashboardData.products.find((p) => p.slug === "tdb-trsorerie-cash-flow-pilotez-votre-liquidit-en-"),
  dashboardData.products.find((p) => p.slug === "tableau-de-bord-audit-interne-contrle-de-gestion"),
].filter(Boolean);

export const Route = createFileRoute("/_public/")({
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <DashboardShowcase />
      <Services />
      <ProofBlock />
      <ClosingCta />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-16 md:pb-20">
      <div className="pointer-events-none absolute inset-0 -z-10 grid-bg opacity-50" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[var(--gradient-hero)]" aria-hidden="true" />
      <Container size="wide">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl font-bold leading-[1.08] md:text-5xl lg:text-6xl">
              Structurez vos opérations, <span className="text-gradient">gagnez en efficience.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              L'efficience par l'IA, sans dépendre d'infrastructures que vous ne contrôlez pas. Des
              solutions concrètes, mesurables, et maîtrisées de bout en bout.
            </p>
            <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-7 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-neon)] transition-all hover:scale-[1.02] hover:shadow-[var(--shadow-glow)]"
              >
                Diagnostic gratuit
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/portfolio"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--neon-cyan)] transition-colors hover:text-[color:var(--neon-cyan)]/80"
              >
                Découvrir les dashboards
                <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {AXES.map((a) => {
                const Icon = a.icon;
                return (
                  <div key={a.title} className="rounded-2xl glass p-5">
                    <Icon size={20} className="text-[color:var(--neon-cyan)]" />
                    <h2 className="mt-3 text-base font-semibold">{a.title}</h2>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{a.text}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <AnimatedDashboardPreview />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

function AnimatedDashboardPreview() {
  return (
    <div className="relative rounded-2xl border border-border/60 bg-card/40 p-3 shadow-2xl backdrop-blur-sm">
      <div className="overflow-hidden rounded-xl bg-background/80 p-6">
        <div className="space-y-5">
          {/* Header du dashboard animé */}
          <div className="flex items-center justify-between">
            <div className="h-3 w-24 rounded-full bg-primary/30" />
            <div className="flex gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/20" />
              <div className="h-8 w-8 rounded-lg bg-accent/20" />
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-xl border border-border/40 bg-card/60 p-3">
                <div className="h-2 w-12 rounded-full bg-muted" />
                <div className="mt-3 h-6 w-16 rounded-full bg-gradient-to-r from-primary to-accent opacity-80" />
                <div className="mt-2 h-2 w-10 rounded-full bg-success/50" />
              </div>
            ))}
          </div>

          {/* Graphique animé */}
          <div className="relative h-40 overflow-hidden rounded-xl border border-border/40 bg-card/60 p-4">
            <svg viewBox="0 0 400 160" className="h-full w-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.4" />
                </linearGradient>
              </defs>
              {/* Grille */}
              {[0, 40, 80, 120].map((y) => (
                <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="currentColor" strokeOpacity="0.1" />
              ))}
              {/* Barres animées */}
              {[40, 90, 140, 190, 240, 290, 340].map((x, i) => {
                const heights = [60, 110, 80, 140, 95, 125, 70];
                return (
                  <rect
                    key={x}
                    x={x}
                    y={160 - heights[i]}
                    width="24"
                    height={heights[i]}
                    rx="4"
                    fill="url(#barGradient)"
                    className="animate-bar"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                );
              })}
              {/* Courbe animée */}
              <path
                d="M 0 120 Q 80 80, 160 100 T 320 60 T 400 40"
                fill="none"
                stroke="var(--neon-cyan)"
                strokeWidth="3"
                strokeLinecap="round"
                className="animate-path"
              />
              {/* Points pulsants */}
              {[
                [40, 110],
                [120, 90],
                [200, 100],
                [280, 70],
                [360, 50],
              ].map(([cx, cy], i) => (
                <circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  r="5"
                  fill="var(--neon-cyan)"
                  className="animate-pulse-slow"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </svg>
          </div>

          {/* Ligne de table */}
          <div className="space-y-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg bg-card/40 p-2">
                <div className="h-8 w-8 rounded-full bg-primary/20" />
                <div className="flex-1 space-y-1">
                  <div className="h-2 w-3/4 rounded-full bg-muted" />
                  <div className="h-2 w-1/2 rounded-full bg-muted/60" />
                </div>
                <div className="h-6 w-16 rounded-full bg-success/30" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute -bottom-4 -right-4 rounded-xl border border-[color:var(--neon-cyan)]/30 bg-background/90 p-4 shadow-xl backdrop-blur-md">
        <div className="text-2xl font-bold text-[color:var(--neon-cyan)]">50+</div>
        <div className="text-xs text-muted-foreground">dashboards opérationnels</div>
      </div>
    </div>
  );
}

const HERO_PRODUCTS = FEATURED_PRODUCTS.filter(Boolean) as typeof dashboardData.products;

function DashboardShowcase() {
  return (
    <Section className="relative overflow-hidden border-t border-border/50">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-transparent to-transparent" aria-hidden="true" />
      <Container size="wide">
        <SectionTitle
          eyebrow="Opays Dashboards"
          title="Des tableaux de bord pensés pour votre métier"
          lead="Si Excel est encore votre outil de pilotage, cette étape est révolue. Chaque dashboard est conçu pour votre métier, vos processus et vos indicateurs, puis ajusté à votre organisation."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <Link
                to={`/portfolio/${cat.slug}` as NavTo}
                className="group flex h-full flex-col rounded-2xl glass p-6 transition-all hover:-translate-y-1 hover:border-primary/40"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
                  <LayoutDashboard size={22} className="text-primary" />
                </div>
                <h3 className="text-lg font-semibold">{cat.label}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{cat.tagline}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[color:var(--neon-cyan)]">
                  {cat.productSlugs.length} dashboards
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-16">
          <div className="mb-8 flex items-center gap-3">
            <div className="h-px flex-1 bg-border/60" />
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Exemples concrets</span>
            <div className="h-px flex-1 bg-border/60" />
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {HERO_PRODUCTS.map((product, i) => {
              const category = dashboardData.categories.find((c) => c.id === product.categoryId);
              return (
                <motion.div
                  key={product.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                >
                  <Link
                    to={`/portfolio/${category?.slug}/${product.slug}` as NavTo}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl glass transition-all hover:-translate-y-1 hover:border-primary/40"
                  >
                    <div className="relative aspect-video overflow-hidden bg-card/40">
                      {product.screenshot ? (
                        <img
                          src={product.screenshot}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                          <LayoutDashboard size={40} className="text-[color:var(--neon-cyan)]" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <div className="text-xs font-medium uppercase tracking-wider text-[color:var(--neon-cyan)]">
                        {category?.label}
                      </div>
                      <h3 className="mt-2 text-base font-semibold line-clamp-2">{product.name}</h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                        {product.descriptionShort}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[color:var(--neon-cyan)]">
                        Voir ce dashboard
                        <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 flex justify-center"
        >
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm font-semibold text-foreground transition-all hover:border-primary/50"
          >
            Voir tout le portfolio
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </Container>
    </Section>
  );
}

function Services() {
  return (
    <Section className="border-t border-border/50">
      <Container size="wide">
        <SectionTitle
          eyebrow="Nos services"
          title="Ce que nous faisons pour vous"
          lead="Six leviers d'efficience, du site web aux agents IA. On prend le plus utile, pas tout."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_CATALOG.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.path}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link
                  to={s.path as NavTo}
                  className="group flex h-full flex-col rounded-2xl glass p-6 transition-all hover:-translate-y-1 hover:border-primary/40"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
                    <Icon size={22} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">{s.label}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{s.tagline}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[color:var(--neon-cyan)]">
                    Découvrir
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}

function ClosingCta() {
  return (
    <Section className="relative overflow-hidden border-t border-border/50">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[var(--gradient-hero)] opacity-60" aria-hidden="true" />
      <Container size="narrow">
        <div className="flex flex-col items-center gap-6 text-center">
          <h2 className="text-3xl font-bold leading-tight md:text-4xl">
            Parlons de vos enjeux, sans engagement
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
            Un premier échange suffit pour identifier vos gains les plus rapides. Le diagnostic est
            gratuit.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-8 py-4 text-base font-semibold text-primary-foreground shadow-[var(--shadow-neon)] transition-all hover:scale-[1.02] hover:shadow-[var(--shadow-glow)]"
          >
            Diagnostic gratuit
            <ArrowRight size={18} />
          </Link>
        </div>
      </Container>
    </Section>
  );
}
