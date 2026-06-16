import { useCallback, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AlertCircle, ArrowRight } from "lucide-react";
import { resolveCta } from "@/content/rules/cta";
import { cn } from "@/lib/utils";

/**
 * CtaDiagnostic — bouton d'appel à l'action unique du Site_Vitrine.
 *
 * Le libellé et la cible proviennent exclusivement de `resolveCta()`, lui-même
 * adossé à la constante unique `CTA_DIAGNOSTIC`. Toute occurrence du CTA dans le
 * site rend donc un libellé strictement identique (texte et casse) et dirige
 * vers la Page_Contact (`/contact`).
 *
 * Gestion d'erreur (Requirement 10.4) : si la Page_Contact est indisponible au
 * moment de l'activation, le composant affiche un message d'indisponibilité,
 * maintient le Visiteur sur la page courante et préserve son contexte de
 * navigation (aucune redirection, aucune perte d'état).
 *
 * Couvre : Requirements 10.1, 10.2, 10.4, 10.5.
 */

type CtaVariant = "primary" | "secondary";
type CtaSize = "sm" | "md" | "lg";

export interface CtaDiagnosticProps {
  /** Apparence : primaire (gradient néon) ou secondaire (glass). */
  variant?: CtaVariant;
  /** Taille du bouton. */
  size?: CtaSize;
  /** Affiche la flèche directionnelle (par défaut : true). */
  showIcon?: boolean;
  /** Occupe toute la largeur disponible. */
  fullWidth?: boolean;
  /** Classes utilitaires additionnelles. */
  className?: string;
}

const SIZE_CLASSES: Record<CtaSize, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

const VARIANT_CLASSES: Record<CtaVariant, string> = {
  primary:
    "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-[var(--shadow-neon)] hover:shadow-[var(--shadow-glow)] hover:scale-[1.02]",
  secondary: "glass text-foreground hover:border-primary/50",
};

const UNAVAILABLE_MESSAGE =
  "La prise de rendez-vous est momentanément indisponible. Merci de réessayer dans un instant.";

export function CtaDiagnostic({
  variant = "primary",
  size = "md",
  showIcon = true,
  fullWidth = false,
  className,
}: CtaDiagnosticProps) {
  const navigate = useNavigate();
  const { label, target } = resolveCta();
  const [unavailable, setUnavailable] = useState(false);
  const [pending, setPending] = useState(false);

  const handleClick = useCallback(async () => {
    if (pending) return;
    setUnavailable(false);
    setPending(true);
    try {
      // Navigation côté client vers la Page_Contact. En cas d'échec (cible
      // indisponible ou non chargée), on reste sur la page courante.
      await navigate({ to: target });
    } catch {
      // Contexte de navigation préservé : aucune redirection, on signale
      // simplement l'indisponibilité au Visiteur.
      setUnavailable(true);
    } finally {
      setPending(false);
    }
  }, [navigate, target, pending]);

  return (
    <div className={cn("inline-flex flex-col gap-2", fullWidth && "w-full")}>
      <motion.button
        type="button"
        onClick={handleClick}
        whileTap={{ scale: 0.98 }}
        aria-busy={pending}
        aria-describedby={unavailable ? "cta-diagnostic-error" : undefined}
        className={cn(
          "group inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-70",
          SIZE_CLASSES[size],
          VARIANT_CLASSES[variant],
          fullWidth && "w-full",
          className,
        )}
      >
        {label}
        {showIcon && (
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        )}
      </motion.button>

      {unavailable && (
        <p
          id="cta-diagnostic-error"
          role="alert"
          className="inline-flex items-start gap-2 text-xs font-medium text-[color:var(--destructive,#f87171)]"
        >
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          <span>{UNAVAILABLE_MESSAGE}</span>
        </p>
      )}
    </div>
  );
}
