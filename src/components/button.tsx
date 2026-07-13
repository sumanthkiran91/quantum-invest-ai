import { clsx } from "clsx";

type ButtonVariant = "primary" | "secondary";

const variants: Record<ButtonVariant, string> = {
  primary: "border-sky-300/40 bg-sky-400 text-slate-950 hover:bg-sky-300",
  secondary: "border-slate-600/50 bg-slate-900/60 text-slate-100 hover:bg-slate-800"
};

export function Button({
  children,
  className,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
}) {
  return (
    <button
      className={clsx(
        "inline-flex min-h-9 items-center justify-center rounded-lg border px-3 text-xs font-semibold shadow-sm transition focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 focus:ring-offset-quantum-ink disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
