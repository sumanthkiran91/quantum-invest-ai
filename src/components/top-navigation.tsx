"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bell, BrainCircuit, ChartNoAxesCombined, FileText, LogOut, Search, UserRound, WalletCards, Zap } from "lucide-react";
import { Badge } from "@/components/badge";
import { planStorageKey, sessionStorageKey, type AccountPlan, type LocalSession } from "@/lib/auth";

const navItems = [
  { label: "Dashboard", href: "/", icon: ChartNoAxesCombined },
  { label: "AI Discover", href: "/ai-discover", icon: BrainCircuit },
  { label: "Smart Alerts", href: "/smart-alerts", icon: Zap },
  { label: "Practice Invest", href: "/practice-invest", icon: WalletCards },
  { label: "Compare Brokers", href: "/compare-brokers", icon: Search },
  { label: "AI Daily Report", href: "/ai-daily-report", icon: FileText },
  { label: "Watchlist", href: "/watchlist", icon: WalletCards }
];

function readSession() {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(sessionStorageKey);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as LocalSession;
  } catch {
    return null;
  }
}

export function TopNavigation({
  title = "Global Dashboard",
  plan = "Free",
  active = "Dashboard"
}: {
  title?: string;
  plan?: AccountPlan;
  active?: string;
}) {
  const [session, setSession] = useState<LocalSession | null>(null);
  const [currentPlan, setCurrentPlan] = useState<AccountPlan>(plan);

  useEffect(() => {
    const sync = () => {
      const nextSession = readSession();
      setSession(nextSession);
      const storedPlan = window.localStorage.getItem(planStorageKey);
      setCurrentPlan(storedPlan === "Premium" || nextSession?.plan === "Premium" ? "Premium" : "Free");
    };
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("quantum-auth-change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("quantum-auth-change", sync);
    };
  }, [plan]);

  function changePlan(nextPlan: AccountPlan) {
    setCurrentPlan(nextPlan);
    const nextSession = session ? { ...session, plan: nextPlan } : null;
    if (nextSession) {
      window.localStorage.setItem(sessionStorageKey, JSON.stringify(nextSession));
      setSession(nextSession);
    }
    window.localStorage.setItem(planStorageKey, nextPlan);
    window.dispatchEvent(new Event("quantum-auth-change"));
  }

  function logout() {
    window.localStorage.removeItem(sessionStorageKey);
    window.localStorage.setItem(planStorageKey, "Free");
    setSession(null);
    setCurrentPlan("Free");
    window.dispatchEvent(new Event("quantum-auth-change"));
  }

  return (
    <header className="sticky top-0 z-20 border-b border-quantum-border bg-quantum-ink/88 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-200">Quantum Invest AI</p>
            <h1 className="text-xl font-bold text-white">{title}</h1>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Badge tone={currentPlan === "Premium" ? "premium" : "neutral"}>{currentPlan} account</Badge>
            <label className="sr-only" htmlFor="developer-plan-switcher">Developer account switcher</label>
            <select
              className="rounded-full border border-quantum-border bg-slate-950/70 px-3 py-2 text-xs font-semibold text-slate-200 outline-none focus:ring-2 focus:ring-sky-300"
              id="developer-plan-switcher"
              onChange={(event) => changePlan(event.target.value as AccountPlan)}
              value={currentPlan}
            >
              <option value="Free">Free view</option>
              <option value="Premium">Premium view</option>
            </select>
            <Link className="rounded-full border border-violet-300/30 bg-violet-500/15 px-3 py-2 text-xs font-semibold text-violet-100 hover:bg-violet-500/25" href="/upgrade">Upgrade demo</Link>
            <button aria-label="Global search" className="rounded-full border border-quantum-border p-2 text-slate-200 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-300">
              <Search className="h-4 w-4" />
            </button>
            <button aria-label="Notifications" className="rounded-full border border-quantum-border p-2 text-slate-200 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-300">
              <Bell className="h-4 w-4" />
            </button>
            {session ? (
              <button aria-label="Logout" className="rounded-full border border-quantum-border p-2 text-slate-200 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-300" onClick={logout} type="button" title={`Logout ${session.email}`}>
                <LogOut className="h-4 w-4" />
              </button>
            ) : (
              <Link aria-label="Login" className="rounded-full border border-quantum-border p-2 text-slate-200 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-300" href="/login">
                <UserRound className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
        <nav aria-label="Primary navigation" className="flex gap-2 overflow-x-auto pb-1">
          {navItems.slice(0, 6).map((item) => (
            <Link
              className={`whitespace-nowrap rounded-full border px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-sky-300 ${
                item.label === active
                  ? "border-sky-300/50 bg-sky-300/15 text-sky-100"
                  : "border-quantum-border bg-slate-950/40 text-slate-300 hover:border-sky-300/30 hover:text-white"
              }`}
              href={item.href}
              key={item.label}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function SideNavigation({ active = "Dashboard" }: { active?: string }) {
  return (
    <aside className="hidden xl:block">
      <nav aria-label="Side navigation" className="sticky top-32 space-y-2 rounded-2xl border border-quantum-border bg-quantum-card/70 p-3 shadow-premium">
        {navItems.map((item) => {
          const Icon = item.icon;
          const selected = item.label === active;
          return (
            <Link
              className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition focus:outline-none focus:ring-2 focus:ring-sky-300 ${
                selected
                  ? "border-sky-300/45 bg-sky-300/15 text-sky-100"
                  : "border-transparent text-slate-300 hover:border-white/10 hover:bg-slate-900/70 hover:text-white"
              }`}
              href={item.href}
              key={item.label}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
