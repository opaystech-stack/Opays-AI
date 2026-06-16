import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { buildNoindexMeta } from "@/lib/seo/sitemap";
import { assertPrototypeAccess, isPrototypeAccessAllowed } from "@/lib/prototype-guard";
import { PrototypeUnavailable } from "@/components/PrototypeUnavailable";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bell,
  BellRing,
  Bot,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Clock,
  Code2,
  FileCheck,
  FileText,
  Globe2,
  GraduationCap,
  Hash,
  LayoutDashboard,
  Lock,
  Mail,
  MessageSquare,
  MoreHorizontal,
  Package,
  Phone,
  Plus,
  RefreshCcw,
  Satellite,
  Search,
  Send,
  Settings,
  Shield,
  Sparkles,
  TrendingDown,
  TrendingUp,
  UserCheck,
  Users,
  Wine,
  Zap,
  DollarSign,
  Briefcase,
  ToggleLeft,
  ToggleRight,
  Sliders,
  CheckSquare,
  Megaphone,
  Thermometer,
  Truck,
  Target,
  Heart,
  Camera,
  Share2,
} from "lucide-react";

export const Route = createFileRoute("/bridges-os")({
  // Contrôle d'accès principal : refus/redirection des accès non autorisés
  // vers la page publique d'accueil (Requirement 10.5).
  beforeLoad: () => assertPrototypeAccess(),
  component: BridgesOsRoute,
  head: () => ({ meta: buildNoindexMeta() }),
});

/**
 * Composant de route avec repli de défense en profondeur : si le contrôle
 * principal (`beforeLoad`) a été contourné, le contenu du prototype n'est
 * jamais rendu (Requirement 10.6).
 */
function BridgesOsRoute() {
  if (!isPrototypeAccessAllowed()) {
    return <PrototypeUnavailable />;
  }
  return <BridgesOsPrototypePage />;
}

/* ─── Types ────────────────────────────────────────────────────────── */

type DivisionId =
  | "groupe"
  | "vin"
  | "academy"
  | "dev"
  | "satglob"
  | "genesis"
  | "quincaillerie"
  | "commarketing";

type Division = {
  id: DivisionId;
  label: string;
  short: string;
  icon: any;
  color: string;
  tagline: string;
};

type Kpi = {
  label: string;
  value: string;
  hint: string;
  trend?: "up" | "down" | "neutral";
  icon: any;
};

type WorkflowStep = {
  name: string;
  count: number;
  status: "ok" | "warn" | "late";
};

type ActivityRow = {
  time: string;
  actor: string;
  action: string;
  status: string;
  avatar: string;
};

type DocRow = {
  ref: string;
  title: string;
  owner: string;
  sla: string;
  state: string;
};

type RelanceRow = {
  id: string;
  client: string;
  subject: string;
  lastContact: string;
  nextAction: string;
  priority: "high" | "medium" | "low";
  channel: "email" | "phone" | "whatsapp";
  status: "pending" | "sent" | "overdue";
  type: "associé" | "collaborateur" | "client";
};

type TeamMember = {
  id: string;
  name: string;
  role: string;
  email: string;
  access: Record<DivisionId, boolean>;
};

type AiAgent = {
  id: string;
  name: string;
  role: string;
  skills: string[];
  tokensUsed: number;
  deployedTo: string;
  status: "active" | "idle";
};

type TaskRow = {
  id: string;
  title: string;
  assignedTo: string;
  dueDate: string;
  status: "todo" | "in_progress" | "done";
  priority: "high" | "medium" | "low";
};

/* ─── Data ─────────────────────────────────────────────────────────── */

const divisions: Division[] = [
  {
    id: "groupe",
    label: "Vue groupe",
    short: "Groupe",
    icon: Building2,
    color: "#E8612D",
    tagline: "Pilotage transversal — visibilité, alertes, arbitrages direction",
  },
  {
    id: "vin",
    label: "Vin & Commerce",
    short: "Vins",
    icon: Wine,
    color: "#8B1A4A",
    tagline: "Stocks, ventes, fournisseurs, validation achats premium",
  },
  {
    id: "academy",
    label: "Academy",
    short: "Academy",
    icon: GraduationCap,
    color: "#2563EB",
    tagline:
      "Partenariats universitaires, programmes spécifiques, budgets alloués et communication",
  },
  {
    id: "dev",
    label: "Développement",
    short: "Dev",
    icon: Code2,
    color: "#7C3AED",
    tagline: "Projets logiciels, livraisons, QA, documentation technique",
  },
  {
    id: "satglob",
    label: "SATGLOB",
    short: "SATGLOB",
    icon: Satellite,
    color: "#059669",
    tagline: "Opérations globales, partenaires internationaux, suivi contractuel",
  },
  {
    id: "genesis",
    label: "Genesis Bar",
    short: "Genesis Bar",
    icon: Zap,
    color: "#10B981",
    tagline: "Cocktails premium, stocks de boissons, gestion des encaissements bar",
  },
  {
    id: "quincaillerie",
    label: "Quincaillerie",
    short: "Quincaillerie",
    icon: Package,
    color: "#3B82F6",
    tagline: "Matériaux de construction, stocks de fer, outillage, ventes comptoir et chantiers",
  },
  {
    id: "commarketing",
    label: "Communication & Marketing",
    short: "Com & Mkt",
    icon: Megaphone,
    color: "#EC4899",
    tagline: "Stratégie de marque, réseaux sociaux, campagnes publicitaires, relations presse",
  },
];

const divisionData: Record<
  DivisionId,
  {
    kpis: Kpi[];
    workflows: WorkflowStep[];
    activity: ActivityRow[];
    docs: DocRow[];
    revenue: string;
    expenses: string;
    margin: string;
    focus: string;
  }
