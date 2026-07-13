import { clsx } from "clsx";

type BadgeTone = "neutral" | "ai" | "premium" | "positive" | "negative";

const tones: Record<BadgeTone, string> = {
  neutral: "border-slate-500/25 bg-slate-900/70 text-slate-200",
  ai: "border-sky-400/30 bg-sky-400/10 text-sky-200",
  premium: "border-violet-400/35 bg-violet-500/15 text-violet-100",
  positive: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  negative: "border-red-400/30 bg-red-400/10 text-red-200"
};

export function Badge({
  children,
  tone = "neutral"
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
}) {
  return (
    <span className={clsx("inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold", tones[tone])}>
      {children}
    </span>
  );
}
