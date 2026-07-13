import { SideNavigation, TopNavigation } from "@/components/top-navigation";

export function AppShell({
  title,
  active,
  plan = "Free",
  children
}: {
  title: string;
  active: string;
  plan?: "Free" | "Premium";
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen">
      <TopNavigation active={active} plan={plan} title={title} />
      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:px-8 xl:grid-cols-[220px_1fr]">
        <SideNavigation active={active} />
        <div className="min-w-0 space-y-5">{children}</div>
      </div>
    </main>
  );
}
