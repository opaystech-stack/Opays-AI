import { motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";
import { SectionHeader } from "./Approche";
import { getHqApiUrl } from "@/lib/api-hq";

export function Contact() {
  const [loading, setLoading] = useState(false);
  // Consentement RGPD explicite : la soumission n'est autorisée qu'une fois
  // donné (Requirements 9.3, 9.4).
  const [consent, setConsent] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 9.4 — sans consentement, on empêche l'envoi et on informe le Visiteur.
    if (!consent) {
      toast.info(
        "Merci de cocher la case de consentement pour que nous puissions traiter votre demande.",
      );
      return;
    }

    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(getHqApiUrl('/contacts'), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("Demande envoyée — nous vous recontactons sous 24h.");
        (e.target as HTMLFormElement).reset();
        setConsent(false);
      } else {
        toast.error("Erreur lors de l'envoi. Veuillez réessayer.");
      }
    } catch (error) {
      toast.error("Un problème est survenu. Réessayez plus tard.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-28 relative">
      <div className="mx-auto max-w-6xl px-6 grid lg:grid-cols-2 gap-12 items-start">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 mb-6">
            <MessageSquare size={20} className="text-[color:var(--neon-cyan)]" aria-hidden="true" />
          </div>
          <SectionHeader eyebrow="Contact" title="Parlons de vos enjeux techniques." />
          <p className="mt-6 text-muted-foreground leading-relaxed">
            Que vous ayez un projet défini ou besoin d'une expertise stratégique pour structurer
            votre vision, nous sommes là pour vous accompagner. Discutons de vos objectifs.
          </p>
        </motion.div>

        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="rounded-2xl glass p-8 space-y-5 shadow-[var(--shadow-glow)]"
        >
          <Field label="Nom de l'entreprise" name="company" placeholder="Acme Corp" />
          <Field label="Votre rôle" name="role" placeholder="Directeur / Manager / Fondateur" />

          <Field
            label="Votre besoin ou projet"
            name="process"
            placeholder="Décrivez brièvement vos attentes..."
            textarea
          />
          <Field
            label="Email ou téléphone"
            name="contact"
            placeholder="vous@entreprise.com"
            type="email"
          />

          {/* Champ_Honeypot anti-spam : masqué visuellement, hors tabulation et
              invisible des lecteurs d'écran, mais soumis avec le formulaire pour
              que le serveur le lise via isHoneypotTriggered (Requirement 3.1). */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "-9999px",
              width: "1px",
              height: "1px",
              overflow: "hidden",
            }}
          >
            <label htmlFor="website">Ne pas remplir ce champ</label>
            <input
              id="website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              defaultValue=""
            />
          </div>

          {/* Consentement RGPD + finalité du traitement + lien confidentialité,
              à proximité du bouton d'envoi (Requirements 9.1, 9.2, 9.3). */}
          <label className="flex items-start gap-3 text-xs leading-relaxed text-muted-foreground">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-[color:var(--neon-cyan)] focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <span>
              J'accepte que mes données soient utilisées pour traiter ma demande et me recontacter.
              Elles ne sont jamais cédées à des tiers. Voir notre{" "}
              <Link
                to="/confidentialite"
                className="text-[color:var(--neon-cyan)] underline underline-offset-2 hover:opacity-80"
              >
                politique de confidentialité
              </Link>
              .
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-neon)] hover:shadow-[var(--shadow-glow)] hover:scale-[1.01] transition-all disabled:opacity-60"
          >
            {loading ? (
              "Envoi..."
            ) : (
              <>
                Envoyer la demande <Send size={16} />
              </>
            )}
          </button>
        </motion.form>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  placeholder,
  type = "text",
  textarea,
}: {
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
  textarea?: boolean;
}) {
  const cls =
    "w-full rounded-lg border border-border bg-background/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all";
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2 block">
        {label}
      </span>
      {textarea ? (
        <textarea name={name} placeholder={placeholder} rows={3} className={cls} required />
      ) : (
        <input name={name} type={type} placeholder={placeholder} className={cls} required />
      )}
    </label>
  );
}
