"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Activity,
  Bell,
  BriefcaseBusiness,
  CalendarClock,
  ChevronDown,
  Crown,
  Newspaper,
  PlayCircle,
  Search,
  Sparkles,
  Star,
  TrendingDown,
  TrendingUp,
  WalletCards
} from "lucide-react";
import { Badge } from "@/components/badge";
import { Card } from "@/components/card";
import { DemoNotice } from "@/components/demo-notice";
import { AppShell } from "@/components/app-shell";
import {
  aiSuggestions,
  getTopMovers,
  industries,
  marketOverview,
  newsAlerts,
  regions,
  type Industry,
  type Investment,
  type Region,
  watchlistPreview
} from "@/lib/market-data";
import { getMarketStatus, marketTimings } from "@/lib/market-timings";

const industryDescriptions: Record<Industry, string> = {
  Technology: "Software, hardware and cloud leaders",
  Healthcare: "Hospitals, devices and care networks",
  "Private Finance": "Banks, lenders and asset managers",
  "Government Finance": "Bonds and public finance funds",
  Insurance: "Life, health and property insurers",
  Cryptocurrency: "Digital assets and blockchain networks",
  "Artificial Intelligence and Robotics": "AI chips, automation and robotics",
  Energy: "Oil, gas and energy infrastructure",
  "Renewable Energy": "Solar, wind and clean power",
  Automotive: "EV, hybrid and global vehicle makers",
  Retail: "Online and store-based consumer brands",
  "Real Estate": "Property, REITs and infrastructure",
  Pharmaceuticals: "Drugmakers and treatment pipelines",
  Biotechnology: "Research-led medical innovators",
  Telecommunications: "Connectivity and network operators",
  Manufacturing: "Industrial and factory automation",
  "Defence and Aerospace": "Aerospace, security and defence",
  Commodities: "Gold, oil and diversified resources"
};