> = {
  groupe: {
    focus:
      "Réduire les silos entre filiales, contrôler les agents IA et accélérer les validations direction.",
    revenue: "420 500 €",
    expenses: "185 000 €",
    margin: "56 %",
    kpis: [
      {
        label: "Dossiers en attente",
        value: "23",
        hint: "−18 % vs mois dernier",
        trend: "down",
        icon: ClipboardList,
      },
      {
        label: "Temps moyen validation",
        value: "2,4 j",
        hint: "Objectif : 1,5 j",
        trend: "neutral",
        icon: Clock,
      },
      {
        label: "Tâches auto. évitées",
        value: "126/sem",
        hint: "Automatisations actives",
        trend: "up",
        icon: Zap,
      },
      {
        label: "Alertes critiques",
        value: "3",
        hint: "1 quincaillerie · 1 vins · 1 dev",
        trend: "neutral",
        icon: AlertTriangle,
      },
    ],
    workflows: [
      { name: "Demandes direction", count: 9, status: "warn" },
      { name: "Achats > seuil", count: 6, status: "late" },
      { name: "Contrats partenaires", count: 4, status: "ok" },
      { name: "Reporting mensuel", count: 2, status: "ok" },
    ],
    activity: [
      {
        time: "14:12",
        actor: "Admin (SEC)",
        action: "Déploiement de l'agent IA 'Relance Vins' sur le compte du Collaborateur Démo 1",
        status: "OK",
        avatar: "AD",
      },
      {
        time: "11:55",
        actor: "Système IA",
        action: "Alerte stock bas : Fer à béton de 12 (Quincaillerie)",
        status: "Alerte",
        avatar: "AI",
      },
      {
        time: "09:40",
        actor: "Academy",
        action: "Lot 15 attestations générées automatiquement",
        status: "Prêt",
        avatar: "AC",
      },
    ],
    docs: [
      {
        ref: "DIR-088",
        title: "Note de cadrage Q3 — consolidation filiales",
        owner: "DG",
        sla: "J+1",
        state: "À signer",
      },
      {
        ref: "ACH-441",
        title: "Bon de commande fournisseur verre",
        owner: "Achats",
        sla: "J+2",
        state: "Validation",
      },
      {
        ref: "CTR-119",
        title: "Avenant partenaire distribution SATGLOB",
        owner: "Juridique",
        sla: "J+3",
        state: "Relecture",
      },
    ],
  },
  vin: {
    focus: "Fluidifier stock → vente → réapprovisionnement sans rupture ni surstock.",
    revenue: "145 000 €",
    expenses: "78 000 €",
    margin: "46 %",
    kpis: [
      {
        label: "Références actives",
        value: "84",
        hint: "Catalogue vins & spiritueux",
        trend: "neutral",
        icon: Package,
      },
      {
        label: "Commandes en cours",
        value: "31",
        hint: "12 en validation achat",
        trend: "neutral",
        icon: ClipboardList,
      },
      {
        label: "Écarts inventaire",
        value: "0,8 %",
        hint: "Cible < 1 %",
        trend: "down",
        icon: AlertTriangle,
      },
      {
        label: "Marge prévisionnelle",
        value: "+6 pts",
        hint: "Scénario pilote",
        trend: "up",
        icon: TrendingUp,
      },
    ],
    workflows: [
      { name: "Réception stock", count: 5, status: "ok" },
      { name: "Validation achat", count: 8, status: "warn" },
      { name: "Expédition client", count: 14, status: "ok" },
      { name: "Réclamation qualité", count: 2, status: "late" },
    ],
    activity: [
      {
        time: "10:05",
        actor: "Logistique",
        action: "Palette #V-902 prête expédition Douala",
        status: "OK",
        avatar: "LG",
      },
      {
        time: "09:30",
        actor: "Achats",
        action: "Contre-proposition fournisseur verre acceptée par l'agent IA",
        status: "Validé",
        avatar: "AI",
      },
    ],
    docs: [
      {
        ref: "STK-220",
        title: "Inventaire chai — lot millésime 24",
        owner: "Qualité",
        sla: "Auj.",
        state: "Contrôle",
      },
      {
        ref: "VEN-077",
        title: "Conditions export zone CEMAC",
        owner: "Export",
        sla: "J+2",
        state: "Brouillon",
      },
    ],
  },
  academy: {
    focus:
      "Piloter les partenariats universitaires : programmes d'activités, relecture des contrats, budgets alloués, planification des animateurs et campagnes de communication associées.",
    revenue: "185 000 €",
    expenses: "45 000 €",
    margin: "75 %",
    kpis: [
      {
        label: "Partenariats actifs",
        value: "6 universités",
        hint: "Contrats spécifiques signés",
        trend: "up",
        icon: GraduationCap,
      },
      {
        label: "Budget global alloué",
        value: "185 000 €",
        hint: "Financement des activités",
        trend: "up",
        icon: DollarSign,
      },
      {
        label: "Taux d'animation OK",
        value: "85 %",
        hint: "Intervenants assignés",
        trend: "neutral",
        icon: Users,
      },
      {
        label: "Couverture Comm.",
        value: "92 %",
        hint: "Communications validées",
        trend: "up",
        icon: Megaphone,
      },
    ],
    workflows: [
      { name: "Revue contrat cadre", count: 2, status: "ok" },
      { name: "Recherche animateurs", count: 3, status: "warn" },
      { name: "Besoins financiers validés", count: 5, status: "ok" },
      { name: "Campagnes comm. prêtes", count: 4, status: "ok" },
    ],
    activity: [
      {
        time: "09:40",
        actor: "Partenariats",
        action: "Programme validé pour l'Université Démo A — budget 45k€ débloqué",
        status: "OK",
        avatar: "PT",
      },
      {
        time: "08:30",
        actor: "Système IA",
        action:
          "Alerte calendrier : activité 'Séminaire Solaire' (site Démo) sans animateur assigné",
        status: "Alerte",
        avatar: "AI",
      },
    ],
    docs: [
      {
        ref: "ACA-102",
        title: "Contrat cadre de partenariat — Univ. Démo B",
        owner: "Direction",
        sla: "J+2",
        state: "Validé",
      },
      {
        ref: "ACA-115",
        title: "Budget & Programme — Univ. Démo A",
        owner: "Coordinateur",
        sla: "J+3",
        state: "Signature",
      },
    ],
  },
  dev: {
    focus: "Unifier suivi projet, QA et documentation — moins de friction entre équipes.",
    revenue: "0 €",
    expenses: "45 000 €",
    margin: "0 %",
    kpis: [
      {
        label: "Projets actifs",
        value: "9",
        hint: "2 releases cette semaine",
        trend: "neutral",
        icon: Code2,
      },
      {
        label: "Tickets bloquants",
        value: "7",
        hint: "−3 depuis lundi",
        trend: "down",
        icon: AlertTriangle,
      },
      { label: "Couverture doc", value: "78 %", hint: "Cible 90 %", trend: "up", icon: FileText },
      {
        label: "Lead time moyen",
        value: "4,2 j",
        hint: "Objectif 3 j",
        trend: "neutral",
        icon: Clock,
      },
    ],
    workflows: [
      { name: "Backlog priorisé", count: 34, status: "ok" },
      { name: "Revue code", count: 6, status: "warn" },
      { name: "QA / recette", count: 5, status: "ok" },
      { name: "Release", count: 2, status: "ok" },
    ],
    activity: [
      {
        time: "10:22",
        actor: "QA",
        action: "Suite régression — build 2.8.4 verte",
        status: "OK",
        avatar: "QA",
      },
    ],
    docs: [
      {
        ref: "DEV-501",
        title: "Release notes 2.8.4",
        owner: "Tech lead",
        sla: "Auj.",
        state: "Publication",
      },
    ],
  },
  satglob: {
    focus: "Visibilité partenaires et contrats internationaux — moins de relances manuelles.",
    revenue: "112 000 €",
    expenses: "32 000 €",
    margin: "71 %",
    kpis: [
      {
        label: "Contrats actifs",
        value: "36",
        hint: "6 renouvellements Q3",
        trend: "neutral",
        icon: FileCheck,
      },
      {
        label: "SLA partenaires OK",
        value: "94 %",
        hint: "+2 pts",
        trend: "up",
        icon: CheckCircle2,
      },
      {
        label: "Dossiers export",
        value: "8",
        hint: "2 en attente douane",
        trend: "neutral",
        icon: Globe2,
      },
      {
        label: "Relances auto.",
        value: "41/sem",
        hint: "Emails + WhatsApp",
        trend: "up",
        icon: RefreshCcw,
      },
    ],
    workflows: [
      { name: "Onboarding partenaire", count: 3, status: "ok" },
      { name: "Suivi SLA", count: 5, status: "warn" },
      { name: "Renouvellement", count: 4, status: "ok" },
      { name: "Litige / réclamation", count: 1, status: "late" },
    ],
    activity: [
      {
        time: "09:33",
        actor: "Partenariats",
        action: "Contrat distribution — signature électronique",
        status: "En cours",
        avatar: "PT",
      },
    ],
    docs: [
      {
        ref: "SG-044",
        title: "Avenant SLA — opérateur régional",
        owner: "Juridique",
        sla: "J+2",
        state: "Négociation",
      },
    ],
  },
  genesis: {
    focus:
      "Optimisation des stocks de boissons premium, suivi des événements et automatisation des encaissements.",
    revenue: "48 000 €",
    expenses: "11 000 €",
    margin: "77 %",
    kpis: [
      {
        label: "Articles en stock",
        value: "142 ref",
        hint: "Spiritueux, bières, softs",
        trend: "neutral",
        icon: Package,
      },
      {
        label: "Alertes rupture stock",
        value: "2",
        hint: "Gin premium & Menthe fraîche",
        trend: "down",
        icon: AlertTriangle,
      },
      {
        label: "Encaissements jour",
        value: "1 840 €",
        hint: "+12 % vs mardi dernier",
        trend: "up",
        icon: DollarSign,
      },
      {
        label: "Événements planifiés",
        value: "4",
        hint: "Cette semaine",
        trend: "up",
        icon: Calendar,
      },
    ],
    workflows: [
      { name: "Commandes boissons", count: 3, status: "ok" },
      { name: "Clôtures caisse bar", count: 7, status: "ok" },
      { name: "Réservations VIP", count: 12, status: "ok" },
      { name: "Rappels fournisseurs", count: 2, status: "warn" },
    ],
    activity: [
      {
        time: "14:05",
        actor: "Serveur",
        action: "Caisse clôturée — session midi Genesis",
        status: "OK",
        avatar: "SV",
      },
      {
        time: "13:20",
        actor: "Système IA",
        action: "Alerte stock critique : Gin premium Démo < 5 bouteilles",
        status: "Alerte",
        avatar: "AI",
      },
    ],
    docs: [
      {
        ref: "GEN-012",
        title: "Licence d'exploitation & Sanitaire active",
        owner: "SEC",
        sla: "Infini",
        state: "Validé",
      },
      {
        ref: "GEN-099",
        title: "Devis traiteur événementiel VIP du 29/05",
        owner: "Événements",
        sla: "J+1",
        state: "À signer",
      },
    ],
  },
  quincaillerie: {
    focus:
      "Maîtrise des stocks lourds de matériaux de construction et rapidité des ventes comptoir.",
    revenue: "65 500 €",
    expenses: "47 000 €",
    margin: "28 %",
    kpis: [
      {
        label: "Stock matériaux (T)",
        value: "32,4 T",
        hint: "Fer à béton, ciment, etc.",
        trend: "neutral",
        icon: Package,
      },
      {
        label: "Ventes comptoir (H)",
        value: "48 comm/j",
        hint: "Délai moyen service < 5 min",
        trend: "up",
        icon: ShoppingCartIcon,
      },
      {
        label: "Livraisons chantiers",
        value: "8",
        hint: "6 programmées aujourd'hui",
        trend: "neutral",
        icon: Briefcase,
      },
      {
        label: "Créances clients",
        value: "14 800 €",
        hint: "À suivre par l'agent de relance",
        trend: "neutral",
        icon: AlertTriangle,
      },
    ],
    workflows: [
      { name: "Approvisionnement fer", count: 2, status: "late" },
      { name: "Bons de livraison", count: 14, status: "ok" },
      { name: "Relances impayés", count: 9, status: "warn" },
      { name: "Devis chantiers", count: 6, status: "ok" },
    ],
    activity: [
      {
        time: "13:45",
        actor: "Magasinier",
        action: "Réception de 12 tonnes de ciment CPJ35",
        status: "OK",
        avatar: "MG",
      },
      {
        time: "11:10",
        actor: "Agent IA",
        action: "Génération automatique d'un rappel de facture : Client Démo 4",
        status: "Prêt",
        avatar: "AI",
      },
    ],
    docs: [
      {
        ref: "QUI-104",
        title: "Fiche technique conformité fers à béton d'import",
        owner: "Qualité",
        sla: "J+10",
        state: "Validé",
      },
      {
        ref: "QUI-208",
        title: "Facture impayée Client Démo 3 - 4 200 €",
        owner: "Compta",
        sla: "Retard J-5",
        state: "En relance auto",
      },
    ],
  },
  commarketing: {
    focus:
      "Construire l'image de marque Bridgesat, générer des leads qualifiés et piloter la communication multicanal.",
    revenue: "18 500 €",
    expenses: "8 200 €",
    margin: "56 %",
    kpis: [
      {
        label: "Campagnes actives",
        value: "6",
        hint: "3 réseaux sociaux, 2 email, 1 presse",
        trend: "up",
        icon: Megaphone,
      },
      {
        label: "Leads générés/mois",
        value: "148",
        hint: "+34 % vs mois dernier",
        trend: "up",
        icon: Target,
      },
      {
        label: "Taux d'engagement",
        value: "4,7 %",
        hint: "Instagram + LinkedIn",
        trend: "up",
        icon: Heart,
      },
      {
        label: "Budget consommé",
        value: "62 %",
        hint: "Sur budget Q2 alloué",
        trend: "neutral",
        icon: DollarSign,
      },
    ],
    workflows: [
      { name: "Calendrier éditorial", count: 18, status: "ok" },
      { name: "Créations graphiques", count: 5, status: "warn" },
      { name: "Campagnes emailing", count: 3, status: "ok" },
      { name: "Relations presse", count: 2, status: "ok" },
    ],
    activity: [
      {
        time: "14:30",
        actor: "Com & Mkt",
        action: "Publication Instagram 'Été Bridgesat' — 1 240 likes en 3h",
        status: "OK",
        avatar: "CM",
      },
      {
        time: "11:00",
        actor: "Agent IA",
        action: "Rédaction automatique de 5 posts LinkedIn programmés pour la semaine",
        status: "OK",
        avatar: "AI",
      },
      {
        time: "09:15",
        actor: "Presse",
        action: "Article dans un quotidien régional — mention Bridgesat Academy",
        status: "Publié",
        avatar: "PR",
      },
    ],
    docs: [
      {
        ref: "MKT-033",
        title: "Charte graphique unifiée Bridgesat 2026",
        owner: "Dir. Com",
        sla: "J+5",
        state: "Validation",
      },
      {
        ref: "MKT-041",
        title: "Plan média Q3 — réseaux sociaux & presse",
        owner: "Com & Mkt",
        sla: "J+3",
        state: "En cours",
      },
      {
        ref: "MKT-052",
        title: "Brief création vidéo Genesis Bar",
        owner: "Création",
        sla: "J+2",
        state: "Brouillon",
      },
    ],
  },
};

const specializedCards: Record<
  DivisionId,
  { title: string; value: string; desc: string; badge: string; icon: any }[]
> = {
  groupe: [
    {
      title: "Synergies Opérationnelles",
      value: "4 Liaisons Actives",
      desc: "Vente de vins vers Genesis Bar, approvisionnement fer Quincaillerie chantiers SATGLOB, communication unifiée.",
      badge: "Optimisé",
      icon: Activity,
    },
    {
      title: "Gouvernance SEC",
      value: "Cloisonnement RBAC",
      desc: "Contrôle global des accréditations par rôle. Journalisation en temps réel sur VPS privé.",
      badge: "Sécurisé",
      icon: Shield,
    },
    {
      title: "Intelligence Consolidée",
      value: "3 Moteurs IA",
      desc: "Prédictions de ruptures de stocks, automatisation des relances clients et rédaction de contenus marketing.",
      badge: "Actif",
      icon: Bot,
    },
  ],
  vin: [
    {
      title: "Chai & Température (IoT)",
      value: "14,2 °C constant",
      desc: "Surveillance de l'humidité relative à 72% dans les caves de stockage. Capteurs autonomes connectés.",
      badge: "Optimal",
      icon: Thermometer,
    },
    {
      title: "Statut des Caisses Export",
      value: "CEMAC Port Douala",
      desc: "240 caisses en dédouanement. SLA d'arrivée estimé dans 24h par l'agent de transit automatisé.",
      badge: "En transit",
      icon: Truck,
    },
    {
      title: "Contrôle Qualité Lot #44",
      value: "Analyse œnologique",
      desc: "Acidité volatile et sulfites validés par l'ingénieur laboratoire. Prêt pour mise en bouteille.",
      badge: "Certifié",
      icon: FileCheck,
    },
  ],
  genesis: [
    {
      title: "Spiritueux & Cocktails VIP",
      value: "Mojito Bridges N°1",
      desc: "182 ventes cette semaine. Marge unitaire nette : 78%. Alerte stock sur la menthe fraîche.",
      badge: "Populaire",
      icon: Zap,
    },
    {
      title: "IoT : Fûts de Bière",
      value: "4,2 °C (Cible 4,0)",
      desc: "Sonde active sur la tireuse centrale. Zéro alerte sur le circuit de réfrigération.",
      badge: "En ligne",
      icon: Thermometer,
    },
    {
      title: "Événement d'Affaires",
      value: "29 Mai - 120 pers",
      desc: "Soirée privée réservée. Devis traiteur validé par le SEC. 3 serveurs assignés.",
      badge: "Confirmé",
      icon: Sparkles,
    },
  ],
  quincaillerie: [
    {
      title: "Suivi des Fers de 12",
      value: "18,4 Tonnes en stock",
      desc: "Stock critique : 10T. Réapprovisionnement automatique programmé pour demain matin.",
      badge: "Alerte stock",
      icon: Package,
    },
    {
      title: "Logistique Camions",
      value: "Chantier Akwa",
      desc: "Camion B-420 en route pour livraison de 4,5T de fer. Suivi GPS actif sur Bridges OS.",
      badge: "Livraison",
      icon: Truck,
    },
    {
      title: "Marge Brute BTP",
      value: "Calculateur Actif",
      desc: "Indexation automatique des prix de vente comptoir selon les cours mondiaux de l'acier.",
      badge: "Marge 28%",
      icon: TrendingUp,
    },
  ],
  academy: [
    {
      title: "Univ. Démo A — Solaire",
      value: "Intervenant: Intervenant Démo 1",
      desc: "Budget 45k€. Calendrier validé. Communication réseaux sociaux lancée.",
      badge: "En cours",
      icon: GraduationCap,
    },
    {
      title: "Univ. Démo B — Réseaux",
      value: "Recherche Animateur",
      desc: "Budget 30k€. Calendrier prévu le 12 juin. Relance automatique d'intervenants active.",
      badge: "Recherche",
      icon: Clock,
    },
    {
      title: "Univ. Démo C — Cloud",
      value: "Intervenant: Collaborateur Démo 4 (SEC)",
      desc: "Contrat cadre validé. Budget 60k€. Communication presse planifiée.",
      badge: "Prêt",
      icon: Shield,
    },
  ],
  dev: [
    {
      title: "Pipeline CI/CD",
      value: "Build #284 VERT",
      desc: "Couverture de test globale de 82%. Temps moyen d'intégration : 14 minutes.",
      badge: "Succès",
      icon: Code2,
    },
    {
      title: "Souveraineté d'Hébergement",
      value: "VPS Privé Cameroun",
      desc: "Aucun appel à des API étrangères pour le stockage ou la compilation du code.",
      badge: "Souverain",
      icon: Lock,
    },
    {
      title: "QA Staging Status",
      value: "Zéro bloquant",
      desc: "Version 2.8.4 validée par le lead QA. Prête pour le déploiement sur Bridgesat.",
      badge: "Prêt",
      icon: CheckSquare,
    },
  ],
  satglob: [
    {
      title: "Liaisons Satellitaires",
      value: "Bande K - 120ms",
      desc: "Statut de télémesure stable. Signal à 99% sur la station terrestre principale.",
      badge: "Stable",
      icon: Satellite,
    },
    {
      title: "SLA Partenaires",
      value: "99.8% Disponibilité",
      desc: "Indicateur contractuel vert. Zéro pénalité enregistrée sur le trimestre en cours.",
      badge: "Conforme",
      icon: CheckSquare,
    },
    {
      title: "Couverture Continentale",
      value: "8 Stations terrestres",
      desc: "Interconnexion complète de la zone Afrique Centrale. Supervision IA active.",
      badge: "Actif",
      icon: Satellite,
    },
  ],
  commarketing: [
    {
      title: "Social Media Dashboard",
      value: "12 400 abonnés",
      desc: "Croissance de +18% sur Instagram, +22% sur LinkedIn. Taux d'engagement moyen de 4,7%.",
      badge: "En croissance",
      icon: TrendingUp,
    },
    {
      title: "Campagne 'Été Bridgesat'",
      value: "32 000 impressions",
      desc: "Campagne cross-plateforme lancée. CTR de 3,8% — au-dessus de la moyenne du secteur.",
      badge: "Performant",
      icon: Target,
    },
    {
      title: "Brand Awareness Score",
      value: "72/100",
      desc: "Notoriété assistée en hausse de +11pts sur le marché camerounais depuis janvier 2026.",
      badge: "+11 pts",
      icon: Sparkles,
    },
  ],
};

