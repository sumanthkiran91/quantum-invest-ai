"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Bell,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Crown,
  HelpCircle,
  Info,
  LineChart,
  Lock,
  Newspaper,
  PlayCircle,
  Plus,
  Sparkles,
  TrendingDown,
  TrendingUp
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { DemoNotice } from "@/components/demo-notice";
import { allInvestments, type Investment } from "@/lib/market-data";
import { planStorageKey, sessionStorageKey, type LocalSession } from "@/lib/auth";
import {
  generateScenarios,
  getAiInsight,
  getChartPoints,
  getConfidence,
  getKeyData,
  getMarketStatusLabel,
  getRelatedInvestments,
  getRiskScore,
  timeRanges,
  type InvestorMode,
  type ScenarioTerm,
  type TimeRange
} from "@/lib/investment-details";

function formatCurrency(value: number) {
  if (value >= 1000) return `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
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

function DemoChart({ asset, range }: { asset: Investment; range: TimeRange }) {
  const points = getChartPoints(asset, range);
  const min = Math.min(...points);
  const max = Math.max(...points);
  const rangeSize = Math.max(1, max - min);
  const polyline = points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * 560;
      const y = 220 - ((point - min) / rangeSize) * 180;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg aria-label={`${asset.symbol} ${range} demonstration chart`} className="h-52 w-full" role="img" viewBox="0 0 580 240">
      <defs>
        <linearGradient id={`chart-${asset.symbol}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={asset.movement >= 0 ? "#22C55E" : "#EF4444"} stopOpacity="0.28" />
          <stop offset="100%" stopColor="#050814" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[40, 85, 130, 175, 220].map((y) => (
        <line key={y} stroke="rgba(148,163,184,0.14)" strokeWidth="1" x1="0" x2="560" y1={y} y2={y} />
      ))}
      <polygon fill={`url(#chart-${asset.symbol})`} points={`0,230 ${polyline} 560,230`} />
      <polyline fill="none" points={polyline} stroke={asset.movement >= 0 ? "#22C55E" : "#EF4444"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
      <circle cx="560" cy={polyline.split(" ").at(-1)?.split(",")[1] ?? 120} fill="#F8FAFC" r="5" />
    </svg>
  );
}

function Tooltip({ text }: { text: string }) {
  return (
    <span className="inline-flex" title={text}>
      <HelpCircle className="h-4 w-4 text-sky-200" />
    </span>
  );
}

function ScenarioCard({ title, children }: { title: ScenarioTerm; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-white/10 bg-slate-950/35 p-3">
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <div className="mt-3 space-y-3">{children}</div>
    </div>
  );
}

