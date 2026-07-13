"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Bell,
  BrainCircuit,
  Briefcase,
  ChartNoAxesCombined,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Search,
  Settings,
  ShieldCheck,
  Star,
  UserRound,
  WalletCards
} from "lucide-react";
import { Badge } from "@/components/badge";
import { planStorageKey, sessionStorageKey, type AccountPlan, type LocalSession } from "@/lib/auth";

const topItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "AI Discover", href: "/ai-discover", icon: BrainCircuit },
  { label: "Smart Alerts", href: "/smart-alerts", icon: Bell },
  { label: "Practice Invest", href: "/practice-invest", icon: WalletCards },
  { label: "Compare Brokers", href: "/compare-brokers", icon: Briefcase },
  { label: "AI Daily Report", href: "/ai-daily-report", icon: FileText }
];

const sideItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Watchlist", href: "/watchlist", icon: Star },
  { label: "Portfolio", href: "/portfolio", icon: ChartNoAxesCombined },
  { label: "Discover", href: "/ai-discover", icon: BrainCircuit },
  { label: "Alerts", href: "/smart-alerts", icon: Bell },
  { label: "Reports", href: "/ai-daily-report", icon: FileText },
  { label: "Brokers", href: "/compare-brokers", icon: Briefcase },
  { label: "Learning Center", href: "/practice-invest", icon: GraduationCap },
  { label: "Settings", href: "/upgrade", icon: Settings }
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
    <header className="sticky top-0 z-20 border-b border-sky-300/10 bg-[#020817]/95 backdrop-blur-xl">
      <span className="sr-only">{title}</span>
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-3 px-3 py-2 sm:px-4 xl:grid-cols-[170px_1fr] xl:items-center">
        <Link className="flex items-center gap-2" href="/">
          <span className="grid h-9 w-9 place-items-center rounded-lg border border-sky-300/25 bg-gradient-to-br from-sky-400/25 to-violet-500/25">
            <ShieldCheck className="h-5 w-5 text-sky-200" />
          </span>
          <span>
            <span className="block text-sm font-bold leading-4 text-white">Quantum Invest AI</span>
            <span className="block text-[10px] text-slate-400">AI-Powered Investment Intelligence</span>
          </span>
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <nav aria-label="Primary navigation" className="flex gap-1 overflow-x-auto pb-1 xl:pb-0">
            {topItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  className={`flex min-w-fit items-center gap-1.5 rounded-md border px-2.5 py-2 text-[11px] transition focus:outline-none focus:ring-2 focus:ring-sky-300 ${
                    item.label === active
                      ? "border-indigo-400/45 bg-indigo-500/20 text-white shadow-[inset_0_-2px_0_rgba(99,102,241,0.9)]"
                      : "border-transparent text-slate-300 hover:bg-slate-900/80 hover:text-white"
                  }`}
                  href={item.href}
                  key={item.label}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex min-w-0 flex-1 items-center justify-end gap-2 xl:flex-none">
            <label className="relative hidden w-72 lg:block">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                aria-label="Search stocks, crypto and ETFs"
                className="h-9 w-full rounded-lg border border-white/10 bg-[#071326] pl-9 pr-3 text-xs text-slate-200 outline-none placeholder:text-slate-500 focus:border-sky-300/50"
                placeholder="Search stocks, crypto, ETFs..."
              />
            </label>
            <select
              className="h-9 rounded-lg border border-white/10 bg-[#071326] px-2 text-[11px] font-semibold text-slate-200 outline-none focus:ring-2 focus:ring-sky-300"
              onChange={(event) => changePlan(event.target.value as AccountPlan)}
              value={currentPlan}
            >
              <option value="Free">Free</option>
              <option value="Premium">Premium</option>
            </select>
            <button aria-label="Notifications" className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-[#071326] text-slate-200 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-300">
              <Bell className="h-4 w-4" />
            </button>
            {session ? (
              <button aria-label="Logout" className="flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-[#071326] px-2 text-left text-slate-200 hover:bg-slate-800" onClick={logout} title={`Logout ${session.email}`} type="button">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-amber-200 text-[10px] font-bold text-slate-950">{session.name.slice(0, 1)}</span>
                <span className="hidden leading-3 sm:block"><span className="block text-[11px] font-bold">{session.name.split(" ")[0]}</span><Badge tone={currentPlan === "Premium" ? "premium" : "neutral"}>{currentPlan}</Badge></span>
                <LogOut className="h-3.5 w-3.5" />
              </button>
            ) : (
              <Link aria-label="Login" className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-[#071326] text-slate-200 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-300" href="/login">
                <UserRound className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export function SideNavigation({ active = "Dashboard" }: { active?: string }) {
  return (
    <aside className="hidden xl:block">
      <nav aria-label="Side navigation" className="sticky top-[74px] space-y-1 rounded-lg border border-sky-300/10 bg-[#061225]/90 p-2 shadow-[0_18px_45px_rgba(0,0,0,0.28)]">
        {sideItems.map((item) => {
          const Icon = item.icon;
          const selected = item.label === active;
          return (
            <Link
              className={`flex items-center gap-2 rounded-md px-2.5 py-2 text-[12px] transition focus:outline-none focus:ring-2 focus:ring-sky-300 ${
                selected ? "bg-indigo-500/25 text-white" : "text-slate-300 hover:bg-slate-900/80 hover:text-white"
              }`}
              href={item.href}
              key={item.label}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
        <div className="mt-4 rounded-lg border border-violet-300/15 bg-violet-500/10 p-3">
          <p className="text-xs font-semibold text-violet-100">Upgrade to Premium</p>
          <ul className="mt-2 space-y-1 text-[10px] leading-4 text-slate-300">
            <li>Unlimited Watchlists</li>
            <li>Real-time Alerts</li>
            <li>Advanced AI Reports</li>
          </ul>
          <Link className="mt-3 inline-flex w-full justify-center rounded-md bg-indigo-500 px-2 py-2 text-[11px] font-bold text-white hover:bg-indigo-400" href="/upgrade">
            Upgrade Now
          </Link>
        </div>
      </nav>
    </aside>
  );
}
