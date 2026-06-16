import { useEffect, useState } from "react";

type Line = { text: string; tone?: "prompt" | "ok" | "muted" | "accent" };

const SCRIPT: Line[] = [
  { text: "> Initialisation de l'environnement Opays...", tone: "prompt" },
  { text: "> Chargement des processus opérationnels...", tone: "prompt" },
  { text: "> [OK] Frictions identifiées.", tone: "ok" },
  { text: "> Compilation des modules d'automatisation...", tone: "prompt" },
  { text: "> [OK] Modules prêts.", tone: "ok" },
  { text: "> _opays / construire / déployer", tone: "accent" },
];

const LOOP_PAUSE_MS = 10_000;
const TYPE_MS = 28;
const LINE_PAUSE_MS = 320;
const INITIAL_DELAY_MS = 400;

export function TerminalAnimation() {
  const [lines, setLines] = useState<{ text: string; tone?: Line["tone"] }[]>([]);
  const [current, setCurrent] = useState("");
  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState(false);
  const [scan, setScan] = useState(0);

  // typewriter
  useEffect(() => {
    if (idx >= SCRIPT.length) {
      const t = setTimeout(() => setDone(true), INITIAL_DELAY_MS);
      return () => clearTimeout(t);
    }
    const target = SCRIPT[idx].text;
    if (current.length < target.length) {
      const t = setTimeout(() => setCurrent(target.slice(0, current.length + 1)), TYPE_MS);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setLines((l) => [...l, { text: target, tone: SCRIPT[idx].tone }]);
      setCurrent("");
      setIdx((i) => i + 1);
    }, LINE_PAUSE_MS);
    return () => clearTimeout(t);
  }, [current, idx]);

  // scan progress
  useEffect(() => {
    if (!done) return;
    if (scan >= 100) return;
    const t = setTimeout(() => setScan((s) => Math.min(100, s + 3)), 42);
    return () => clearTimeout(t);
  }, [done, scan]);

  // loop
  useEffect(() => {
    if (scan < 100) return;
    const t = setTimeout(() => {
      setLines([]);
      setCurrent("");
      setIdx(0);
      setDone(false);
      setScan(0);
    }, LOOP_PAUSE_MS);
    return () => clearTimeout(t);
  }, [scan]);

  const toneClass = (tone?: Line["tone"]) => {
    switch (tone) {
      case "ok":
        return "text-[color:var(--success)]";
      case "accent":
        return "text-[color:var(--neon-cyan)]";
      case "muted":
        return "text-muted-foreground";
      default:
        return "text-[color:var(--terminal-foreground)]";
    }
  };

  return (
    <div className="relative">
      {/* glow */}
      <div className="absolute -inset-4 bg-[var(--gradient-hero)] blur-2xl opacity-60 -z-10" />

      <div className="rounded-2xl border border-border/60 bg-[color:var(--terminal)] shadow-[var(--shadow-glow)] overflow-hidden">
        {/* title bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-black/40">
          <span className="h-3 w-3 rounded-full bg-red-500/80" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <span className="h-3 w-3 rounded-full bg-green-500/80" />
          <span className="ml-3 font-mono text-xs text-muted-foreground">opays-tech-terminal</span>
        </div>

        {/* body */}
        <div className="font-mono text-[13px] leading-relaxed p-5 min-h-[340px]">
          {lines.map((l, i) => (
            <div key={i} className={toneClass(l.tone)}>
              {l.text}
            </div>
          ))}
          {idx < SCRIPT.length && (
            <div className={toneClass(SCRIPT[idx].tone)}>
              {current}
              <span className="inline-block w-2 h-4 align-middle bg-[color:var(--neon-cyan)] ml-0.5 animate-pulse" />
            </div>
          )}

          {done && (
            <div className="mt-4 space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>System scan</span>
                  <span>{scan}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[color:var(--neon-cyan)] to-[color:var(--neon)] transition-all"
                    style={{ width: `${scan}%` }}
                  />
                </div>
              </div>

              {scan >= 100 && (
                <div className="rounded-lg border border-[color:var(--success)]/40 bg-[color:var(--success)]/5 px-3 py-2 text-xs flex items-center justify-between animate-fade-in">
                  <span className="text-[color:var(--success)] font-semibold tracking-wider">
                    ✓ SUCCESS / DEPLOYED
                  </span>
                  <span className="text-muted-foreground">build #2486</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* metrics footer */}
        <div className="grid grid-cols-3 border-t border-border/50 bg-black/30 text-xs font-mono">
          <Metric label="SYS_LOAD" value="24%" />
          <Metric label="MEM_ALLOC" value="OPTIMAL" tone="accent" />
          <Metric label="NET_LATENCY" value="12ms" />
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, tone }: { label: string; value: string; tone?: "accent" }) {
  return (
    <div className="px-4 py-3 border-r border-border/50 last:border-r-0">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={tone === "accent" ? "text-[color:var(--neon-cyan)]" : "text-foreground"}>
        {value}
      </div>
    </div>
  );
}
