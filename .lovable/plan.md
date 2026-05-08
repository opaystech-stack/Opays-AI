## Site One-Page Opays Tech — Premium Dark Mode

Construction d'une landing page sombre et moderne pour Opays Tech, avec navigation fixe, hero animé en mode terminal, et toutes les sections du Figma.

### 1. Design System (src/styles.css)
- Passer le site en **dark mode permanent** (classe `dark` sur `<html>` via __root.tsx).
- Palette néon premium :
  - `--background` : noir profond (oklch ~0.15)
  - `--primary` : bleu néon (#3B82F6 / oklch équivalent)
  - `--accent` : cyan néon (#22D3EE)
  - Tokens additionnels : `--neon-glow`, `--terminal-bg`, `--gradient-hero`, `--shadow-neon`, `--glass-bg` (verre dépoli).
- Polices : **Metropolis** (titres), **Inter** (body), **JetBrains Mono** (terminal) — chargées via Google Fonts dans `__root.tsx`.

### 2. Assets
- Copier `user-uploads://icone_logo_Opays.png` → `src/assets/opays-icon.png`
- Copier `user-uploads://logo_Opays.png` → `src/assets/opays-logo.png`

### 3. Structure (one-page, src/routes/index.tsx)
Page unique composée de sections avec ancres internes (cas d'usage one-page explicite du brief) :

- **`<Navbar />`** — fixe, fine, transparente avec backdrop-blur
  - Logo (icône) + "OPAYS TECH" à gauche
  - Menu centré : Approche · Solutions · Pourquoi nous · Contact (smooth scroll)
  - Bouton **"Audit gratuit"** style verre dépoli + halo néon
  - Tout sur une ligne, alignement vertical centré

- **`<Hero />`** — split 2 colonnes
  - Gauche : badge "Architecture IA & Automatisation", H1 "L'IA utile.", sous-titre, 2 CTA
  - Droite : **`<TerminalAnimation />`** (composant clé)

- **`<Approche />`** — 4 étapes numérotées (01 → 04) en grille avec scroll reveal

- **`<Solutions />`** — 3 cartes (Traitement intelligent, Assistants, Automatisation) avec icônes Lucide et hover glow

- **`<PourquoiNous />`** — 4 blocs argumentaires

- **`<Contact />`** — formulaire (entreprise, rôle, processus, contact) en glass card + bouton "Demander un audit"

- **`<Footer />`** — logo, liens, copyright

### 4. Animation Terminal (composant phare)
`src/components/TerminalAnimation.tsx` :
- Fenêtre style macOS (3 dots rouge/jaune/vert + titre `opays-tech-terminal`)
- Effet **typewriter** ligne par ligne avec `useEffect` + `setTimeout` :
  ```
  > Initializing workspace environment...
  > Loading organizational data patterns...
  > [OK] Patterns recognized. Identifying friction points.
  > Compiling automation modules...
  > [OK] Modules ready.
  > _opays / build / deploy
  ```
- Curseur clignotant `|` pendant la frappe
- Phase "scan" : barre de progression animée
- Bandeau final : `SUCCESS / DEPLOYED` + métriques (SYS_LOAD 24%, MEM_ALLOC OPTIMAL, NET_LATENCY 12ms)
- Couleurs alternées : prompt cyan, OK vert néon, texte blanc cassé, accents bleus
- Boucle après ~8s pour démo continue

### 5. Animations & Interactions
- **framer-motion** (à installer via `bun add framer-motion`) pour :
  - Fade-up au scroll sur chaque section (`whileInView`)
  - Stagger sur les listes de cartes
  - Hover : scale léger + halo néon sur cartes/boutons
- Smooth scroll natif (`scroll-behavior: smooth` + `scroll-margin-top` sur les sections pour compenser la navbar fixe)
- Boutons "Audit gratuit" / CTA : transition glow au hover

### 6. SEO
- `head()` dans index.tsx : title "Opays Tech — L'IA utile pour des entreprises qui veulent travailler mieux", description, og:title, og:description.

### Détails techniques
- Composants dans `src/components/` : `Navbar.tsx`, `Hero.tsx`, `TerminalAnimation.tsx`, `Approche.tsx`, `Solutions.tsx`, `PourquoiNous.tsx`, `Contact.tsx`, `Footer.tsx`.
- Tous les styles via tokens sémantiques (aucune couleur hardcodée dans les composants).
- Icônes via `lucide-react` (FileText, MessageSquare, GitBranch, etc.).
- Le formulaire est purement front (pas de backend demandé) — soumission affichera un toast via sonner.