export function InvestmentDetailsDashboard({ asset }: { asset: Investment }) {
  const [range, setRange] = useState<TimeRange>("1M");
  const [amount, setAmount] = useState(20);
  const [mode, setMode] = useState<InvestorMode>("Beginner");
  const [plan, setPlan] = useState<"Free" | "Premium">("Free");
  const [watchlistNotice, setWatchlistNotice] = useState("");

  useEffect(() => {
    const syncPlan = () => {
      const storedPlan = window.localStorage.getItem(planStorageKey);
      const rawSession = window.localStorage.getItem(sessionStorageKey);
      const session = rawSession ? (JSON.parse(rawSession) as LocalSession) : null;
      setPlan(storedPlan === "Premium" || session?.plan === "Premium" ? "Premium" : "Free");
    };
    syncPlan();
    window.addEventListener("quantum-auth-change", syncPlan);
    window.addEventListener("storage", syncPlan);
    return () => {
      window.removeEventListener("quantum-auth-change", syncPlan);
      window.removeEventListener("storage", syncPlan);
    };
  }, []);

  const aiInsight = getAiInsight(asset);
  const scenarios = useMemo(() => generateScenarios(asset, amount), [amount, asset]);
  const confidence = getConfidence(asset);
  const risk = getRiskScore(asset);
  const related = getRelatedInvestments(asset, allInvestments);

  function addToWatchlist() {
    const raw = window.localStorage.getItem("quantum-invest-ai-watchlist");
    const current = raw ? (JSON.parse(raw) as string[]) : [];
    const next = current.includes(asset.symbol) ? current : [...current, asset.symbol];
    window.localStorage.setItem("quantum-invest-ai-watchlist", JSON.stringify(next));
    setWatchlistNotice(`${asset.symbol} saved to your demo watchlist.`);
  }

  return (
    <AppShell active="Dashboard" plan={plan} title="Investment Details">
      <Link className="inline-flex items-center gap-2 text-sm text-sky-200 hover:text-sky-100" href="/">
        <ArrowLeft className="h-4 w-4" /> Back to Global Dashboard
      </Link>
      <DemoNotice />

      <Card className="border-sky-300/20 bg-slate-950/35">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <div className="grid h-14 w-14 flex-none place-items-center rounded-lg border border-sky-300/25 bg-sky-300/10 text-xl font-bold text-sky-100">
              {asset.symbol.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold text-white">{asset.name}</h1>
                <Badge tone="neutral">{asset.symbol}</Badge>
              </div>
              <p className="mt-1 text-sm text-slate-400">{asset.region} · {asset.market} · {asset.type}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge tone={asset.movement >= 0 ? "positive" : "negative"}>{getMarketStatusLabel(asset)}</Badge>
                <Badge tone="ai">Demo risk {risk}/10</Badge>
              </div>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:min-w-96">
            <div className="rounded-lg border border-white/10 bg-[#071326] p-3">
              <p className="text-xs text-slate-400">Current demo price</p>
              <p className="mt-1 text-xl font-bold text-white">{formatCurrency(asset.demoPrice)}</p>
              <p className="mt-1 text-sm"><Movement value={asset.movement} /> today</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-[#071326] p-3">
              <p className="text-xs text-slate-400">Prototype actions</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Button onClick={addToWatchlist}><Plus className="mr-2 h-4 w-4" /> Watchlist</Button>
                <Button variant="secondary"><PlayCircle className="mr-2 h-4 w-4" /> Practice</Button>
              </div>
            </div>
          </div>
        </div>
        {watchlistNotice ? <p className="mt-4 rounded-xl border border-sky-300/20 bg-sky-300/10 p-3 text-sm text-sky-100">{watchlistNotice}</p> : null}
      </Card>

      <div className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <Card>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Demonstration Trend</h2>
              <p className="mt-1 text-sm text-slate-400">Interactive educational chart using mock historical behaviour.</p>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {timeRanges.map((item) => (
                <button
                  className={`rounded-md border px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-300 ${
                    range === item ? "border-sky-300/60 bg-sky-300/15 text-sky-100" : "border-white/10 bg-slate-950 text-slate-300"
                  }`}
                  key={item}
                  onClick={() => setRange(item)}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4 rounded-lg border border-white/10 bg-[#071326] p-3">
            <DemoChart asset={asset} range={range} />
          </div>
        </Card>

        <Card className="border-violet-300/20 bg-violet-500/10">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-violet-200" />
            <h2 className="text-xl font-bold text-white">AI Insight</h2>
          </div>
          <div className="mt-4 space-y-3 text-sm leading-6 text-slate-200">
            <p><strong className="text-white">What happened:</strong> {aiInsight.whatHappened}</p>
            <p><strong className="text-white">Possible reasons:</strong> {aiInsight.possibleReasons}</p>
            <p><strong className="text-white">Relevant news:</strong> {aiInsight.relevantNews}</p>
            <p><strong className="text-white">Monitor:</strong> {aiInsight.monitor}</p>
          </div>
          <div className="mt-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-300">Demo confidence</span>
              <span className="font-semibold text-white">{confidence}%</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-slate-900">
              <div className="h-2 rounded-full bg-violet-300" style={{ width: `${confidence}%` }} />
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-400">No guaranteed buy or sell instruction is provided.</p>
        </Card>
      </div>

      <Card>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">Investment Scenario Planner</h2>
              <Tooltip text="These figures are educational estimates based on demonstration historical data, market conditions and news assumptions. They are not guaranteed predictions or financial advice." />
            </div>
            <p className="mt-1 text-sm text-slate-400">Enter a small amount to compare possible educational outcomes.</p>
          </div>
          <label className="grid gap-1 text-sm font-semibold text-slate-300 lg:w-60">
            Demonstration amount
            <input
              className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-300/20"
              min="1"
              onChange={(event) => setAmount(Number(event.target.value))}
              type="number"
              value={amount}
            />
          </label>
        </div>
        <div className="mt-4 grid gap-3 xl:grid-cols-3">
          {(["Short Term", "Medium Term", "Long Term"] as ScenarioTerm[]).map((term) => (
            <ScenarioCard key={term} title={term}>
              {scenarios.filter((scenario) => scenario.term === term).map((scenario) => {
                const positive = scenario.profitLoss >= 0;
                return (
                  <div className="rounded-lg border border-white/10 bg-[#071326] p-3" key={`${scenario.term}-${scenario.strength}`}>
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-semibold text-white">{scenario.strength}</p>
                      {positive ? <TrendingUp className="h-4 w-4 text-emerald-300" /> : <TrendingDown className="h-4 w-4 text-red-300" />}
                    </div>
                    <p className="mt-2 text-xl font-bold text-white">{formatCurrency(scenario.finalValue)}</p>
                    <p className={positive ? "text-sm text-emerald-300" : "text-sm text-red-300"}>
                      {positive ? "+" : ""}{formatCurrency(scenario.profitLoss)} · {positive ? "+" : ""}{scenario.percentageChange}%
                    </p>
                    <p className="mt-2 text-xs leading-5 text-slate-400">{scenario.explanation}</p>
                  </div>
                );
              })}
            </ScenarioCard>
          ))}
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <section className="grid gap-5 md:grid-cols-2">
          <Card>
            <div className="flex items-center gap-3"><Newspaper className="h-5 w-5 text-sky-300" /><h2 className="text-lg font-semibold text-white">Relevant News and Alerts</h2></div>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li>Demo alert: {asset.industry} sentiment changed after global market rotation.</li>
              <li>Demo news: {asset.symbol} is being watched for follow-through after today&apos;s move.</li>
              <li>Demo reminder: alerts are delayed for Free users.</li>
            </ul>
          </Card>
          <Card>
            <div className="flex items-center gap-3"><Info className="h-5 w-5 text-sky-300" /><h2 className="text-lg font-semibold text-white">Key Data</h2></div>
            <div className="mt-4 grid gap-2">
              {getKeyData(asset).map((item) => (
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/35 px-3 py-2 text-sm" key={item.label}>
                  <span className="text-slate-400">{item.label}</span>
                  <span className="font-semibold text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3"><CalendarDays className="h-5 w-5 text-sky-300" /><h2 className="text-lg font-semibold text-white">Upcoming Events</h2></div>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li>Next demo earnings or market update window.</li>
              <li>Sector data refresh for {asset.industry}.</li>
              <li>Practice portfolio review checkpoint.</li>
            </ul>
          </Card>
          <Card>
            <div className="flex items-center gap-3"><LineChart className="h-5 w-5 text-sky-300" /><h2 className="text-lg font-semibold text-white">Related Investments</h2></div>
            <div className="mt-4 space-y-2">
              {related.map((item) => (
                <Link className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/35 px-3 py-2 text-sm hover:border-sky-300/40" href={`/investments/${encodeURIComponent(item.symbol)}`} key={item.symbol}>
                  <span className="font-semibold text-white">{item.symbol}</span>
                  <Movement value={item.movement} />
                </Link>
              ))}
            </div>
          </Card>
        </section>

        <aside className="space-y-4">
          <Card>
            <div className="flex items-center gap-3"><BookOpen className="h-5 w-5 text-sky-300" /><h2 className="text-lg font-semibold text-white">{mode} Mode</h2></div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {(["Beginner", "Expert"] as InvestorMode[]).map((item) => (
                <button className={`rounded-xl border px-3 py-2 text-sm font-semibold ${mode === item ? "border-sky-300/50 bg-sky-300/15 text-sky-100" : "border-white/10 bg-slate-950 text-slate-300"}`} key={item} onClick={() => setMode(item)} type="button">
                  {item}
                </button>
              ))}
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              {mode === "Beginner"
                ? "Plain English view: focus on what changed, why it may matter and what to monitor next. Tooltip terms explain concepts without jargon."
                : `Expert view: demo risk ${risk}/10, confidence ${confidence}%, ${asset.type} exposure, sector momentum and scenario dispersion.`}
            </p>
          </Card>
          <Card className="border-violet-300/20 bg-violet-500/10">
            <div className="flex items-center gap-3"><BriefcaseBusiness className="h-5 w-5 text-violet-200" /><h2 className="text-lg font-semibold text-white">Broker Comparison Preview</h2></div>
            <p className="mt-3 text-sm leading-6 text-slate-300">Premium can compare demonstration broker fees, learning tools and asset access. No real broker connection is active.</p>
          </Card>
          <Card>
            <div className="flex items-center gap-3"><Bell className="h-5 w-5 text-sky-300" /><h2 className="text-lg font-semibold text-white">Free and Premium States</h2></div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {(["Free", "Premium"] as const).map((item) => (
                <button className={`rounded-xl border px-3 py-2 text-sm font-semibold ${plan === item ? "border-violet-300/50 bg-violet-500/20 text-violet-100" : "border-white/10 bg-slate-950 text-slate-300"}`} key={item} onClick={() => setPlan(item)} type="button">
                  {item}
                </button>
              ))}
            </div>
            <div className="mt-4 space-y-2 text-sm text-slate-300">
              <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-300" /> Watchlist and practice actions available.</p>
              <p className="flex items-center gap-2">{plan === "Premium" ? <Crown className="h-4 w-4 text-violet-200" /> : <Lock className="h-4 w-4 text-slate-500" />} Full Smart Alerts and broker comparison {plan === "Premium" ? "unlocked" : "locked"}.</p>
            </div>
          </Card>
        </aside>
      </div>
    </AppShell>
  );
}


