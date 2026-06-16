import { Link } from "@tanstack/react-router";

/**
 * Écran neutre de repli affiché lorsqu'un accès non autorisé atteint une
 * Page_Prototype malgré le contrôle principal (`beforeLoad`). Il ne divulgue
 * aucune donnée du prototype et renvoie vers la page publique d'accueil
 * (protection complémentaire — Requirement 10.6).
 */
export function PrototypeUnavailable() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center text-foreground">
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Opays Tech</p>
      <h1 className="text-2xl font-semibold tracking-tight">Page non disponible</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        Cet espace est réservé à un usage interne et n'est pas accessible publiquement.
      </p>
      <Link
        to="/"
        className="rounded-full border border-border/60 px-5 py-2 text-sm font-medium hover:bg-muted"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}
