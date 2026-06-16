import { motion } from "framer-motion";
import { SectionHeader } from "./Approche";
import type { TeamMember } from "../content/team";
import { FOUNDERS } from "../content/team";
import { selectRenderableMembers } from "../content/rules/team";

/**
 * Section_Equipe — fondateurs nommés et leurs rôles.
 *
 * Consomme la sélection pure `selectRenderableMembers(FOUNDERS)` : seules les
 * fiches disposant d'un nom non vide et d'au moins un rôle non vide sont
 * rendues (pas de champ vide).
 *
 * Identité visuelle : glass, néon, animations framer-motion, avec lisibilité
 * prioritaire sur les effets décoratifs.
 *
 * Couvre : Requirements 7.1, 7.6, 11.1, 11.2, 11.3.
 */
export function TeamSection() {
  const members = selectRenderableMembers(FOUNDERS);

  // Aucune fiche complète : on n'affiche pas la section plutôt que des champs vides.
  if (members.length === 0) {
    return null;
  }

  return (
    <section id="equipe" className="py-28 relative">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="L'équipe fondatrice"
          title="Les personnes derrière Opays Tech."
          subtitle="Une équipe nommée et engagée, du terrain à la recherche."
        />

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((member, i) => (
            <MemberCard key={member.fullName} member={member} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/** Initiales du membre, pour un repère visuel sobre et lisible. */
function initials(fullName: string): string {
  return fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function MemberCard({ member, index }: { member: TeamMember; index: number }) {
  const roles = member.roles.filter((role) => role.trim().length > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative flex flex-col rounded-2xl glass p-6 hover:border-primary/40 hover:-translate-y-1 transition-all"
    >
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-primary/20 bg-primary/10 font-mono text-lg font-semibold text-[color:var(--neon-cyan)]">
        {initials(member.fullName)}
      </div>

      {/* Message clé lisible : nom complet. */}
      <h3 className="text-lg font-semibold text-foreground">{member.fullName}</h3>

      <ul className="mt-3 flex flex-wrap gap-2">
        {roles.map((role) => (
          <li
            key={role}
            className="rounded-full border border-border/60 bg-card/60 px-3 py-1 text-xs text-muted-foreground"
          >
            {role}
          </li>
        ))}
      </ul>

      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity group-hover:opacity-100"
        style={{ boxShadow: "var(--shadow-neon)" }}
      />
    </motion.div>
  );
}
