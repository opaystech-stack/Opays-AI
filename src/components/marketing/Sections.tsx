import { useState, type ComponentType } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, ChevronDown, Clock, Phone, X } from "lucide-react";

/**
 * Bibliothèque de sections marketing réutilisables (gabarit de page service).
 *
 * Chaque section impose un rythme vertical et des marges homogènes via le
 * conteneur partagé `Container` (max-w-6xl + px-6 + py généreux), afin de
 * garantir un design cohérent et lisible sur toutes les pages.
 */

type IconType = ComponentType<{ size?: number; className?: string }>;
type NavTo = Parameters<typeof Link>[0]["to"];

/* ─── Primitives de mise en page ───────────────────────────────────── */

/** Conteneur standard : marges latérales et largeur max homogènes. */
export function Container({
  children,
  className = "",
  size = "default",
}: {
  children: React.ReactNode;
  className?: string;
  size?: "default" | "narrow" | "wide";
}) {
  const max = size === "narrow" ? "max-w-3xl" : size === "wide" ? "max-w-7xl" : "max-w-6xl";
  return <div className={`mx-auto ${max} px-6 ${className}`}>{children}</div>;
}

/** Section verticale au rythme homogène. */
export function Section({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`py-20 md:py-28 ${className}`}>
      {children}
    </section>
  );
}

/** Sur-titre (eyebrow) néon. */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-xs uppercase tracking-[0.22em] text-[color:var(--neon-cyan)]">
      {children}
    </div>
  );
}

/** En-tête de section centré ou aligné. */
export function SectionTitle({
  eyebrow,
  title,
  lead,
  align = "center",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: string;
  align?: "center" | "left";
}) {
  const alignment = align === "center" ? "mx-auto text-center items-center" : "";
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className={`flex max-w-3xl flex-col gap-4 ${alignment}`}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="text-3xl font-bold leading-tight md:text-5xl">{title}</h2>
      {lead && <p className="text-lg leading-relaxed text-muted-foreground">{lead}</p>}
    </motion.div>
  );
}

/* ─── Hero de page service ─────────────────────────────────────────── */

export interface ServiceHeroData {
  badge: string;
  title: string;
  highlight: string;
  lead: string;
  paragraphs: string[];
  ctaLabel: string;
  phone?: string;
}