const extraCards: Record<
  DivisionId,
  { title: string; value: string; desc: string; color: string; icon: any }[]
> = {
  groupe: [
    {
      title: "Décisions en attente",
      value: "5",
      desc: "3 achats > seuil, 1 contrat partenaire, 1 recrutement",
      color: "#E8612D",
      icon: ClipboardList,
    },
    {
      title: "Rentabilité globale",
      value: "+12 %",
      desc: "Hausse de la marge nette consolidée vs Q1",
      color: "#059669",
      icon: TrendingUp,
    },
    {
      title: "Agents IA déployés",
      value: "4",
      desc: "Relance, Stocks, Rédaction, Analyse",
      color: "#7C3AED",
      icon: Bot,
    },
    {
      title: "Satisfaction équipe",
      value: "4,3/5",
      desc: "Moyenne de satisfaction des collaborateurs",
      color: "#EC4899",
      icon: Heart,
    },
  ],
  vin: [
    {
      title: "Top vente du mois",
      value: "Grand cru Démo 2019",
      desc: "42 bouteilles vendues — marge 62%",
      color: "#8B1A4A",
      icon: Wine,
    },
    {
      title: "Fournisseurs actifs",
      value: "12",
      desc: "3 nouveaux ce trimestre",
      color: "#059669",
      icon: Users,
    },
    {
      title: "Prévision commande",
      value: "J+4",
      desc: "Réapprovisionnement automatisé prévu",
      color: "#3B82F6",
      icon: Clock,
    },
    {
      title: "Clients fidèles",
      value: "28",
      desc: "Programme de fidélité active",
      color: "#EC4899",
      icon: Heart,
    },
  ],
  genesis: [
    {
      title: "Cocktail star",
      value: "Mojito Bridges",
      desc: "182 ventes — marge nette 78%",
      color: "#10B981",
      icon: Zap,
    },
    {
      title: "Réservations VIP",
      value: "12",
      desc: "4 soirées privées cette semaine",
      color: "#7C3AED",
      icon: Sparkles,
    },
    {
      title: "Serveurs assignés",
      value: "8",
      desc: "Planning optimisé par l'IA",
      color: "#3B82F6",
      icon: Users,
    },
    {
      title: "Ambiance musicale",
      value: "Playlist IA",
      desc: "Sélection dynamique selon l'affluence",
      color: "#EC4899",
      icon: Zap,
    },
  ],
  quincaillerie: [
    {
      title: "Ciment en stock",
      value: "14 T CPJ35",
      desc: "Réapprovisionnement dans 3 jours",
      color: "#3B82F6",
      icon: Package,
    },
    {
      title: "Clients chantiers",
      value: "18 actifs",
      desc: "6 livraisons programmées aujourd'hui",
      color: "#059669",
      icon: Truck,
    },
    {
      title: "Impayés à relancer",
      value: "4 200 €",
      desc: "Client Démo 3 — agent IA en suivi",
      color: "#E8612D",
      icon: AlertTriangle,
    },
    {
      title: "Marge comptoir",
      value: "32 %",
      desc: "Meilleur mois depuis janvier",
      color: "#7C3AED",
      icon: TrendingUp,
    },
  ],
  academy: [
    {
      title: "Univ. Démo D",
      value: "Contrat Activé",
      desc: "Budget 50 000 € · Intervenant assigné",
      color: "#2563EB",
      icon: FileCheck,
    },
    {
      title: "Univ. Démo E",
      value: "Activité 18 Juin",
      desc: "Besoin financier validé · Comm. OK",
      color: "#059669",
      icon: Clock,
    },
    {
      title: "Univ. Démo F",
      value: "En attente Comm.",
      desc: "Budget 25 000 € · Programme validé",
      color: "#7C3AED",
      icon: AlertTriangle,
    },
    {
      title: "Partenariats Actifs",
      value: "6 Universités",
      desc: "Contrats spécifiques et budgets alloués",
      color: "#10B981",
      icon: GraduationCap,
    },
  ],
  dev: [
    {
      title: "Uptime VPS",
      value: "99.97 %",
      desc: "Serveur souverain Cameroun",
      color: "#059669",
      icon: Activity,
    },
    {
      title: "Sprints actifs",
      value: "3",
      desc: "Bridges OS, API, Mobile",
      color: "#7C3AED",
      icon: Code2,
    },
    {
      title: "Temps de build",
      value: "14 min",
      desc: "Pipeline CI/CD optimisé",
      color: "#3B82F6",
      icon: Zap,
    },
    {
      title: "Code review",
      value: "98 % done",
      desc: "Toutes les PR revues cette semaine",
      color: "#E8612D",
      icon: CheckSquare,
    },
  ],
  satglob: [
    {
      title: "Partenaires actifs",
      value: "8 pays",
      desc: "Afrique Centrale et Occidentale",
      color: "#059669",
      icon: Building2,
    },
    {
      title: "Contrats signés Q2",
      value: "12",
      desc: "Valeur totale : 89 000 €",
      color: "#3B82F6",
      icon: FileCheck,
    },
    {
      title: "Temps de réponse",
      value: "< 2h",
      desc: "SLA respecté à 99,8%",
      color: "#7C3AED",
      icon: Clock,
    },
    {
      title: "Revenus récurrents",
      value: "72 %",
      desc: "Part des revenus sous contrat annuel",
      color: "#10B981",
      icon: TrendingUp,
    },
  ],
  commarketing: [
    {
      title: "Posts programmés",
      value: "24",
      desc: "Instagram 12 · LinkedIn 8 · Facebook 4",
      color: "#EC4899",
      icon: Camera,
    },
    {
      title: "Newsletters envoyées",
      value: "3 200",
      desc: "Taux d'ouverture : 28% — secteur: 18%",
      color: "#3B82F6",
      icon: Share2,
    },
    {
      title: "Mentions presse",
      value: "7",
      desc: "Articles positifs ce trimestre",
      color: "#059669",
      icon: Megaphone,
    },
    {
      title: "ROI campagnes",
      value: "340 %",
      desc: "Retour sur investissement marketing",
      color: "#7C3AED",
      icon: TrendingUp,
    },
  ],
};

function ShoppingCartIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}

const assistantReplies: Record<string, string> = {
  default:
    "Bonjour ! Je suis l'assistant IA de Bridgesat. En tant que Super Admin, vous pouvez me poser n'importe quelle question sur les opérations, les finances de chaque filiale, les accès RH ou les agents IA. Exemple : « Quels dossiers bloquent la direction ? » ou « Qui a accès à la Quincaillerie ? »",
  validation:
    "📋 3 validations critiques direction sont en suspens :\n• 1 achat (Vins) — Bon commande fournisseur verre\n• 1 contrat (SATGLOB) — Avenant SLA distributeur\n• 1 devis VIP (Genesis Bar) — Traiteur du 29 mai\n\n➡️ Action suggérée : Signer le devis Genesis en priorité pour garantir la réservation.",
  stock:
    "📦 Alertes Stocks en cours :\n• **Genesis Bar** : Menthe fraîche et Gin premium Démo sous le seuil de sécurité.\n• **Quincaillerie** : Fer à béton de 12 sous le seuil (approvisionnement en retard de 2j).\n\nL'agent IA suggère un réapprovisionnement automatique chez le fournisseur habituel.",
  relance:
    "🔔 Relances IA Actives :\n• 9 clients de la Quincaillerie relancés automatiquement aujourd'hui.\n• 1 partenaire SATGLOB en attente de réponse.\n\nLe taux de recouvrement par notre agent de relance autonome est de 68% sur les 30 derniers jours.",
  dev: "🚀 État Dev : 9 projets actifs. Release 2.8.4 validée by la QA. 0 ticket bloquant critique. Documentation à 78 % de couverture.",
  securite:
    "🔒 Sécurité & Contrôle SEC :\n• Le SEC a un contrôle total de la configuration de tous les agents IA.\n• Le modèle d'accès est RBAC : un caissier ne peut pas voir le chiffre d'affaires global ou le panneau RH.\n• Toutes les conversations et actions des agents sont stockées localement et chiffrées sur votre propre VPS dédié.",
  marketing:
    "📢 Rapport Communication & Marketing :\n• 6 campagnes actives (3 réseaux sociaux, 2 email, 1 presse)\n• 148 leads générés ce mois (+34%)\n• Taux d'engagement : 4,7% (benchmark secteur : 2,1%)\n• ROI campagnes : 340%\n• Agent IA Rédaction : 5 posts LinkedIn programmés cette semaine\n\nRecommandation : augmenter le budget Instagram de 15% pour maximiser le ROI.",
  academy:
    "🎓 Partenariats Académiques & Universitaires :\n• 6 Universités actives (Démo A, B, C, D, E & F)\n• Budget total : 185 000 €\n• 1 alerte calendrier : Séminaire Univ. Démo B sans intervenant assigné (SLA J+5)\n• Couverture de Communication : 92% des activités publiées\n\nAction requise : valider le budget Univ. Démo F (25 000 €) et affecter un animateur pour l'Univ. Démo B.",
};

/* ─── Helpers ──────────────────────────────────────────────────────── */

function StatusDot({ status }: { status: "ok" | "warn" | "late" }) {
  const colors = {
    ok: "bg-emerald-500",
    warn: "bg-amber-500",
    late: "bg-rose-500",
  };
  return <span className={`inline-block h-2 w-2 rounded-full ${colors[status]}`} />;
}