function formatCurrency(value: number) {
  if (value >= 1000) {
    return `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  }
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function Movement({ value }: { value: number }) {
  const positive = value >= 0;
  return (
    <span className={positive ? "text-emerald-300" : "text-red-300"}>
      {positive ? "+" : ""}{value.toFixed(2)}%
    </span>
  );
}

function MarketTicker() {
  return (
    <Card className="p-3">
      <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Demonstration market overview">
        {marketOverview.map((market) => (
          <div className="min-w-36 rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2" key={market.name}>
            <p className="text-xs text-slate-400">{market.name}</p>
            <div className="mt-1 flex items-center justify-between gap-3 text-sm font-semibold">
              <span className="text-white">{market.value}</span>
              <Movement value={market.movement} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function IndustryExplorer({ selected, onSelect }: { selected: Industry; onSelect: (industry: Industry) => void }) {
  return (
    <Card className="border-sky-300/20 bg-slate-950/35">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge tone="ai">Start here</Badge>
          <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">Explore Markets by Industry</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
            Choose an industry to refresh today&apos;s demonstration leaders and laggards. This helps beginners compare similar investments before opening a details page.
          </p>
        </div>
        <Badge tone="neutral">Demonstration data</Badge>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {industries.map((industry) => {
          const isSelected = industry === selected;
          return (
            <button
              aria-pressed={isSelected}
              className={`rounded-2xl border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-sky-300 ${
                isSelected
                  ? "border-sky-300/70 bg-sky-300/15 shadow-[0_0_34px_rgba(56,189,248,0.14)]"
                  : "border-white/10 bg-quantum-panel/70 hover:border-sky-300/35 hover:bg-slate-900"
              }`}
              key={industry}
              onClick={() => onSelect(industry)}
              type="button"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-sm font-semibold text-white">{industry}</span>
                {isSelected ? <Sparkles className="h-4 w-4 text-sky-200" /> : null}
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-400">{industryDescriptions[industry]}</p>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

function SelectField<T extends string>({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
}) {
  return (
    <label className="grid gap-1 text-xs font-semibold text-slate-300">
      {label}
      <span className="relative">
        <select
          className="w-full appearance-none rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 pr-9 text-sm text-white outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-300/25"
          onChange={(event) => onChange(event.target.value as T)}
          value={value}
        >
          {options.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
      </span>
    </label>
  );
}

function MoverList({ title, icon, movers }: { title: string; icon: React.ReactNode; movers: Investment[] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-3">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
        {icon}
        {title}
      </div>
      <div className="space-y-2">
        {movers.map((asset) => (
          <Link
            className="group grid grid-cols-[1fr_auto] gap-3 rounded-xl border border-white/5 bg-slate-900/70 p-3 transition hover:border-sky-300/40 hover:bg-slate-800/80 focus:outline-none focus:ring-2 focus:ring-sky-300"
            href={`/investments/${encodeURIComponent(asset.symbol)}`}
            key={asset.symbol}
          >
            <span>
              <span className="block text-sm font-semibold text-white group-hover:text-sky-100">{asset.symbol} · {asset.name}</span>
              <span className="mt-1 block text-xs text-slate-400">{asset.market} · {asset.reason}</span>
            </span>
            <span className="text-right text-sm font-semibold">
              <Movement value={asset.movement} />
              <span className="mt-1 block text-xs text-slate-400">{formatCurrency(asset.demoPrice)}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function TopMovers({ industry, region, onIndustryChange, onRegionChange }: {
  industry: Industry;
  region: Region;
  onIndustryChange: (industry: Industry) => void;
  onRegionChange: (region: Region) => void;
}) {
  const movers = useMemo(() => getTopMovers(industry, region), [industry, region]);
  return (
    <Card>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Badge tone="neutral">Updates when industry changes</Badge>
          <h2 className="mt-3 text-xl font-bold text-white">Top Movers Today</h2>
          <p className="mt-1 text-sm text-slate-400">Top 5 growing and losing investments from mock market data.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:min-w-96">
          <SelectField label="Industry" onChange={onIndustryChange} options={industries} value={industry} />
          <SelectField label="Country or region" onChange={onRegionChange} options={regions} value={region} />
        </div>
      </div>
      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <MoverList icon={<TrendingUp className="h-4 w-4 text-emerald-300" />} movers={movers.growing} title="Top 5 Growing" />
        <MoverList icon={<TrendingDown className="h-4 w-4 text-red-300" />} movers={movers.losing} title="Top 5 Losing" />
      </div>
    </Card>
  );
}

function MarketTimingsCard() {
  const [now] = useState(() => new Date());
  return (
    <Card>
      <div className="flex items-center gap-3">
        <CalendarClock className="h-5 w-5 text-sky-300" />
        <div>
          <h2 className="text-lg font-semibold text-white">Global Market Timings</h2>
          <p className="text-xs text-slate-400">Based on your browser time zone</p>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {marketTimings.map((market) => {
          const status = getMarketStatus(market, now);
          const open = status.status === "Open";
          return (
            <div className="rounded-xl border border-white/10 bg-slate-950/35 p-3" key={market.market}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-8 w-8 place-items-center rounded-full bg-slate-800 text-sm">{market.flag}</span>
                  <div>
                    <p className="text-sm font-semibold text-white">{market.country}</p>
                    <p className="text-xs text-slate-400">{market.market}</p>
                  </div>
                </div>
                <Badge tone={open ? "positive" : "negative"}>{status.status}</Badge>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-400">
                <span>User-local time</span>
                <span className="text-right text-slate-200">{status.localTime}</span>
                <span>Next opening or closing</span>
                <span className="text-right text-slate-200">{status.nextEvent}</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function InsightCard({ icon, title, children, tone = "neutral" }: { icon: React.ReactNode; title: string; children: React.ReactNode; tone?: "neutral" | "premium" | "ai" }) {
  const border = tone === "premium" ? "border-violet-300/25 bg-violet-500/10" : tone === "ai" ? "border-sky-300/25 bg-sky-400/10" : "";
  return (
    <Card className={border}>
      <div className="flex items-center gap-3">
        {icon}
        <h3 className="text-base font-semibold text-white">{title}</h3>
      </div>
      <div className="mt-3 text-sm leading-6 text-slate-300">{children}</div>
    </Card>
  );
}

function SupportingCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <InsightCard icon={<Star className="h-5 w-5 text-sky-300" />} title="My Watchlist Preview">
        <div className="flex flex-wrap gap-2">
          {watchlistPreview.map((symbol) => <Badge key={symbol} tone="neutral">{symbol}</Badge>)}
        </div>
      </InsightCard>
      <InsightCard icon={<WalletCards className="h-5 w-5 text-emerald-300" />} title="Portfolio Summary">
        Demo portfolio value <strong className="text-white">$24,680</strong>, up <span className="text-emerald-300">+1.8%</span> today.
      </InsightCard>
      <InsightCard icon={<Sparkles className="h-5 w-5 text-violet-300" />} title="AI Investment Suggestions" tone="ai">
        <ul className="space-y-2">
          {aiSuggestions.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </InsightCard>
      <InsightCard icon={<Newspaper className="h-5 w-5 text-sky-300" />} title="Market News and Alerts">
        <ul className="space-y-2">
          {newsAlerts.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </InsightCard>
      <InsightCard icon={<Activity className="h-5 w-5 text-sky-300" />} title="AI Daily Report">
        Today&apos;s demo report highlights AI, crypto and renewable energy. Premium users will see deeper commentary in a later phase.
      </InsightCard>
      <InsightCard icon={<PlayCircle className="h-5 w-5 text-emerald-300" />} title="Quick Practice Invest">
        Try a virtual $100 allocation across the selected industry before saving anything to your watchlist.
      </InsightCard>
      <InsightCard icon={<Crown className="h-5 w-5 text-violet-200" />} title="Premium Upgrade" tone="premium">
        Unlock Smart Alerts, full AI Daily Report, broker comparison and expanded scenario planning. No real payment processing in this prototype.
      </InsightCard>
      <InsightCard icon={<BriefcaseBusiness className="h-5 w-5 text-slate-300" />} title="Broker Comparison Preview">
        Compare demonstration broker features later without connecting a real brokerage account.
      </InsightCard>
      <InsightCard icon={<Bell className="h-5 w-5 text-red-300" />} title="Risk Reminders">
        Market movement can change quickly. Treat all figures here as educational demonstration data, not financial advice.
      </InsightCard>
    </div>
  );
}

export function GlobalDashboard() {
  const [industry, setIndustry] = useState<Industry>("Technology");
  const [region, setRegion] = useState<Region>("Global");

  return (
    <AppShell active="Dashboard" plan="Free" title="Global Dashboard">
        <DemoNotice />
        <MarketTicker />
        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <section className="space-y-5">
            <IndustryExplorer onSelect={setIndustry} selected={industry} />
            <TopMovers
              industry={industry}
              onIndustryChange={setIndustry}
              onRegionChange={setRegion}
              region={region}
            />
            <SupportingCards />
          </section>
          <aside className="space-y-5">
            <Card className="p-4">
              <label className="relative block">
                <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  aria-label="Global search"
                  className="w-full rounded-xl border border-white/10 bg-slate-950/70 py-2.5 pl-10 pr-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-sky-300 focus:ring-2 focus:ring-sky-300/25"
                  placeholder="Search demo assets, markets, news"
                  type="search"
                />
              </label>
            </Card>
            <MarketTimingsCard />
          </aside>
        </div>
    </AppShell>
  );
}




