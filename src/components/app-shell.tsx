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
    <main className="min-h-screen bg-[#020817]/40">
      <TopNavigation active={active} plan={plan} title={title} />
      <div className="mx-auto grid max-w-[1600px] gap-4 px-3 py-4 sm:px-4 xl:grid-cols-[170px_1fr]">
        <SideNavigation active={active} />
        <div className="min-w-0 space-y-4">{children}</div>
      </div>
    </main>
  );
}
