import { ExternalLink as ExternalLinkIcon } from "lucide-react";
import type { ReactNode } from "react";
import type { ExternalProject } from "@/content/externalProjects";
import { resolveExternalLink } from "@/content/rules/externalLinks";

interface ExternalLinkProps {
  /** Chantier_Externe à lier ; aucun lien n'est rendu tant que son URL est invalide. */
  project: ExternalProject;
  /** Contenu personnalisé du lien ; à défaut, le libellé du chantier est utilisé. */
  children?: ReactNode;
  /** Classes supplémentaires appliquées au lien. */
  className?: string;
}

/**
 * Lien sortant vers un Chantier_Externe.
 *
 * Le rendu délègue la décision d'affichage au noyau pur `resolveExternalLink` :
 * aucun lien n'est produit tant que l'URL du chantier n'est pas renseignée et
 * valide (Requirement 13.4). Lorsqu'il est visible, le lien s'ouvre dans un
 * nouvel onglet (`target="_blank"`) avec `rel="noopener noreferrer"` et signale
 * visuellement qu'il s'agit d'un lien externe via une icône dédiée doublée d'un
 * libellé accessible (Requirement 13.3).
 */
export function ExternalLink({ project, children, className }: ExternalLinkProps) {
  const resolved = resolveExternalLink(project);

  if (!resolved.visible) {
    return null;
  }

  const baseClasses =
    "inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors";

  return (
    <a
      href={resolved.url}
      target="_blank"
      rel="noopener noreferrer"
      className={className ? `${baseClasses} ${className}` : baseClasses}
    >
      <span>{children ?? resolved.label}</span>
      <ExternalLinkIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span className="sr-only">(ouvre un nouvel onglet — lien externe)</span>
    </a>
  );
}
