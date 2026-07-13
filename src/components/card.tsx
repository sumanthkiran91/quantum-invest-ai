import { clsx } from "clsx";

export function Card({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={clsx("rounded-lg border border-sky-300/10 bg-[#07162c]/88 p-4 shadow-[0_18px_45px_rgba(0,0,0,0.28)]", className)}>
      {children}
    </section>
  );
}
