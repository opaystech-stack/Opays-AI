import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { buildNoindexMeta } from "@/lib/seo/sitemap";
import { assertPrototypeAccess, isPrototypeAccessAllowed } from "@/lib/prototype-guard";
import { PrototypeUnavailable } from "@/components/PrototypeUnavailable";
import {
  Activity,
  ArrowRight,
  BookOpenText,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  Clock3,
  LayoutDashboard,
  Layers3,
  Radar,
  Search,
  ShieldCheck,
  Workflow,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/tenant-0")({
  // Contrôle d'accès principal : refus/redirection des accès non autorisés
  // vers la page publique d'accueil (Requirement 10.5).
  beforeLoad: () => assertPrototypeAccess(),
  component: TenantZeroPage,
  head: () => ({ meta: buildNoindexMeta() }),
});

/**
 * Composant de route avec repli de défense en profondeur : si le contrôle
 * principal (`beforeLoad`) a été contourné, on n'affiche jamais le contenu du
 * prototype (Requirement 10.6).
 */
function TenantZeroPage() {
  if (!isPrototypeAccessAllowed()) {
    return <PrototypeUnavailable />;
  }
  return <TenantZeroPrototype />;
}

const navItems = [
  { label: "Vue d'ensemble", href: "#overview", icon: LayoutDashboard },
  { label: "Compass", href: "#compass", icon: Radar },
  { label: "Agents", href: "#agents", icon: BrainCircuit },
  { label: "Connaissance", href: "#knowledge", icon: BookOpenText },
  { label: "Conformité", href: "#compliance", icon: ShieldCheck },
  { label: "Activité", href: "#activity", icon: Activity },
];

const compassSources = [
  "00_hq - gouvernance, méthodes, RBAC, stress tests",
  "brain - mémoire, wiki, skills, répertoire des compétences",
  "06_ops - refonte, plan 90 jours, backlog UI/UX, tenant 0",
];

const quickChecks = [
  { label: "Secrets", value: "Vault obligatoire", tone: "OK" },
  { label: "Logs", value: "Centralisés", tone: "OK" },
  { label: "Backups", value: "PRA défini", tone: "OK" },
  { label: "Rollback", value: "Testable", tone: "OK" },
];

const activityRows = [
  {
    time: "08:00",
    actor: "Compass",
    action: "Charge la mémoire de gouvernance et les décisions actives",
    status: "Live",
  },
  {
    time: "08:15",
    actor: "check-compliance",
    action: "Vérifie la présence des docs, skills et standards",
    status: "Vert",
  },
  {
    time: "08:30",
    actor: "plan-progress",
    action: "Compare le plan 90 jours à l'état réel du projet",
    status: "Suivi",
  },
  {
    time: "08:45",
    actor: "generate-checklist",
    action: "Produit la prochaine checklist pour le tenant 0",
    status: "Prêt",
  },
];

const agentCards = [
  {
    title: "Compass",
    description: "Mémoire vivante. Répond sur les décisions, le plan et les standards.",
    icon: Radar,
    status: "Opérationnel",
  },
  {
    title: "check-compliance",
    description: "Valide la conformité documentaire et la couverture des contrôles.",
    icon: ShieldCheck,
    status: "CLI prêt",
  },
  {
    title: "plan-progress",
    description: "Mesure l'écart entre le plan et la réalité d'exécution.",
    icon: Clock3,
    status: "CLI prêt",
  },
  {
    title: "generate-checklist",
    description: "Crée une checklist pas à pas pour une phase donnée.",
    icon: Workflow,
    status: "CLI prêt",
  },
];