function StatusPill({ status }: { status: "ok" | "warn" | "late" }) {
  const map = {
    ok: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      label: "Fluide",
    },
    warn: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      label: "À surveiller",
    },
    late: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", label: "Retard" },
  };
  const s = map[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${s.bg} ${s.text} ${s.border}`}
    >
      <StatusDot status={status} />
      {s.label}
    </span>
  );
}

function PriorityPill({ priority }: { priority: "high" | "medium" | "low" }) {
  const map = {
    high: { bg: "bg-rose-50", text: "text-rose-700", label: "Urgent" },
    medium: { bg: "bg-amber-50", text: "text-amber-700", label: "Normal" },
    low: { bg: "bg-sky-50", text: "text-sky-600", label: "Faible" },
  };
  const s = map[priority];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${s.bg} ${s.text}`}
    >
      {s.label}
    </span>
  );
}

function ChannelIcon({ channel }: { channel: "email" | "phone" | "whatsapp" }) {
  const map = {
    email: Mail,
    phone: Phone,
    whatsapp: MessageSquare,
  };
  const Icon = map[channel];
  return <Icon className="h-3.5 w-3.5 text-gray-400" />;
}

function TrendIcon({ trend }: { trend?: "up" | "down" | "neutral" }) {
  if (trend === "up") return <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />;
  if (trend === "down") return <TrendingDown className="h-3.5 w-3.5 text-rose-500" />;
  return <span className="h-3.5 w-3.5 text-gray-400">—</span>;
}

/* ─── Main Component ───────────────────────────────────────────────── */

