import { clsx } from "clsx";

export function Card({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={clsx("rounded-2xl border border-quantum-border bg-quantum-card/80 p-5 shadow-premium", className)}>
      {children}
    </section>
  );
}