function TenantZeroPrototype() {
  const [compassQuery, setCompassQuery] = useState("tenant 0");
  const [compassLoading, setCompassLoading] = useState(false);
  const [compassError, setCompassError] = useState<string | null>(null);
  const [compassResult, setCompassResult] = useState<{
    query: string;
    answer: string;
    matches: Array<{
      title: string;
      source: string;
      snippet: string;
      score: number;
    }>;
  } | null>(null);

  useEffect(() => {
    void runCompassSearch("tenant 0");
  }, []);

  async function runCompassSearch(query: string) {
    const trimmed = query.trim();
    if (!trimmed) return;

    setCompassLoading(true);
    setCompassError(null);

    try {
      const response = await fetch("/api/compass/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: trimmed }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Compass API unavailable");
      }

      setCompassResult(data);
    } catch (error) {
      setCompassError(error instanceof Error ? error.message : String(error));
      setCompassResult(null);
    } finally {
      setCompassLoading(false);
    }
  }

  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.14),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.12),transparent_28%),var(--background)] text-foreground">
        <Sidebar variant="inset" collapsible="icon">
          <SidebarHeader className="gap-3 border-b border-sidebar-border/70 px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-primary">
                <Layers3 className="size-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-sidebar-foreground/60">
                  Opays HQ
                </p>
                <h1 className="text-base font-semibold tracking-tight text-sidebar-foreground">
                  Tenant 0
                </h1>
              </div>
            </div>
            <Badge className="w-fit border-primary/20 bg-primary/10 text-primary">
              Compass live
            </Badge>
          </SidebarHeader>

          <SidebarContent className="gap-6 px-3 py-3">
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton asChild>
                          <a href={item.href}>
                            <Icon />
                            <span>{item.label}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Compass sources</SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="space-y-2 px-2 text-xs text-sidebar-foreground/70">
                  {compassSources.map((source) => (
                    <div
                      key={source}
                      className="rounded-lg border border-sidebar-border/60 px-3 py-2"
                    >
                      {source}
                    </div>
                  ))}
                </div>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>CLI rapide</SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="space-y-2 px-2 text-xs text-sidebar-foreground/70">
                  <div className="rounded-lg border border-sidebar-border/60 px-3 py-2 font-mono">
                    opays compass ask
                  </div>
                  <div className="rounded-lg border border-sidebar-border/60 px-3 py-2 font-mono">
                    opays check-compliance
                  </div>
                  <div className="rounded-lg border border-sidebar-border/60 px-3 py-2 font-mono">
                    opays plan-progress
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-sidebar-border/70 px-4 py-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-sidebar-foreground/70">
                <span>Shell interne</span>
                <span>Beta</span>
              </div>
              <Progress value={22} className="h-1.5 bg-sidebar-accent/40" />
            </div>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        <SidebarInset>
          <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur-xl">
              <div className="flex h-16 items-center gap-4 px-4 sm:px-6 lg:px-8">
                <SidebarTrigger />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">Tenant 0</Badge>
                    <Badge variant="outline">Compass</Badge>
                    <Badge variant="outline">Shell UI</Badge>
                    <Badge variant="outline">React / Tailwind / shadcn</Badge>
                  </div>
                </div>
                <div className="hidden items-center gap-2 md:flex">
                  <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
                    Vue publique
                  </Link>
                  <Button size="sm" variant="outline" asChild>
                    <a href="#compass">
                      Ouvrir Compass
                      <ArrowRight className="size-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </header>

            <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="space-y-6"
              >
                <section id="overview" className="space-y-4">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-3xl space-y-3">
                      <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">
                        Opays HQ / Tenant 0
                      </p>
                      <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                        Le cobaye interne qui porte Compass, les skills et la future plateforme.
                      </h2>
                      <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                        On valide ici la gouvernance, la mémoire, la navigation et le rythme
                        d'exécution avant la refonte profonde de l'infrastructure.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button variant="secondary" size="sm" asChild>
                        <a href="#agents">Voir les skills</a>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a href="#activity">Voir l'activité</a>
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    {[
                      {
                        label: "Compass",
                        value: "Opérationnel",
                        hint: "Mémoire de gouvernance connectée",
                      },
                      {
                        label: "Tenant 0",
                        value: "Blueprint prêt",
                        hint: "Infra minimale à poser ensuite",
                      },
                      {
                        label: "Shell UI",
                        value: "Visible maintenant",
                        hint: "Sidebar, workspace, inspecteur",
                      },
                      {
                        label: "PRA",
                        value: "Cadre défini",
                        hint: "Restauration et logs à instrumenter",
                      },
                    ].map((metric) => (
                      <Card key={metric.label} className="border-border/60 bg-card/80 shadow-none">
                        <CardHeader className="space-y-2 p-4">
                          <CardDescription>{metric.label}</CardDescription>
                          <CardTitle className="text-2xl">{metric.value}</CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 pb-4 text-sm text-muted-foreground">
                          {metric.hint}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>

                <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
                  <Card id="compass" className="border-border/60 bg-card/80 shadow-none">
                    <CardHeader className="flex flex-row items-start justify-between gap-4 p-5">
                      <div className="space-y-1">
                        <CardDescription>Compass</CardDescription>
                        <CardTitle className="text-xl">Mémoire vivante de gouvernance</CardTitle>
                      </div>
                      <Badge className="border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
                        Live
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-5 px-5 pb-5">
                      <div className="grid gap-3 md:grid-cols-3">
                        {quickChecks.map((check) => (
                          <div
                            key={check.label}
                            className="rounded-xl border border-border/60 bg-background/40 p-4"
                          >
                            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                              {check.label}
                            </p>
                            <p className="mt-2 text-sm font-medium">{check.value}</p>
                            <p className="mt-2 text-xs text-emerald-300">{check.tone}</p>
                          </div>
                        ))}
                      </div>

                      <div className="rounded-xl border border-border/60 bg-background/40 p-4">
                        <form
                          className="flex flex-col gap-3 sm:flex-row"
                          onSubmit={(event) => {
                            event.preventDefault();
                            void runCompassSearch(compassQuery);
                          }}
                        >
                          <div className="flex-1 space-y-2">
                            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                              Recherche Compass
                            </p>
                            <div className="relative">
                              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                              <Input
                                value={compassQuery}
                                onChange={(event) => setCompassQuery(event.target.value)}
                                placeholder='Ex: "tenant 0", "UX", "versioning"'
                                className="h-11 border-border/60 bg-background/80 pl-10"
                              />
                            </div>
                          </div>
                          <div className="flex items-end">
                            <Button type="submit" className="h-11" disabled={compassLoading}>
                              {compassLoading ? "Recherche..." : "Interroger Compass"}
                            </Button>
                          </div>
                        </form>

                        <div className="mt-4 space-y-3">
                          {compassError ? (
                            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                              {compassError}
                            </div>
                          ) : null}

                          {compassResult ? (
                            <div className="space-y-3 rounded-lg border border-border/60 bg-background/60 p-4">
                              <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                                Réponse Compass
                              </div>
                              <pre className="whitespace-pre-wrap text-sm leading-6 text-foreground">
                                {compassResult.answer}
                              </pre>
                              {compassResult.matches.length ? (
                                <div className="space-y-2">
                                  <Separator />
                                  <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                                    Sources retrouvées
                                  </div>
                                  <div className="space-y-2">
                                    {compassResult.matches.map((match) => (
                                      <div
                                        key={`${match.source}-${match.title}`}
                                        className="rounded-lg border border-border/60 px-3 py-2"
                                      >
                                        <div className="flex items-center justify-between gap-3">
                                          <p className="text-sm font-medium">{match.title}</p>
                                          <Badge variant="outline">{match.source}</Badge>
                                        </div>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                          {match.snippet}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          ) : (
                            <div className="rounded-lg border border-border/60 bg-background/40 px-4 py-3 text-sm text-muted-foreground">
                              Pose une question à Compass pour retrouver décisions, plans ou
                              standards.
                            </div>
                          )}
                        </div>
                      </div>

                      <Separator />

                      <div className="grid gap-3 lg:grid-cols-2">
                        <div className="rounded-xl border border-border/60 bg-background/40 p-4">
                          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                            Ce que Compass doit savoir
                          </p>
                          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                            <li className="flex gap-2">
                              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                              Décisions, ADR et arbitrages actifs.
                            </li>
                            <li className="flex gap-2">
                              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                              Plan 90 jours, backlog UI et état du tenant 0.
                            </li>
                            <li className="flex gap-2">
                              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                              Standards, règles de sécurité et critères d'acceptation.
                            </li>
                          </ul>
                        </div>

                        <div className="rounded-xl border border-border/60 bg-background/40 p-4">
                          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                            Commandes utiles
                          </p>
                          <div className="mt-3 space-y-2 font-mono text-xs text-foreground">
                            <div className="rounded-lg border border-border/60 px-3 py-2">
                              opays compass ask "Quelle est la décision sur l'UX ?"
                            </div>
                            <div className="rounded-lg border border-border/60 px-3 py-2">
                              opays check-compliance
                            </div>
                            <div className="rounded-lg border border-border/60 px-3 py-2">
                              opays generate-checklist "Phase 1 – Tenant 0"
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border/60 bg-card/80 shadow-none">
                    <CardHeader className="p-5">
                      <CardDescription>État de base</CardDescription>
                      <CardTitle className="text-xl">Rythme d'exécution</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 px-5 pb-5">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Gouvernance mémoire</span>
                          <span className="text-muted-foreground">100%</span>
                        </div>
                        <Progress value={100} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Shell UI interne</span>
                          <span className="text-muted-foreground">25%</span>
                        </div>
                        <Progress value={25} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Tenant 0 infra</span>
                          <span className="text-muted-foreground">5%</span>
                        </div>
                        <Progress value={5} />
                      </div>

                      <Separator />

                      <div className="space-y-3">
                        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                          Prochaines décisions
                        </p>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <ChevronRight className="mt-0.5 size-4 shrink-0 text-primary" />
                            Valider le plan de provisioning du tenant 0.
                          </li>
                          <li className="flex items-start gap-2">
                            <ChevronRight className="mt-0.5 size-4 shrink-0 text-primary" />
                            Brancher Compass sur le registre des décisions.
                          </li>
                          <li className="flex items-start gap-2">
                            <ChevronRight className="mt-0.5 size-4 shrink-0 text-primary" />
                            Ajouter les pages du backlog UI une par une.
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </section>

                <section id="agents" className="space-y-4">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                        Skills opérationnels
                      </p>
                      <h3 className="text-2xl font-semibold tracking-tight">
                        Les trois garde-fous de l'exécution
                      </h3>
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    {agentCards.map((agent) => {
                      const Icon = agent.icon;
                      return (
                        <Card key={agent.title} className="border-border/60 bg-card/80 shadow-none">
                          <CardHeader className="space-y-3 p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex size-9 items-center justify-center rounded-xl border border-border/60 bg-background/40">
                                <Icon className="size-4 text-primary" />
                              </div>
                              <Badge variant="outline">{agent.status}</Badge>
                            </div>
                            <div className="space-y-1">
                              <CardTitle className="text-base">{agent.title}</CardTitle>
                              <CardDescription>{agent.description}</CardDescription>
                            </div>
                          </CardHeader>
                        </Card>
                      );
                    })}
                  </div>
                </section>

                <section className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
                  <Card id="knowledge" className="border-border/60 bg-card/80 shadow-none">
                    <CardHeader className="p-5">
                      <CardDescription>Knowledge Vault</CardDescription>
                      <CardTitle className="text-xl">
                        Mémoire de travail et de gouvernance
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 px-5 pb-5">
                      <div className="grid gap-3 md:grid-cols-3">
                        {[
                          { label: "00_hq", value: "méthode / sécurité / RBAC" },
                          { label: "brain", value: "wiki / skills / mémoire" },
                          { label: "06_ops", value: "refonte / plan / backlog" },
                        ].map((item) => (
                          <div key={item.label} className="rounded-xl border border-border/60 p-4">
                            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                              {item.label}
                            </p>
                            <p className="mt-2 text-sm">{item.value}</p>
                          </div>
                        ))}
                      </div>

                      <div className="rounded-xl border border-border/60 bg-background/40 p-4">
                        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                          Cycle documentaire
                        </p>
                        <div className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                          {[
                            "ingestion",
                            "nettoyage",
                            "chunking",
                            "vectorisation",
                            "indexation",
                            "RAG",
                            "journalisation",
                            "export / suppression",
                          ].map((step) => (
                            <div
                              key={step}
                              className="rounded-lg border border-border/60 px-3 py-2"
                            >
                              {step}
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card id="compliance" className="border-border/60 bg-card/80 shadow-none">
                    <CardHeader className="p-5">
                      <CardDescription>Conformité</CardDescription>
                      <CardTitle className="text-xl">Checks rapides pour l'exécution</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 px-5 pb-5">
                      {[
                        "Secrets dans Vault",
                        "Logs centralisés",
                        "Backup testable",
                        "Rollback prêt",
                      ].map((item) => (
                        <div
                          key={item}
                          className="flex items-center justify-between rounded-xl border border-border/60 px-4 py-3"
                        >
                          <span className="text-sm">{item}</span>
                          <Badge className="border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
                            OK
                          </Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </section>

                <section id="activity" className="space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                      Activité interne
                    </p>
                    <h3 className="text-2xl font-semibold tracking-tight">
                      Les dernières traces du tenant 0
                    </h3>
                  </div>

                  <Card className="border-border/60 bg-card/80 shadow-none">
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[120px]">Heure</TableHead>
                            <TableHead>Acteur</TableHead>
                            <TableHead>Action</TableHead>
                            <TableHead className="text-right">Statut</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {activityRows.map((row) => (
                            <TableRow key={`${row.time}-${row.actor}`}>
                              <TableCell className="font-mono text-xs text-muted-foreground">
                                {row.time}
                              </TableCell>
                              <TableCell className="font-medium">{row.actor}</TableCell>
                              <TableCell className="text-muted-foreground">{row.action}</TableCell>
                              <TableCell className="text-right">
                                <Badge variant="outline">{row.status}</Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </section>
              </motion.div>
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