function BridgesOsPrototypePage() {
  const [division, setDivision] = useState<DivisionId>("groupe");
  const [activePanel, setActivePanel] = useState<
    "overview" | "workflows" | "docs" | "tasks" | "finance-rh" | "agents" | "relances" | "activity"
  >("overview");

  // Interactive states
  const [assistantQuery, setAssistantQuery] = useState("");
  const [assistantReply, setAssistantReply] = useState(assistantReplies.default);
  const [assistantTyping, setAssistantTyping] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Prospection state
  const [relances, setRelances] = useState<RelanceRow[]>([
    {
      id: "1",
      client: "Client Démo 1",
      subject: "Commande lot millésime 2024",
      lastContact: "Il y a 3 jours",
      nextAction: "Relance email prix",
      priority: "high",
      channel: "email",
      status: "pending",
      type: "client",
    },
    {
      id: "2",
      client: "Client Démo 2",
      subject: "Livraison mensuelle vin premium",
      lastContact: "Il y a 1 jour",
      nextAction: "Confirmation WhatsApp",
      priority: "medium",
      channel: "whatsapp",
      status: "sent",
      type: "client",
    },
    {
      id: "3",
      client: "Client Démo 3",
      subject: "Relance facture matériaux 4200€",
      lastContact: "Il y a 5 jours",
      nextAction: "Appel de rappel",
      priority: "high",
      channel: "phone",
      status: "overdue",
      type: "client",
    },
    {
      id: "4",
      client: "Associé Démo",
      subject: "Associé principal - Validation equity",
      lastContact: "Aujourd'hui",
      nextAction: "Aucune action requise",
      priority: "low",
      channel: "email",
      status: "sent",
      type: "associé",
    },
    {
      id: "5",
      client: "Collaborateur Démo 3",
      subject: "Responsable Quincaillerie - Accords chantiers",
      lastContact: "Il y a 2 jours",
      nextAction: "Briefing",
      priority: "medium",
      channel: "whatsapp",
      status: "pending",
      type: "collaborateur",
    },
  ]);

  // Prospection Form State
  const [newProspectName, setNewProspectName] = useState("");
  const [newProspectType, setNewProspectType] = useState<"associé" | "collaborateur" | "client">(
    "client",
  );
  const [newProspectEmail, setNewProspectEmail] = useState("");
  const [newProspectPhone, setNewProspectPhone] = useState("");
  const [newProspectSubject, setNewProspectSubject] = useState("");
  const [showProspectForm, setShowProspectForm] = useState(false);

  // RH Team State
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "Associé Démo",
      role: "Super Admin (SEC)",
      email: "associe@exemple.test",
      access: {
        groupe: true,
        vin: true,
        academy: true,
        dev: true,
        satglob: true,
        genesis: true,
        quincaillerie: true,
        commarketing: true,
      },
    },
    {
      id: "2",
      name: "Collaborateur Démo 1",
      role: "Directeur Vin & Commerce",
      email: "collaborateur1@exemple.test",
      access: {
        groupe: false,
        vin: true,
        academy: false,
        dev: false,
        satglob: false,
        genesis: false,
        quincaillerie: false,
        commarketing: false,
      },
    },
    {
      id: "3",
      name: "Collaborateur Démo 2",
      role: "Responsable Genesis Bar",
      email: "collaborateur2@exemple.test",
      access: {
        groupe: false,
        vin: false,
        academy: false,
        dev: false,
        satglob: false,
        genesis: true,
        quincaillerie: false,
        commarketing: false,
      },
    },
    {
      id: "4",
      name: "Collaborateur Démo 3",
      role: "Responsable Quincaillerie",
      email: "collaborateur3@exemple.test",
      access: {
        groupe: false,
        vin: false,
        academy: false,
        dev: false,
        satglob: false,
        genesis: false,
        quincaillerie: true,
        commarketing: false,
      },
    },
    {
      id: "5",
      name: "Collaborateur Démo 4",
      role: "Secrétaire Générale (SEC)",
      email: "collaborateur4@exemple.test",
      access: {
        groupe: true,
        vin: true,
        academy: true,
        dev: true,
        satglob: true,
        genesis: true,
        quincaillerie: true,
        commarketing: true,
      },
    },
    {
      id: "6",
      name: "Collaborateur Démo 5",
      role: "Responsable Com & Marketing",
      email: "collaborateur5@exemple.test",
      access: {
        groupe: false,
        vin: false,
        academy: false,
        dev: false,
        satglob: false,
        genesis: false,
        quincaillerie: false,
        commarketing: true,
      },
    },
  ]);
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [showInviteForm, setShowInviteForm] = useState(false);

  // AI Agents State
  const [aiAgents, setAiAgents] = useState<AiAgent[]>([
    {
      id: "1",
      name: "Agent Relance Auto",
      role: "Suivi des factures impayées & clients",
      skills: ["Relance Email", "WhatsApp Auto", "Calcul retards"],
      tokensUsed: 1245000,
      deployedTo: "Collaborateur Démo 1",
      status: "active",
    },
    {
      id: "2",
      name: "Agent Stocks & Ruptures",
      role: "Vigilance inventaire et achats",
      skills: ["Alerte stocks bas", "Proposition de commande", "Analyse marge"],
      tokensUsed: 842000,
      deployedTo: "Collaborateur Démo 3",
      status: "active",
    },
    {
      id: "3",
      name: "Agent Assistant SEC",
      role: "Recherche et synthèse administrative",
      skills: ["Analyse de contrats", "Synthèse direction", "Alerte SLA"],
      tokensUsed: 2154000,
      deployedTo: "Collaborateur Démo 4",
      status: "active",
    },
  ]);
  const [newAgentName, setNewAgentName] = useState("");
  const [newAgentRole, setNewAgentRole] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [deployUser, setDeployUser] = useState("Collaborateur Démo 4");
  const [showAgentForm, setShowAgentForm] = useState(false);

  // Tasks State
  const [tasks, setTasks] = useState<TaskRow[]>([
    {
      id: "1",
      title: "Valider l'inventaire annuel du chai",
      assignedTo: "Collaborateur Démo 1",
      dueDate: "28/05/2026",
      status: "in_progress",
      priority: "high",
    },
    {
      id: "2",
      title: "Commander la menthe fraîche pour le weekend",
      assignedTo: "Collaborateur Démo 2",
      dueDate: "27/05/2026",
      status: "todo",
      priority: "high",
    },
    {
      id: "3",
      title: "Relancer la créance Client Démo 3 de 4200€",
      assignedTo: "Agent Relance Auto",
      dueDate: "Aujourd'hui",
      status: "in_progress",
      priority: "high",
    },
    {
      id: "4",
      title: "Mettre à jour la grille des prix du fer de 12",
      assignedTo: "Collaborateur Démo 3",
      dueDate: "30/05/2026",
      status: "todo",
      priority: "medium",
    },
    {
      id: "5",
      title: "Signer le contrat de distribution SATGLOB",
      assignedTo: "Associé Démo",
      dueDate: "29/05/2026",
      status: "todo",
      priority: "high",
    },
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskAssigned, setNewTaskAssigned] = useState("Tous");
  const [newTaskPriority, setNewTaskPriority] = useState<"high" | "medium" | "low">("medium");
  const [showTaskForm, setShowTaskForm] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const current = divisions.find((d) => d.id === division)!;
  const data = divisionData[division] || divisionData.groupe;

  const navPanels = [
    { id: "overview" as const, label: "Tableau de bord", icon: LayoutDashboard },
    { id: "workflows" as const, label: "Flux métier", icon: ClipboardList },
    { id: "docs" as const, label: "Coffre Documentaire", icon: FileCheck },
    { id: "tasks" as const, label: "Gestion des Tâches", icon: CheckSquare },
    { id: "finance-rh" as const, label: "Finances & RH", icon: DollarSign },
    { id: "agents" as const, label: "Gestion des Agents IA", icon: Bot },
    { id: "relances" as const, label: "Prospection & Relances", icon: RefreshCcw },
    { id: "activity" as const, label: "Fil d'activité", icon: Activity },
  ];

  const progressScore = useMemo(() => {
    const late = data.workflows.filter((w) => w.status === "late").length;
    const warn = data.workflows.filter((w) => w.status === "warn").length;
    return Math.max(65, 95 - late * 10 - warn * 5);
  }, [data.workflows]);

  const relanceStats = useMemo(() => {
    return {
      total: relances.length,
      overdue: relances.filter((r) => r.status === "overdue").length,
      pending: relances.filter((r) => r.status === "pending").length,
      sent: relances.filter((r) => r.status === "sent").length,
    };
  }, [relances]);

  // Handlers for dynamic actions
  function handleAddProspect(e: React.FormEvent) {
    e.preventDefault();
    if (!newProspectName.trim()) return;

    const newProspect: RelanceRow = {
      id: Date.now().toString(),
      client: newProspectName,
      type: newProspectType,
      subject: newProspectSubject || `Suivi prospection - ${newProspectType}`,
      lastContact: "Aujourd'hui",
      nextAction:
        newProspectType === "client" ? "Relance automatique dans 3 jours" : "Réunion de cadrage",
      priority: newProspectType === "client" ? "high" : "medium",
      channel: "email",
      status: "pending",
    };

    setRelances([newProspect, ...relances]);
    setNewProspectName("");
    setNewProspectEmail("");
    setNewProspectPhone("");
    setNewProspectSubject("");
    setShowProspectForm(false);
  }

  function handleInviteMember(e: React.FormEvent) {
    e.preventDefault();
    if (!inviteName.trim()) return;

    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: inviteName,
      role: inviteRole || "Collaborateur",
      email: inviteEmail || `${inviteName.toLowerCase().replace(/\s+/g, ".")}@exemple.test`,
      access: {
        groupe: false,
        vin: false,
        academy: false,
        dev: false,
        satglob: false,
        genesis: false,
        quincaillerie: false,
        commarketing: false,
      },
    };

    setTeamMembers([...teamMembers, newMember]);
    setInviteName("");
    setInviteRole("");
    setInviteEmail("");
    setShowInviteForm(false);
  }

  function toggleAccess(memberId: string, divId: DivisionId) {
    setTeamMembers(
      teamMembers.map((m) => {
        if (m.id === memberId) {
          return {
            ...m,
            access: {
              ...m.access,
              [divId]: !m.access[divId],
            },
          };
        }
        return m;
      }),
    );
  }

  function handleCreateAgent(e: React.FormEvent) {
    e.preventDefault();
    if (!newAgentName.trim()) return;

    const newAgent: AiAgent = {
      id: Date.now().toString(),
      name: newAgentName,
      role: newAgentRole || "Assistant automatisé",
      skills:
        selectedSkills.length > 0 ? selectedSkills : ["Analyse de données", "Interaction client"],
      tokensUsed: 0,
      deployedTo: deployUser,
      status: "active",
    };

    setAiAgents([...aiAgents, newAgent]);
    setNewAgentName("");
    setNewAgentRole("");
    setSelectedSkills([]);
    setShowAgentForm(false);
  }

  function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: TaskRow = {
      id: Date.now().toString(),
      title: newTaskTitle,
      assignedTo: newTaskAssigned,
      dueDate: "À définir",
      status: "todo",
      priority: newTaskPriority,
    };

    setTasks([newTask, ...tasks]);
    setNewTaskTitle("");
    setShowTaskForm(false);
  }

  function runAssistant() {
    if (!assistantQuery.trim()) return;
    setAssistantTyping(true);
    setTimeout(() => {
      const q = assistantQuery.toLowerCase();
      if (q.includes("validation") || q.includes("direction") || q.includes("bloqu"))
        setAssistantReply(assistantReplies.validation);
      else if (q.includes("stock") || q.includes("vin") || q.includes("achat"))
        setAssistantReply(assistantReplies.stock);
      else if (q.includes("relance") || q.includes("client") || q.includes("rappel"))
        setAssistantReply(assistantReplies.relance);
      else if (q.includes("dev") || q.includes("release") || q.includes("qa"))
        setAssistantReply(assistantReplies.dev);
      else if (
        q.includes("sécurité") ||
        q.includes("securite") ||
        q.includes("accès") ||
        q.includes("sec")
      )
        setAssistantReply(assistantReplies.securite);
      else if (
        q.includes("marketing") ||
        q.includes("communication") ||
        q.includes("campaign") ||
        q.includes("social") ||
        q.includes("com")
      )
        setAssistantReply(assistantReplies.marketing);
      else if (
        q.includes("academy") ||
        q.includes("université") ||
        q.includes("universite") ||
        q.includes("partenariat") ||
        q.includes("programme")
      )
        setAssistantReply(assistantReplies.academy);
      else setAssistantReply(assistantReplies.default);
      setAssistantTyping(false);
      setAssistantQuery("");
    }, 800);
  }

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        background: "#F7F8FA",
        minHeight: "100vh",
        display: "flex",
        color: "#1a1a2e",
      }}
    >
      {/* ── Sidebar ───────────────────────────────────────────────── */}
      <aside
        style={{
          width: sidebarCollapsed ? 68 : 260,
          minHeight: "100vh",
          background: "#FFFFFF",
          borderRight: "1px solid #E8E8ED",
          display: "flex",
          flexDirection: "column",
          transition: "width 0.25s cubic-bezier(0.4,0,0.2,1)",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {/* Logo Header */}
        <div
          style={{
            padding: sidebarCollapsed ? "16px 12px" : "20px 20px 16px",
            borderBottom: "1px solid #F0F0F5",
            display: "flex",
            alignItems: "center",
            gap: 12,
            cursor: "pointer",
          }}
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          <img
            src="/bridgesat-logo.png"
            alt="Bridgesat"
            onError={(e) => {
              // Fallback if logo not found
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&auto=format&fit=crop&q=60";
            }}
            style={{
              height: 36,
              width: 36,
              objectFit: "contain",
              flexShrink: 0,
              borderRadius: 8,
            }}
          />
          {!sidebarCollapsed && (
            <div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#1a1a2e",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                }}
              >
                Bridgesat
              </div>
              <div style={{ fontSize: 11, color: "#8C8CA1", marginTop: 1 }}>
                Pilotage opérationnel
              </div>
            </div>
          )}
        </div>

        {/* Division Nav */}
        <div style={{ padding: "12px 8px", flex: 1, overflowY: "auto" }}>
          {!sidebarCollapsed && (
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "#A0A0B0",
                padding: "4px 12px 8px",
              }}
            >
              Pôles d'activité
            </div>
          )}
          {divisions.map((d) => {
            const isActive = division === d.id;
            return (
              <button
                key={d.id}
                onClick={() => {
                  setDivision(d.id);
                  setActivePanel("overview");
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  padding: sidebarCollapsed ? "10px 0" : "8px 12px",
                  justifyContent: sidebarCollapsed ? "center" : "flex-start",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  marginBottom: 2,
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? d.color : "#555566",
                  background: isActive ? `${d.color}10` : "transparent",
                  transition: "all 0.15s ease",
                  textAlign: "left",
                }}
                title={d.label}
              >
                <d.icon
                  style={{
                    width: 18,
                    height: 18,
                    flexShrink: 0,
                    color: isActive ? d.color : "#8C8CA1",
                  }}
                />
                {!sidebarCollapsed && <span>{d.short}</span>}
              </button>
            );
          })}

          {!sidebarCollapsed && (
            <>
              <div style={{ height: 1, background: "#F0F0F5", margin: "12px 12px" }} />
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#A0A0B0",
                  padding: "4px 12px 8px",
                }}
              >
                Navigation
              </div>
            </>
          )}
          {navPanels.map((p) => {
            const isActive2 = activePanel === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setActivePanel(p.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  padding: sidebarCollapsed ? "10px 0" : "8px 12px",
                  justifyContent: sidebarCollapsed ? "center" : "flex-start",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  marginBottom: 2,
                  fontSize: 13,
                  fontWeight: isActive2 ? 600 : 400,
                  color: isActive2 ? "#E8612D" : "#555566",
                  background: isActive2 ? "#FEF2EC" : "transparent",
                  transition: "all 0.15s ease",
                  textAlign: "left",
                }}
                title={p.label}
              >
                <p.icon
                  style={{
                    width: 18,
                    height: 18,
                    flexShrink: 0,
                    color: isActive2 ? "#E8612D" : "#8C8CA1",
                  }}
                />
                {!sidebarCollapsed && <span>{p.label}</span>}
                {!sidebarCollapsed && p.id === "relances" && relanceStats.overdue > 0 && (
                  <span
                    style={{
                      marginLeft: "auto",
                      background: "#FEE2E2",
                      color: "#DC2626",
                      fontSize: 10,
                      fontWeight: 700,
                      borderRadius: 10,
                      padding: "1px 6px",
                    }}
                  >
                    {relanceStats.overdue}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        {!sidebarCollapsed && (
          <div style={{ padding: "12px 20px 16px", borderTop: "1px solid #F0F0F5" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Lock style={{ width: 12, height: 12, color: "#A0A0B0" }} />
              <span style={{ fontSize: 10, color: "#A0A0B0" }}>Données sécurisées · VPS dédié</span>
            </div>
            <div style={{ fontSize: 10, color: "#C0C0D0", marginTop: 6 }}>
              Conception Opays Tech
            </div>
          </div>
        )}
      </aside>

      {/* ── Main Content ──────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Top Bar */}
        <header
          style={{
            height: 56,
            background: "#FFFFFF",
            borderBottom: "1px solid #E8E8ED",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 24px",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <current.icon style={{ width: 20, height: 20, color: current.color }} />
            <div>
              <h1
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  margin: 0,
                  letterSpacing: "-0.02em",
                  color: "#1a1a2e",
                }}
              >
                {current.label}
              </h1>
              <p style={{ fontSize: 12, color: "#8C8CA1", margin: 0 }}>{current.tagline}</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Super Admin status indicator */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "#FEE2E2",
                borderRadius: 20,
                padding: "4px 12px",
                fontSize: 11,
                fontWeight: 700,
                color: "#DC2626",
                border: "1px solid #FCA5A5",
                animation: "pulse 2s infinite",
              }}
            >
              <Shield style={{ width: 13, height: 13 }} />
              Super Admin (SEC)
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "#FEF2EC",
                borderRadius: 20,
                padding: "4px 12px",
                fontSize: 11,
                fontWeight: 500,
                color: "#E8612D",
              }}
            >
              <Sparkles style={{ width: 14, height: 14 }} />
              Pilote IA actif
            </div>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${current.color}, ${current.color}CC)`,
                display: "flex",
                alignItems: "center",
                justifyItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
                color: "white",
              }}
            >
              FL
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main style={{ flex: 1, padding: 24, overflowY: "auto" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${division}-${activePanel}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* ─── TABLEAU DE BORD (OVERVIEW) ─────────────────── */}
              {activePanel === "overview" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  {/* Focus Banner */}
                  <div
                    style={{
                      background: `linear-gradient(135deg, ${current.color}08, ${current.color}14)`,
                      border: `1px solid ${current.color}20`,
                      borderRadius: 16,
                      padding: "20px 24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 16,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          color: current.color,
                          marginBottom: 4,
                        }}
                      >
                        Focus stratégique - Administrateur
                      </div>
                      <div style={{ fontSize: 14, color: "#333345", maxWidth: 600 }}>
                        {data.focus}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 10, color: "#8C8CA1", textTransform: "uppercase" }}>
                          Fluidité du flux
                        </div>
                        <div
                          style={{
                            fontSize: 28,
                            fontWeight: 800,
                            color:
                              progressScore >= 80
                                ? "#059669"
                                : progressScore >= 70
                                  ? "#D97706"
                                  : "#DC2626",
                            lineHeight: 1.1,
                          }}
                        >
                          {progressScore}%
                        </div>
                      </div>
                      <div
                        style={{
                          width: 120,
                          height: 8,
                          background: "#E8E8ED",
                          borderRadius: 4,
                          overflow: "hidden",
                        }}
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progressScore}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          style={{
                            height: "100%",
                            borderRadius: 4,
                            background:
                              progressScore >= 80
                                ? "linear-gradient(90deg, #059669, #10B981)"
                                : progressScore >= 70
                                  ? "linear-gradient(90deg, #D97706, #F59E0B)"
                                  : "linear-gradient(90deg, #DC2626, #EF4444)",
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* KPI Cards */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                      gap: 16,
                    }}
                  >
                    {data.kpis.map((kpi, i) => (
                      <motion.div
                        key={kpi.label}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        style={{
                          background: "#FFFFFF",
                          borderRadius: 14,
                          padding: "20px",
                          border: "1px solid #E8E8ED",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: 12,
                          }}
                        >
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 10,
                              background: `${current.color}10`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <kpi.icon style={{ width: 18, height: 18, color: current.color }} />
                          </div>
                          <TrendIcon trend={kpi.trend} />
                        </div>
                        <div
                          style={{
                            fontSize: 26,
                            fontWeight: 800,
                            color: "#1a1a2e",
                            lineHeight: 1.1,
                            letterSpacing: "-0.02em",
                          }}
                        >
                          {kpi.value}
                        </div>
                        <div
                          style={{ fontSize: 12, color: "#555566", marginTop: 4, fontWeight: 500 }}
                        >
                          {kpi.label}
                        </div>
                        <div style={{ fontSize: 11, color: "#A0A0B0", marginTop: 2 }}>
                          {kpi.hint}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Specialized Operational Cards */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        color: "#A0A0B0",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <Activity style={{ width: 14, height: 14, color: "#E8612D" }} />
                      Réalités Métier & Intelligence Terrain
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                        gap: 16,
                      }}
                    >
                      {(specializedCards[division] || specializedCards.groupe).map((c, i) => (
                        <motion.div
                          key={c.title}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.06 }}
                          style={{
                            background: "#FFFFFF",
                            borderRadius: 14,
                            padding: "20px",
                            border: "1px solid #E8E8ED",
                            borderLeft: `4px solid ${current.color}`,
                            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              marginBottom: 12,
                            }}
                          >
                            <div
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: 8,
                                background: `${current.color}10`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <c.icon style={{ width: 16, height: 16, color: current.color }} />
                            </div>
                            <span
                              style={{
                                fontSize: 9,
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                                padding: "2px 8px",
                                borderRadius: 12,
                                background: `${current.color}08`,
                                color: current.color,
                                border: `1px solid ${current.color}30`,
                              }}
                            >
                              {c.badge}
                            </span>
                          </div>
                          <div
                            style={{
                              fontSize: 14,
                              fontWeight: 700,
                              color: "#1a1a2e",
                              lineHeight: 1.2,
                            }}
                          >
                            {c.title}
                          </div>
                          <div
                            style={{
                              fontSize: 15,
                              fontWeight: 800,
                              color: current.color,
                              marginTop: 4,
                            }}
                          >
                            {c.value}
                          </div>
                          <p
                            style={{
                              fontSize: 11,
                              color: "#666677",
                              marginTop: 8,
                              lineHeight: 1.4,
                              margin: "8px 0 0 0",
                            }}
                          >
                            {c.desc}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Extra Rich Cards */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        color: "#A0A0B0",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <Sparkles style={{ width: 14, height: 14, color: "#7C3AED" }} />
                      Actions & Insights Clés
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: 16,
                      }}
                    >
                      {(extraCards[division] || extraCards.groupe).map((ec, i) => (
                        <motion.div
                          key={ec.title}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          style={{
                            background: "#FFFFFF",
                            borderRadius: 14,
                            padding: "16px",
                            border: `1px solid ${ec.color}25`,
                            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                            position: "relative",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: 8,
                              background: `${ec.color}15`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              marginBottom: 12,
                              color: ec.color,
                            }}
                          >
                            <ec.icon style={{ width: 16, height: 16 }} />
                          </div>
                          <div
                            style={{
                              fontSize: 18,
                              fontWeight: 800,
                              color: ec.color,
                              lineHeight: 1.1,
                            }}
                          >
                            {ec.value}
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                              color: "#333345",
                              marginTop: 4,
                            }}
                          >
                            {ec.title}
                          </div>
                          <div style={{ fontSize: 10, color: "#8C8CA1", marginTop: 2 }}>
                            {ec.desc}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Split Layout: Synthèse & Assistant */}
                  <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 20 }}>
                    {/* Workflows Summary */}
                    <div
                      style={{
                        background: "#FFFFFF",
                        borderRadius: 14,
                        border: "1px solid #E8E8ED",
                        overflow: "hidden",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                      }}
                    >
                      <div
                        style={{
                          padding: "16px 20px",
                          borderBottom: "1px solid #F0F0F5",
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <BarChart3 style={{ width: 16, height: 16, color: current.color }} />
                        <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1a2e" }}>
                          Synthèse opérationnelle ({current.short})
                        </span>
                      </div>
                      <div style={{ padding: "8px 12px" }}>
                        {data.workflows.map((w) => (
                          <div
                            key={w.name}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "12px",
                              borderRadius: 10,
                              margin: "2px 0",
                              cursor: "pointer",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <ChevronRight style={{ width: 14, height: 14, color: "#C0C0D0" }} />
                              <span style={{ fontSize: 13, color: "#333345", fontWeight: 500 }}>
                                {w.name}
                              </span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                              <span style={{ fontSize: 12, color: "#8C8CA1" }}>
                                {w.count} dossiers
                              </span>
                              <StatusPill status={w.status} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI Assistant */}
                    <div
                      style={{
                        background: "#FFFFFF",
                        borderRadius: 14,
                        border: "1px solid #E8E8ED",
                        overflow: "hidden",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <div
                        style={{
                          padding: "16px 20px",
                          borderBottom: "1px solid #F0F0F5",
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          background: "linear-gradient(135deg, #FEF2EC, #FFF7ED)",
                        }}
                      >
                        <Bot style={{ width: 16, height: 16, color: "#E8612D" }} />
                        <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1a2e" }}>
                          Assistant IA Super Admin
                        </span>
                      </div>
                      <div
                        style={{
                          padding: 16,
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          gap: 12,
                        }}
                      >
                        <div
                          style={{
                            flex: 1,
                            background: "#F7F8FA",
                            borderRadius: 12,
                            padding: 16,
                            fontSize: 13,
                            color: "#333345",
                            lineHeight: 1.6,
                            whiteSpace: "pre-line",
                            minHeight: 120,
                          }}
                        >
                          {assistantTyping ? (
                            <span style={{ color: "#8C8CA1" }}>
                              Analyse des flux opérationnels...
                            </span>
                          ) : (
                            assistantReply
                          )}
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <input
                            type="text"
                            placeholder="Interroger l'assistant... (ex: validations, stock, sécurité)"
                            value={assistantQuery}
                            onChange={(e) => setAssistantQuery(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && runAssistant()}
                            style={{
                              flex: 1,
                              border: "1px solid #E8E8ED",
                              borderRadius: 10,
                              padding: "10px 14px",
                              fontSize: 13,
                              outline: "none",
                              background: "#FFFFFF",
                            }}
                          />
                          <button
                            onClick={runAssistant}
                            style={{
                              border: "none",
                              borderRadius: 10,
                              background: "#E8612D",
                              color: "white",
                              padding: "0 16px",
                              cursor: "pointer",
                            }}
                          >
                            <Send style={{ width: 14, height: 14 }} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ─── FLUX MÉTIER (WORKFLOWS) ───────────────────── */}
              {activePanel === "workflows" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  <div
                    style={{
                      background: "#FFFFFF",
                      borderRadius: 14,
                      border: "1px solid #E8E8ED",
                      padding: 24,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    }}
                  >
                    <h2
                      style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e", marginBottom: 4 }}
                    >
                      Pipeline Opérationnel — Vue Admin
                    </h2>
                    <p style={{ fontSize: 12, color: "#8C8CA1", marginBottom: 24 }}>
                      Suivi complet de la fluidité des processus métier de la filiale{" "}
                      {current.short}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 0,
                        flexWrap: "wrap",
                      }}
                    >
                      {[
                        "Demande",
                        "Audit/Stock",
                        "Validation SEC",
                        "Action Agent IA",
                        "Clôture",
                      ].map((step, i) => (
                        <div key={step} style={{ display: "flex", alignItems: "center" }}>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignContent: "center",
                              alignItems: "center",
                              gap: 8,
                              minWidth: 110,
                            }}
                          >
                            <div
                              style={{
                                width: 44,
                                height: 44,
                                borderRadius: "50%",
                                border: `2px solid ${i < 3 ? "#059669" : i === 3 ? current.color : "#E8E8ED"}`,
                                background:
                                  i < 3 ? "#ECFDF5" : i === 3 ? `${current.color}10` : "#F7F8FA",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 14,
                                fontWeight: 700,
                                color: i < 3 ? "#059669" : i === 3 ? current.color : "#A0A0B0",
                              }}
                            >
                              {i < 3 ? <CheckCircle2 style={{ width: 20, height: 20 }} /> : i + 1}
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 600, color: "#333345" }}>
                              {step}
                            </span>
                          </div>
                          {i < 4 && (
                            <div
                              style={{
                                width: 50,
                                height: 2,
                                background:
                                  i < 2 ? "#059669" : i === 2 ? `${current.color}60` : "#E8E8ED",
                                marginBottom: 24,
                              }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                      gap: 16,
                    }}
                  >
                    {data.workflows.map((w) => (
                      <div
                        key={w.name}
                        style={{
                          background: "#FFFFFF",
                          borderRadius: 14,
                          border: "1px solid #E8E8ED",
                          padding: 20,
                          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a2e" }}>
                            {w.name}
                          </div>
                          <div style={{ fontSize: 12, color: "#8C8CA1", marginTop: 4 }}>
                            {w.count} éléments en cours
                          </div>
                        </div>
                        <StatusPill status={w.status} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ─── COFFRE DOCUMENTAIRE (DOCS) ────────────────── */}
              {activePanel === "docs" && (
                <div
                  style={{
                    background: "#FFFFFF",
                    borderRadius: 14,
                    border: "1px solid #E8E8ED",
                    overflow: "hidden",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  }}
                >
                  <div
                    style={{
                      padding: "16px 20px",
                      borderBottom: "1px solid #F0F0F5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <FileCheck style={{ width: 16, height: 16, color: current.color }} />
                      <span style={{ fontSize: 14, fontWeight: 600 }}>
                        Coffre Documentaire Sécurisé (VPS Privé)
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        color: "#059669",
                        fontWeight: 700,
                        background: "#ECFDF5",
                        padding: "3px 10px",
                        borderRadius: 10,
                      }}
                    >
                      Accès Super Admin déverrouillé
                    </span>
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid #F0F0F5", background: "#FAFAFA" }}>
                          <th
                            style={{
                              textAlign: "left",
                              padding: "12px 16px",
                              color: "#555566",
                              fontSize: 11,
                              textTransform: "uppercase",
                            }}
                          >
                            Réf.
                          </th>
                          <th
                            style={{
                              textAlign: "left",
                              padding: "12px 16px",
                              color: "#555566",
                              fontSize: 11,
                              textTransform: "uppercase",
                            }}
                          >
                            Document
                          </th>
                          <th
                            style={{
                              textAlign: "left",
                              padding: "12px 16px",
                              color: "#555566",
                              fontSize: 11,
                              textTransform: "uppercase",
                            }}
                          >
                            Responsable
                          </th>
                          <th
                            style={{
                              textAlign: "left",
                              padding: "12px 16px",
                              color: "#555566",
                              fontSize: 11,
                              textTransform: "uppercase",
                            }}
                          >
                            SLA
                          </th>
                          <th
                            style={{
                              textAlign: "left",
                              padding: "12px 16px",
                              color: "#555566",
                              fontSize: 11,
                              textTransform: "uppercase",
                            }}
                          >
                            État
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.docs.map((doc) => (
                          <tr key={doc.ref} style={{ borderBottom: "1px solid #F7F8FA" }}>
                            <td
                              style={{
                                padding: "12px 16px",
                                fontFamily: "monospace",
                                color: current.color,
                                fontWeight: 600,
                              }}
                            >
                              {doc.ref}
                            </td>
                            <td style={{ padding: "12px 16px", fontWeight: 500, color: "#333345" }}>
                              {doc.title}
                            </td>
                            <td style={{ padding: "12px 16px", color: "#8C8CA1" }}>{doc.owner}</td>
                            <td style={{ padding: "12px 16px", color: "#555566" }}>{doc.sla}</td>
                            <td style={{ padding: "12px 16px" }}>
                              <span
                                style={{
                                  background: "#F0F0F5",
                                  color: "#555566",
                                  borderRadius: 6,
                                  padding: "3px 10px",
                                  fontSize: 11,
                                  fontWeight: 500,
                                }}
                              >
                                {doc.state}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div
                    style={{
                      padding: "12px 20px",
                      borderTop: "1px solid #F0F0F5",
                      background: "#FAFAFA",
                      fontSize: 11,
                      color: "#8C8CA1",
                    }}
                  >
                    🔒 Vos fichiers stratégiques sont chiffrés en local (AES-256). Seuls les
                    collaborateurs autorisés par le Super Admin peuvent y accéder.
                  </div>
                </div>
              )}

              {/* ─── GESTION DES TÂCHES (TASKS) ─────────────────── */}
              {activePanel === "tasks" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e", margin: 0 }}>
                      Tâches Opérationnelles ({current.short})
                    </h2>
                    <button
                      onClick={() => setShowTaskForm(!showTaskForm)}
                      style={{
                        background: "#E8612D",
                        border: "none",
                        borderRadius: 8,
                        color: "white",
                        padding: "8px 16px",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <Plus style={{ width: 14, height: 14 }} />
                      Créer une Tâche
                    </button>
                  </div>

                  {showTaskForm && (
                    <form
                      onSubmit={handleCreateTask}
                      style={{
                        background: "#FFFFFF",
                        padding: 20,
                        borderRadius: 14,
                        border: "1px solid #E8E8ED",
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                      }}
                    >
                      <div style={{ fontWeight: 600, fontSize: 13 }}>Nouvelle Tâche</div>
                      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 12 }}>
                        <input
                          type="text"
                          placeholder="Intitulé de la tâche..."
                          value={newTaskTitle}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                          style={{
                            padding: "10px 14px",
                            border: "1px solid #E8E8ED",
                            borderRadius: 8,
                            fontSize: 13,
                          }}
                          required
                        />
                        <select
                          value={newTaskAssigned}
                          onChange={(e) => setNewTaskAssigned(e.target.value)}
                          style={{
                            padding: "10px 14px",
                            border: "1px solid #E8E8ED",
                            borderRadius: 8,
                            fontSize: 13,
                          }}
                        >
                          <option value="Tous">Tous</option>
                          {teamMembers.map((m) => (
                            <option key={m.id} value={m.name}>
                              {m.name}
                            </option>
                          ))}
                          <option value="Agent Relance Auto">Agent Relance Auto</option>
                        </select>
                        <select
                          value={newTaskPriority}
                          onChange={(e: any) => setNewTaskPriority(e.target.value)}
                          style={{
                            padding: "10px 14px",
                            border: "1px solid #E8E8ED",
                            borderRadius: 8,
                            fontSize: 13,
                          }}
                        >
                          <option value="high">Urgent</option>
                          <option value="medium">Normal</option>
                          <option value="low">Faible</option>
                        </select>
                      </div>
                      <button
                        type="submit"
                        style={{
                          alignSelf: "flex-end",
                          background: "#1a1a2e",
                          border: "none",
                          color: "white",
                          padding: "8px 16px",
                          borderRadius: 8,
                          fontSize: 12,
                          cursor: "pointer",
                        }}
                      >
                        Ajouter la Tâche
                      </button>
                    </form>
                  )}

                  <div
                    style={{
                      background: "#FFFFFF",
                      borderRadius: 14,
                      border: "1px solid #E8E8ED",
                      overflow: "hidden",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    }}
                  >
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                        <thead>
                          <tr style={{ borderBottom: "1px solid #F0F0F5", background: "#FAFAFA" }}>
                            <th
                              style={{
                                textAlign: "left",
                                padding: "12px 16px",
                                color: "#555566",
                                fontSize: 11,
                              }}
                            >
                              Tâche
                            </th>
                            <th
                              style={{
                                textAlign: "left",
                                padding: "12px 16px",
                                color: "#555566",
                                fontSize: 11,
                              }}
                            >
                              Assigné à
                            </th>
                            <th
                              style={{
                                textAlign: "left",
                                padding: "12px 16px",
                                color: "#555566",
                                fontSize: 11,
                              }}
                            >
                              Échéance
                            </th>
                            <th
                              style={{
                                textAlign: "left",
                                padding: "12px 16px",
                                color: "#555566",
                                fontSize: 11,
                              }}
                            >
                              Priorité
                            </th>
                            <th
                              style={{
                                textAlign: "left",
                                padding: "12px 16px",
                                color: "#555566",
                                fontSize: 11,
                              }}
                            >
                              Statut
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {tasks.map((task) => (
                            <tr key={task.id} style={{ borderBottom: "1px solid #F7F8FA" }}>
                              <td style={{ padding: "12px 16px", fontWeight: 500 }}>
                                {task.title}
                              </td>
                              <td style={{ padding: "12px 16px", color: "#555566" }}>
                                {task.assignedTo}
                              </td>
                              <td style={{ padding: "12px 16px", color: "#8C8CA1" }}>
                                {task.dueDate}
                              </td>
                              <td style={{ padding: "12px 16px" }}>
                                <PriorityPill priority={task.priority} />
                              </td>
                              <td style={{ padding: "12px 16px" }}>
                                <span
                                  style={{
                                    background: task.status === "done" ? "#ECFDF5" : "#FEF3C7",
                                    color: task.status === "done" ? "#059669" : "#D97706",
                                    borderRadius: 6,
                                    padding: "3px 10px",
                                    fontSize: 11,
                                    fontWeight: 500,
                                  }}
                                >
                                  {task.status === "done" ? "Terminé" : "En cours"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ─── FINANCES & RH (FINANCE-RH) ────────────────── */}
              {activePanel === "finance-rh" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  {/* Financial Stats */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                    {[
                      {
                        label: "Chiffre d'Affaires",
                        value: data.revenue,
                        color: current.color,
                        icon: DollarSign,
                      },
                      {
                        label: "Dépenses & Fournisseurs",
                        value: data.expenses,
                        color: "#DC2626",
                        icon: Briefcase,
                      },
                      {
                        label: "Marge brute moyenne",
                        value: data.margin,
                        color: "#059669",
                        icon: BarChart3,
                      },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        style={{
                          background: "#FFFFFF",
                          borderRadius: 14,
                          border: "1px solid #E8E8ED",
                          padding: 20,
                          display: "flex",
                          alignItems: "center",
                          gap: 14,
                          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                        }}
                      >
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 10,
                            background: `${stat.color}10`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <stat.icon style={{ width: 20, height: 20, color: stat.color }} />
                        </div>
                        <div>
                          <div style={{ fontSize: 22, fontWeight: 800, color: stat.color }}>
                            {stat.value}
                          </div>
                          <div style={{ fontSize: 12, color: "#8C8CA1", marginTop: 2 }}>
                            {stat.label}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* RH Section & Team Access Swtiches */}
                  <div
                    style={{
                      background: "#FFFFFF",
                      borderRadius: 14,
                      border: "1px solid #E8E8ED",
                      overflow: "hidden",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    }}
                  >
                    <div
                      style={{
                        padding: "16px 20px",
                        borderBottom: "1px solid #F0F0F5",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Users style={{ width: 16, height: 16, color: current.color }} />
                        <span style={{ fontSize: 14, fontWeight: 600 }}>
                          Ressources Humaines & Contrôle des Accès (SEC / Super Admin)
                        </span>
                      </div>
                      <button
                        onClick={() => setShowInviteForm(!showInviteForm)}
                        style={{
                          background: "#1a1a2e",
                          border: "none",
                          borderRadius: 6,
                          color: "white",
                          padding: "6px 12px",
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        + Inviter un collaborateur
                      </button>
                    </div>

                    {showInviteForm && (
                      <form
                        onSubmit={handleInviteMember}
                        style={{
                          padding: 20,
                          borderBottom: "1px solid #F0F0F5",
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr 1fr auto",
                          gap: 12,
                          background: "#FAFAFA",
                        }}
                      >
                        <input
                          type="text"
                          placeholder="Nom complet..."
                          value={inviteName}
                          onChange={(e) => setInviteName(e.target.value)}
                          style={{
                            padding: "8px 12px",
                            border: "1px solid #E8E8ED",
                            borderRadius: 8,
                            fontSize: 12,
                          }}
                          required
                        />
                        <input
                          type="text"
                          placeholder="Rôle/Poste..."
                          value={inviteRole}
                          onChange={(e) => setInviteRole(e.target.value)}
                          style={{
                            padding: "8px 12px",
                            border: "1px solid #E8E8ED",
                            borderRadius: 8,
                            fontSize: 12,
                          }}
                          required
                        />
                        <input
                          type="email"
                          placeholder="Adresse email..."
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          style={{
                            padding: "8px 12px",
                            border: "1px solid #E8E8ED",
                            borderRadius: 8,
                            fontSize: 12,
                          }}
                        />
                        <button
                          type="submit"
                          style={{
                            background: "#E8612D",
                            border: "none",
                            color: "white",
                            padding: "8px 16px",
                            borderRadius: 8,
                            fontSize: 12,
                            cursor: "pointer",
                          }}
                        >
                          Inviter
                        </button>
                      </form>
                    )}

                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                        <thead>
                          <tr style={{ borderBottom: "1px solid #F0F0F5", background: "#FAFAFA" }}>
                            <th
                              style={{
                                textAlign: "left",
                                padding: "12px 16px",
                                color: "#555566",
                                fontSize: 11,
                              }}
                            >
                              Collaborateur
                            </th>
                            <th
                              style={{
                                textAlign: "left",
                                padding: "12px 16px",
                                color: "#555566",
                                fontSize: 11,
                              }}
                            >
                              Poste
                            </th>
                            <th
                              style={{
                                textAlign: "center",
                                padding: "12px 16px",
                                color: "#555566",
                                fontSize: 11,
                              }}
                            >
                              Accès Vins
                            </th>
                            <th
                              style={{
                                textAlign: "center",
                                padding: "12px 16px",
                                color: "#555566",
                                fontSize: 11,
                              }}
                            >
                              Accès Genesis
                            </th>
                            <th
                              style={{
                                textAlign: "center",
                                padding: "12px 16px",
                                color: "#555566",
                                fontSize: 11,
                              }}
                            >
                              Accès Quincaillerie
                            </th>
                            <th
                              style={{
                                textAlign: "center",
                                padding: "12px 16px",
                                color: "#555566",
                                fontSize: 11,
                              }}
                            >
                              Accès Com & Mkt
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {teamMembers.map((member) => (
                            <tr key={member.id} style={{ borderBottom: "1px solid #F7F8FA" }}>
                              <td style={{ padding: "12px 16px" }}>
                                <div style={{ fontWeight: 600 }}>{member.name}</div>
                                <div style={{ fontSize: 11, color: "#8C8CA1" }}>{member.email}</div>
                              </td>
                              <td style={{ padding: "12px 16px", color: "#555566" }}>
                                {member.role}
                              </td>
                              {/* Swtich button simulating "donner ou enlever l'accès" */}
                              {["vin", "genesis", "quincaillerie", "commarketing"].map((divId) => {
                                const hasAccess = member.access[divId as DivisionId];
                                return (
                                  <td
                                    key={divId}
                                    style={{ textAlign: "center", padding: "12px 16px" }}
                                  >
                                    <button
                                      type="button"
                                      onClick={() => toggleAccess(member.id, divId as DivisionId)}
                                      style={{
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        color: hasAccess ? "#059669" : "#C0C0D0",
                                      }}
                                      title={hasAccess ? "Enlever l'accès" : "Donner l'accès"}
                                    >
                                      {hasAccess ? (
                                        <ToggleRight style={{ width: 36, height: 22 }} />
                                      ) : (
                                        <ToggleLeft style={{ width: 36, height: 22 }} />
                                      )}
                                    </button>
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ─── GESTION DES AGENTS IA (AGENTS) ──────────────── */}
              {activePanel === "agents" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  {/* Warning SEC controls IA */}
                  <div
                    style={{
                      background: "linear-gradient(135deg, #FEF2EC, #FFF7ED)",
                      border: "1px solid #E8612D30",
                      borderRadius: 14,
                      padding: "16px 20px",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <Shield style={{ width: 22, height: 22, color: "#E8612D", flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: "#333345" }}>
                      🛡️ **Console de Supervision SEC** : En tant que Secrétaire Général (SEC) ou
                      Super Admin, vous avez le contrôle exclusif de la création, du paramétrage des
                      compétences (skills) et du déploiement des agents IA de toutes les filiales de
                      Bridgesat.
                    </span>
                  </div>

                  {/* Deploy & Create AI Agents */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>
                      Agents IA Actifs dans Bridges OS
                    </h3>
                    <button
                      onClick={() => setShowAgentForm(!showAgentForm)}
                      style={{
                        background: "#E8612D",
                        border: "none",
                        borderRadius: 8,
                        color: "white",
                        padding: "8px 16px",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      + Configurer un nouvel Agent IA
                    </button>
                  </div>

                  {showAgentForm && (
                    <form
                      onSubmit={handleCreateAgent}
                      style={{
                        background: "#FFFFFF",
                        padding: 20,
                        borderRadius: 14,
                        border: "1px solid #E8E8ED",
                        display: "flex",
                        flexDirection: "column",
                        gap: 14,
                      }}
                    >
                      <div style={{ fontWeight: 600, fontSize: 13 }}>Nouvel Agent Intelligent</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <input
                          type="text"
                          placeholder="Nom de l'agent... (ex: Agent Inventaire)"
                          value={newAgentName}
                          onChange={(e) => setNewAgentName(e.target.value)}
                          style={{
                            padding: "10px 14px",
                            border: "1px solid #E8E8ED",
                            borderRadius: 8,
                            fontSize: 13,
                          }}
                          required
                        />
                        <input
                          type="text"
                          placeholder="Mission/Rôle... (ex: Analyser les stocks bar)"
                          value={newAgentRole}
                          onChange={(e) => setNewAgentRole(e.target.value)}
                          style={{
                            padding: "10px 14px",
                            border: "1px solid #E8E8ED",
                            borderRadius: 8,
                            fontSize: 13,
                          }}
                        />
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <div style={{ fontSize: 11, color: "#8C8CA1", fontWeight: 600 }}>
                          Associer des compétences de la Forge IA (Skills) :
                        </div>
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                          {[
                            "Alerte stocks bas",
                            "Calculateur de Marge",
                            "Relance Email Auto",
                            "WhatsApp Direct",
                            "Validation comptable",
                          ].map((skill) => {
                            const isSelected = selectedSkills.includes(skill);
                            return (
                              <button
                                key={skill}
                                type="button"
                                onClick={() =>
                                  setSelectedSkills(
                                    isSelected
                                      ? selectedSkills.filter((s) => s !== skill)
                                      : [...selectedSkills, skill],
                                  )
                                }
                                style={{
                                  background: isSelected ? "#FEF2EC" : "#F7F8FA",
                                  border: `1px solid ${isSelected ? "#E8612D" : "#E8E8ED"}`,
                                  color: isSelected ? "#E8612D" : "#555566",
                                  padding: "6px 12px",
                                  borderRadius: 8,
                                  fontSize: 11,
                                  cursor: "pointer",
                                }}
                              >
                                {skill}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr auto",
                          gap: 12,
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <label
                            style={{
                              fontSize: 12,
                              fontWeight: 500,
                              color: "#555566",
                              marginRight: 8,
                            }}
                          >
                            Déployer sur le compte utilisateur :
                          </label>
                          <select
                            value={deployUser}
                            onChange={(e) => setDeployUser(e.target.value)}
                            style={{
                              padding: "8px 12px",
                              border: "1px solid #E8E8ED",
                              borderRadius: 8,
                              fontSize: 12,
                            }}
                          >
                            {teamMembers.map((m) => (
                              <option key={m.id} value={m.name}>
                                {m.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <button
                          type="submit"
                          style={{
                            background: "#1a1a2e",
                            border: "none",
                            color: "white",
                            padding: "8px 16px",
                            borderRadius: 8,
                            fontSize: 12,
                            cursor: "pointer",
                          }}
                        >
                          Créer et Déployer
                        </button>
                      </div>
                    </form>
                  )}

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                      gap: 16,
                    }}
                  >
                    {aiAgents.map((agent) => (
                      <div
                        key={agent.id}
                        style={{
                          background: "#FFFFFF",
                          borderRadius: 14,
                          border: "1px solid #E8E8ED",
                          padding: 20,
                          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                          display: "flex",
                          flexDirection: "column",
                          gap: 14,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                          }}
                        >
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <Bot style={{ width: 18, height: 18, color: "#E8612D" }} />
                              <span style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e" }}>
                                {agent.name}
                              </span>
                            </div>
                            <div style={{ fontSize: 12, color: "#8C8CA1", marginTop: 2 }}>
                              {agent.role}
                            </div>
                          </div>
                          <span
                            style={{
                              background: "#ECFDF5",
                              color: "#059669",
                              fontSize: 10,
                              fontWeight: 700,
                              padding: "2px 8px",
                              borderRadius: 10,
                            }}
                          >
                            Actif
                          </span>
                        </div>

                        <div>
                          <div
                            style={{
                              fontSize: 11,
                              color: "#8C8CA1",
                              fontWeight: 600,
                              marginBottom: 6,
                            }}
                          >
                            Skills actifs :
                          </div>
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                            {agent.skills.map((skill) => (
                              <span
                                key={skill}
                                style={{
                                  background: "#F0F0F5",
                                  color: "#555566",
                                  fontSize: 10,
                                  padding: "3px 8px",
                                  borderRadius: 6,
                                }}
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingTop: 12,
                            borderTop: "1px solid #F0F0F5",
                            fontSize: 11,
                          }}
                        >
                          <div>
                            <strong style={{ color: "#555566" }}>Tokens consommés :</strong>{" "}
                            {(agent.tokensUsed / 1000).toFixed(0)}k tkn (Local VPS: 0.00$)
                          </div>
                          <div style={{ color: "#E8612D", fontWeight: 600 }}>
                            Compte : {agent.deployedTo}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ─── PROSPECTION & RELANCES (RELANCES) ──────────── */}
              {activePanel === "relances" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {/* Prospect stats */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                    {[
                      {
                        label: "Total contacts",
                        value: relanceStats.total,
                        color: current.color,
                        icon: RefreshCcw,
                      },
                      {
                        label: "Urgent/En retard",
                        value: relanceStats.overdue,
                        color: "#DC2626",
                        icon: AlertTriangle,
                      },
                      {
                        label: "En attente",
                        value: relanceStats.pending,
                        color: "#D97706",
                        icon: Clock,
                      },
                      {
                        label: "Actions envoyées",
                        value: relanceStats.sent,
                        color: "#059669",
                        icon: CheckCircle2,
                      },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        style={{
                          background: "#FFFFFF",
                          borderRadius: 14,
                          border: "1px solid #E8E8ED",
                          padding: "16px 20px",
                          display: "flex",
                          alignItems: "center",
                          gap: 14,
                          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                        }}
                      >
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 10,
                            background: `${stat.color}10`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <stat.icon style={{ width: 18, height: 18, color: stat.color }} />
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: 24,
                              fontWeight: 800,
                              color: stat.color,
                              lineHeight: 1.1,
                            }}
                          >
                            {stat.value}
                          </div>
                          <div style={{ fontSize: 12, color: "#8C8CA1", marginTop: 2 }}>
                            {stat.label}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Prospect/Associate/Collab Form */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>
                      Outil de Prospection & Relance
                    </h3>
                    <button
                      onClick={() => setShowProspectForm(!showProspectForm)}
                      style={{
                        background: "#E8612D",
                        border: "none",
                        borderRadius: 8,
                        color: "white",
                        padding: "8px 16px",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      + Ajouter un Prospect / Associé / Collaborateur
                    </button>
                  </div>

                  {showProspectForm && (
                    <form
                      onSubmit={handleAddProspect}
                      style={{
                        background: "#FFFFFF",
                        padding: 20,
                        borderRadius: 14,
                        border: "1px solid #E8E8ED",
                        display: "flex",
                        flexDirection: "column",
                        gap: 14,
                      }}
                    >
                      <div style={{ fontWeight: 600, fontSize: 13 }}>
                        Nouveau Contact dans le Pipeline
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
                          gap: 12,
                        }}
                      >
                        <input
                          type="text"
                          placeholder="Nom ou Raison Sociale..."
                          value={newProspectName}
                          onChange={(e) => setNewProspectName(e.target.value)}
                          style={{
                            padding: "10px 14px",
                            border: "1px solid #E8E8ED",
                            borderRadius: 8,
                            fontSize: 13,
                          }}
                          required
                        />
                        <select
                          value={newProspectType}
                          onChange={(e: any) => setNewProspectType(e.target.value)}
                          style={{
                            padding: "10px 14px",
                            border: "1px solid #E8E8ED",
                            borderRadius: 8,
                            fontSize: 13,
                          }}
                        >
                          <option value="client">Client potentiel</option>
                          <option value="associé">Associé</option>
                          <option value="collaborateur">Collaborateur</option>
                        </select>
                        <input
                          type="email"
                          placeholder="Email (facultatif)..."
                          value={newProspectEmail}
                          onChange={(e) => setNewProspectEmail(e.target.value)}
                          style={{
                            padding: "10px 14px",
                            border: "1px solid #E8E8ED",
                            borderRadius: 8,
                            fontSize: 13,
                          }}
                        />
                        <input
                          type="text"
                          placeholder="Téléphone (facultatif)..."
                          value={newProspectPhone}
                          onChange={(e) => setNewProspectPhone(e.target.value)}
                          style={{
                            padding: "10px 14px",
                            border: "1px solid #E8E8ED",
                            borderRadius: 8,
                            fontSize: 13,
                          }}
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Sujet de relance / Dossier en cours (ex: Facture CPJ35)..."
                        value={newProspectSubject}
                        onChange={(e) => setNewProspectSubject(e.target.value)}
                        style={{
                          padding: "10px 14px",
                          border: "1px solid #E8E8ED",
                          borderRadius: 8,
                          fontSize: 13,
                        }}
                      />
                      <button
                        type="submit"
                        style={{
                          alignSelf: "flex-end",
                          background: "#1a1a2e",
                          border: "none",
                          color: "white",
                          padding: "8px 20px",
                          borderRadius: 8,
                          fontSize: 12,
                          cursor: "pointer",
                        }}
                      >
                        Intégrer au Pipeline
                      </button>
                    </form>
                  )}

                  {/* Relance Table */}
                  <div
                    style={{
                      background: "#FFFFFF",
                      borderRadius: 14,
                      border: "1px solid #E8E8ED",
                      overflow: "hidden",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    }}
                  >
                    <div
                      style={{
                        padding: "16px 20px",
                        borderBottom: "1px solid #F0F0F5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ fontSize: 14, fontWeight: 600 }}>
                        Pipeline des Relances & Contacts
                      </span>
                      <span style={{ fontSize: 11, color: "#059669", fontWeight: 600 }}>
                        Agent de relance IA actif
                      </span>
                    </div>

                    {relances.map((r, i) => (
                      <div
                        key={r.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 16,
                          padding: "16px 20px",
                          borderBottom: "1px solid #F7F8FA",
                        }}
                      >
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            background:
                              r.status === "overdue"
                                ? "#FEE2E2"
                                : r.status === "pending"
                                  ? "#FEF3C7"
                                  : "#ECFDF5",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <ChannelIcon channel={r.channel} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e" }}>
                              {r.client}
                            </span>
                            <span
                              style={{
                                fontSize: 10,
                                background:
                                  r.type === "associé"
                                    ? "#FEF2EC"
                                    : r.type === "collaborateur"
                                      ? "#E0F2FE"
                                      : "#F3F4F6",
                                color:
                                  r.type === "associé"
                                    ? "#E8612D"
                                    : r.type === "collaborateur"
                                      ? "#0284C7"
                                      : "#555566",
                                padding: "1px 6px",
                                borderRadius: 10,
                                fontWeight: 600,
                              }}
                            >
                              {r.type}
                            </span>
                          </div>
                          <div style={{ fontSize: 12, color: "#8C8CA1", marginTop: 2 }}>
                            {r.subject}
                          </div>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0, minWidth: 140 }}>
                          <div style={{ fontSize: 11, color: "#A0A0B0" }}>{r.lastContact}</div>
                          <div
                            style={{
                              fontSize: 11,
                              color: "#555566",
                              marginTop: 2,
                              fontWeight: 500,
                            }}
                          >
                            {r.nextAction}
                          </div>
                        </div>
                        <div
                          style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 8 }}
                        >
                          <PriorityPill priority={r.priority} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ─── FIL D'ACTIVITÉ (ACTIVITY) ──────────────────── */}
              {activePanel === "activity" && (
                <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 20 }}>
                  <div
                    style={{
                      background: "#FFFFFF",
                      borderRadius: 14,
                      border: "1px solid #E8E8ED",
                      overflow: "hidden",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    }}
                  >
                    <div
                      style={{
                        padding: "16px 20px",
                        borderBottom: "1px solid #F0F0F5",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <Activity style={{ width: 16, height: 16, color: current.color }} />
                      <span style={{ fontSize: 14, fontWeight: 600 }}>
                        Fil d'activité unifié (Bridges OS)
                      </span>
                    </div>
                    {data.activity.map((row, i) => (
                      <div
                        key={row.time}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 12,
                          padding: "14px 20px",
                          borderBottom: "1px solid #F7F8FA",
                        }}
                      >
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            background: `${current.color}10`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 11,
                            fontWeight: 700,
                            color: current.color,
                            flexShrink: 0,
                            marginTop: 2,
                          }}
                        >
                          {row.avatar}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e" }}>
                              {row.actor}
                            </span>
                            <span style={{ fontSize: 11, color: "#A0A0B0" }}>{row.time}</span>
                          </div>
                          <div style={{ fontSize: 12, color: "#555566", marginTop: 4 }}>
                            {row.action}
                          </div>
                        </div>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            padding: "3px 10px",
                            borderRadius: 6,
                            background:
                              row.status === "OK" ||
                              row.status === "Prêt" ||
                              row.status === "Validé"
                                ? "#ECFDF5"
                                : "#FEE2E2",
                            color:
                              row.status === "OK" ||
                              row.status === "Prêt" ||
                              row.status === "Validé"
                                ? "#059669"
                                : "#DC2626",
                          }}
                        >
                          {row.status}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Security Panel */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div
                      style={{
                        background: "#FFFFFF",
                        borderRadius: 14,
                        border: "1px solid #E8E8ED",
                        padding: 20,
                        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                      }}
                    >
                      <div
                        style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}
                      >
                        <Shield style={{ width: 16, height: 16, color: "#059669" }} />
                        <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1a2e" }}>
                          Sécurité & Rôles SEC
                        </span>
                      </div>
                      {[
                        {
                          title: "Contrôle d'Accès SEC",
                          desc: "Le SEC supervise le réseau d'agents et les droits individuels",
                        },
                        {
                          title: "Chiffrement local AES-256",
                          desc: "Tous les documents restent chiffrés sur votre VPS",
                        },
                        {
                          title: "Isolation des filiales",
                          desc: "Un caissier n'a aucun accès aux modules RH ou Finance",
                        },
                      ].map((item) => (
                        <div
                          key={item.title}
                          style={{
                            display: "flex",
                            gap: 12,
                            padding: "10px 0",
                            borderBottom: "1px solid #F7F8FA",
                          }}
                        >
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: 8,
                              background: "#ECFDF5",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <Lock style={{ width: 14, height: 14, color: "#059669" }} />
                          </div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e" }}>
                              {item.title}
                            </div>
                            <div style={{ fontSize: 11, color: "#8C8CA1", marginTop: 2 }}>
                              {item.desc}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Footer */}
          <div
            style={{
              marginTop: 32,
              paddingTop: 16,
              borderTop: "1px solid #E8E8ED",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: 11,
              color: "#A0A0B0",
            }}
          >
            <span>Bridgesat OS — Maquette de démonstration commerciale Super Admin</span>
            <span>Opays Tech · Cabinet d'Ingénierie de l'Efficience</span>
          </div>
        </main>
      </div>
    </div>
  );
}