export function ServiceHero({ data }: { data: ServiceHeroData }) {
  return (
    <section className="relative overflow-hidden pt-32 pb-16 md:pb-24">
      <div
        className="pointer-events-none absolute inset-0 -z-10 grid-bg opacity-40"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[var(--gradient-hero)]"
        aria-hidden="true"
      />
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[color:var(--neon-cyan)]">
            {data.badge}
          </div>
          <h1 className="mt-6 text-4xl font-bold leading-[1.08] md:text-6xl">
            {data.title} <span className="text-gradient">{data.highlight}</span>
          </h1>
          <p className="mt-6 text-xl font-semibold leading-relaxed text-foreground md:text-2xl">
            {data.lead}
          </p>
          {data.paragraphs[0] && (
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
              {data.paragraphs[0]}
            </p>
          )}
          <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-7 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-neon)] transition-all hover:scale-[1.02] hover:shadow-[var(--shadow-glow)]"
            >
              {data.ctaLabel}
              <ArrowRight size={16} />
            </Link>
            {data.phone && (
              <a
                href={`tel:${data.phone.replace(/\s+/g, "")}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <Phone size={16} className="text-[color:var(--neon-cyan)]" />
                {data.phone}
              </a>
            )}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

/* ─── Le constat brutal : chiffres + conséquences ──────────────────── */

export interface BrutalStatsData {
  eyebrow: string;
  title: string;
  lead?: string;
  stats: { value: string; label: string }[];
  consequencesTitle: string;
  consequences: string[];
  costTitle?: string;
  costText?: string;
}

export function BrutalStats({ data }: { data: BrutalStatsData }) {
  return (
    <Section className="border-t border-border/50">
      <Container>
        <SectionTitle eyebrow={data.eyebrow} title={data.title} lead={data.lead} align="left" />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data.stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="rounded-2xl glass p-6"
            >
              <div className="text-3xl font-bold text-gradient md:text-4xl">{s.value}</div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* ─── Piliers / différenciateurs ───────────────────────────────────── */

export interface PillarsData {
  eyebrow: string;
  title: string;
  lead?: string;
  pillars: { icon: IconType; title: string; text: string }[];
}

export function Pillars({ data }: { data: PillarsData }) {
  return (
    <Section className="border-t border-border/50">
      <Container>
        <SectionTitle eyebrow={data.eyebrow} title={data.title} lead={data.lead} />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.pillars.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="group relative rounded-2xl glass p-6 transition-all hover:-translate-y-1 hover:border-primary/40"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
                  <Icon size={22} className="text-primary" />
                </div>
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}

/* ─── Tableau comparatif ❌ / ✓ ────────────────────────────────────── */

export interface ComparisonData {
  eyebrow: string;
  title: string;
  lead?: string;
  badLabel: string;
  goodLabel: string;
  rows: { criterion: string; bad: string; good: string }[];
}

export function Comparison({ data }: { data: ComparisonData }) {
  return (
    <Section className="border-t border-border/50">
      <Container>
        <SectionTitle eyebrow={data.eyebrow} title={data.title} lead={data.lead} />
        <div className="mt-12 overflow-hidden rounded-2xl border border-border/60">
          <div className="grid grid-cols-3 bg-card/60 text-sm font-semibold">
            <div className="p-4 text-muted-foreground">Critère</div>
            <div className="flex items-center gap-2 border-l border-border/60 p-4 text-muted-foreground">
              <X size={15} className="text-destructive" /> {data.badLabel}
            </div>
            <div className="flex items-center gap-2 border-l border-border/60 p-4 text-[color:var(--neon-cyan)]">
              <Check size={15} /> {data.goodLabel}
            </div>
          </div>
          {data.rows.map((r, i) => (
            <div
              key={i}
              className={`grid grid-cols-3 text-sm ${i % 2 ? "bg-card/20" : "bg-transparent"}`}
            >
              <div className="p-4 font-medium text-foreground">{r.criterion}</div>
              <div className="border-l border-border/60 p-4 text-muted-foreground">{r.bad}</div>
              <div className="border-l border-border/60 p-4 text-foreground">{r.good}</div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* ─── Méthode en 5 étapes ──────────────────────────────────────────── */

export interface MethodData {
  eyebrow: string;
  title: string;
  lead?: string;
  steps: { title: string; duration: string; text: string }[];
}

export function Method({ data }: { data: MethodData }) {
  return (
    <Section className="border-t border-border/50">
      <Container>
        <SectionTitle eyebrow={data.eyebrow} title={data.title} lead={data.lead} />
        <div className="mt-14 space-y-4">
          {data.steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="flex flex-col gap-4 rounded-2xl glass p-6 md:flex-row md:items-center"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 font-mono text-lg font-bold text-primary">
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-lg font-semibold">{s.title}</h3>
                  <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                    <Clock size={12} /> {s.duration}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* ─── Timeline de gains ────────────────────────────────────────────── */

export interface TimelineData {
  eyebrow: string;
  title: string;
  lead?: string;
  phases: { period: string; title: string; text: string; benefits: string[] }[];
  roiNote?: string;
}

export function ResultsTimeline({ data }: { data: TimelineData }) {
  return (
    <Section className="border-t border-border/50">
      <Container>
        <SectionTitle eyebrow={data.eyebrow} title={data.title} lead={data.lead} />
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {data.phases.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-2xl glass p-6"
            >
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--neon-cyan)]">
                {p.period}
              </div>
              <h3 className="mt-3 text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
              <ul className="mt-4 space-y-2">
                {p.benefits.map((b, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-foreground">
                    <Check size={15} className="mt-0.5 shrink-0 text-[color:var(--success)]" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        {data.roiNote && (
          <p className="mx-auto mt-10 max-w-3xl text-center text-base leading-relaxed text-muted-foreground">
            {data.roiNote}
          </p>
        )}
      </Container>
    </Section>
  );
}

/* ─── Étude de cas ─────────────────────────────────────────────────── */

export interface CaseStudyData {
  eyebrow: string;
  title: string;
  profileTitle: string;
  profile: string;
  actionsTitle: string;
  actions: string;
  metrics: { label: string; value: string }[];
  quote: string;
  author: string;
}

export function CaseStudy({ data }: { data: CaseStudyData }) {
  return (
    <Section className="border-t border-border/50">
      <Container>
        <SectionTitle eyebrow={data.eyebrow} title={data.title} align="left" />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="rounded-2xl border border-border/60 bg-card/40 p-6">
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--neon-cyan)]">
                {data.profileTitle}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{data.profile}</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card/40 p-6">
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--neon-cyan)]">
                {data.actionsTitle}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{data.actions}</p>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4">
              {data.metrics.map((m, i) => (
                <div key={i} className="rounded-2xl glass p-5 text-center">
                  <div className="text-2xl font-bold text-gradient md:text-3xl">{m.value}</div>
                  <p className="mt-1 text-xs text-muted-foreground">{m.label}</p>
                </div>
              ))}
            </div>
            <figure className="flex flex-1 flex-col justify-center rounded-2xl border border-primary/20 bg-primary/5 p-6">
              <blockquote className="text-base italic leading-relaxed text-foreground">
                «&nbsp;{data.quote}&nbsp;»
              </blockquote>
              <figcaption className="mt-4 text-sm font-medium text-muted-foreground">
                — {data.author}
              </figcaption>
            </figure>
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* ─── FAQ accordéon ────────────────────────────────────────────────── */

export interface FaqData {
  eyebrow: string;
  title: string;
  items: { q: string; a: string }[];
}

export function Faq({ data }: { data: FaqData }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Section className="border-t border-border/50">
      <Container size="narrow">
        <SectionTitle eyebrow={data.eyebrow} title={data.title} />
        <div className="mt-12 space-y-3">
          {data.items.slice(0, 4).map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-border/60 bg-card/30"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-semibold text-foreground">{item.q}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-[color:var(--neon-cyan)] transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}

/* ─── CTA final « Le moment est maintenant » ───────────────────────── */

export interface FinalCtaData {
  eyebrow: string;
  title: string;
  ifNothingTitle: string;
  ifNothing: string[];
  ifStartTitle: string;
  ifStart: string[];
  scarcity?: string;
  ctaLabel: string;
}

export function FinalCta({ data }: { data: FinalCtaData }) {
  return (
    <Section className="relative overflow-hidden border-t border-border/50">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[var(--gradient-hero)] opacity-60"
        aria-hidden="true"
      />
      <Container size="narrow">
        <div className="flex flex-col items-center gap-6 text-center">
          <Eyebrow>{data.eyebrow}</Eyebrow>
          <h2 className="text-3xl font-bold leading-tight md:text-4xl">{data.title}</h2>
          {data.scarcity && (
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
              {data.scarcity}
            </p>
          )}
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-8 py-4 text-base font-semibold text-primary-foreground shadow-[var(--shadow-neon)] transition-all hover:scale-[1.02] hover:shadow-[var(--shadow-glow)]"
          >
            {data.ctaLabel}
            <ArrowRight size={18} />
          </Link>
        </div>
      </Container>
    </Section>
  );
}

export type { NavTo };
