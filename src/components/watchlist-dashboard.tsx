"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowDownUp,
  CheckCircle2,
  Crown,
  Filter,
  Heart,
  Loader2,
  Plus,
  Search,
  Star,
  Trash2
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { DemoNotice } from "@/components/demo-notice";
import { allInvestments, findInvestment, type Investment } from "@/lib/market-data";
import {
  canAddWatchlistItem,
  filterWatchlistAssets,
  FREE_WATCHLIST_LIMIT,
  getDemoMarketValue,
  getTrendPoints,
  type AccountPlan,
  type SortOption,
  type WatchlistTab
} from "@/lib/watchlist";

const storageKey = "quantum-invest-ai-watchlist";
const planStorageKey = "quantum-invest-ai-plan";
const defaultSymbols = ["NVDA", "BTC", "CSL"];
const tabs: WatchlistTab[] = ["All", "Shares", "Crypto", "ETFs", "Commodities", "Long-Term Picks"];
const sortOptions: { label: string; value: SortOption }[] = [
  { label: "Best movement", value: "movement-desc" },
  { label: "Weakest movement", value: "movement-asc" },
  { label: "Highest price", value: "price-desc" },
  { label: "Lowest price", value: "price-asc" },
  { label: "Symbol A-Z", value: "symbol-asc" }
];

function formatCurrency(value: number) {
  if (value >= 1000) {
    return `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  }
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function Movement({ value }: { value: number }) {
  const positive = value >= 0;
  return <span className={positive ? "text-emerald-300" : "text-red-300"}>{positive ? "+" : ""}{value.toFixed(2)}%</span>;
}

function TrendLine({ asset }: { asset: Investment }) {
  const points = getTrendPoints(asset);
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = Math.max(1, max - min);
  const polyline = points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * 96;
      const y = 34 - ((point - min) / range) * 28;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg aria-label={`${asset.symbol} seven day demo trend`} className="h-10 w-28" role="img" viewBox="0 0 96 40">
      <polyline fill="none" points={polyline} stroke={asset.movement >= 0 ? "#22C55E" : "#EF4444"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
    </svg>
  );
}

function readStoredSymbols() {
  const raw = window.localStorage.getItem(storageKey);
  if (!raw) return defaultSymbols;
  const parsed = JSON.parse(raw) as unknown;
  if (!Array.isArray(parsed) || !parsed.every((item) => typeof item === "string")) {
    throw new Error("Saved watchlist data could not be read.");
  }
  return parsed.filter((symbol) => Boolean(findInvestment(symbol)));
}

export function WatchlistDashboard() {
  const [plan, setPlan] = useState<AccountPlan>("Free");
  const [symbols, setSymbols] = useState<string[]>(defaultSymbols);
  const [tab, setTab] = useState<WatchlistTab>("All");
  const [query, setQuery] = useState("");
  const [market, setMarket] = useState("All markets");
  const [sort, setSort] = useState<SortOption>("movement-desc");
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const storedPlan = window.localStorage.getItem(planStorageKey);
        if (storedPlan === "Free" || storedPlan === "Premium") {
          setPlan(storedPlan);
        }
        setSymbols(readStoredSymbols());
        setStatus("ready");
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "The saved watchlist could not be loaded.");
        setStatus("error");
      }
    }, 350);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (status === "ready") {
      window.localStorage.setItem(storageKey, JSON.stringify(symbols));
      window.localStorage.setItem(planStorageKey, plan);
    }
  }, [plan, status, symbols]);

  const selectedAssets = useMemo(
    () => symbols.map((symbol) => findInvestment(symbol)).filter((asset): asset is Investment => Boolean(asset)),
    [symbols]
  );

  const markets = useMemo(
    () => ["All markets", ...Array.from(new Set(selectedAssets.map((asset) => asset.market))).sort()],
    [selectedAssets]
  );

  const visibleAssets = useMemo(
    () => filterWatchlistAssets({ assets: selectedAssets, tab, query, market, sort }),
    [market, query, selectedAssets, sort, tab]
  );

  const availableAssets = allInvestments.filter((asset) => !symbols.includes(asset.symbol)).slice(0, 10);
  const isFreeLimitReached = plan === "Free" && symbols.length >= FREE_WATCHLIST_LIMIT;

  function changePlan(nextPlan: AccountPlan) {
    setPlan(nextPlan);
    setNotice(nextPlan === "Premium" ? "Premium testing view enabled: unlimited watchlist items." : "Free testing view enabled: maximum five saved items.");
  }

  function addSymbol(symbol: string) {
    if (symbols.includes(symbol)) return;
    if (!canAddWatchlistItem(plan, symbols.length)) {
      setNotice("Free users can save up to five watchlist items. Switch to Premium to test unlimited saving.");
      return;
    }
    setSymbols((current) => [...current, symbol]);
    setNotice(`${symbol} added to your demo watchlist.`);
  }

  function removeSymbol(symbol: string) {
    setSymbols((current) => current.filter((item) => item !== symbol));
    setNotice(`${symbol} removed from your demo watchlist.`);
  }

  function resetStorage() {
    window.localStorage.removeItem(storageKey);
    setSymbols([]);
    setNotice("Watchlist cleared. This shows the empty state.");
  }

  function restoreDefaults() {
    setSymbols(defaultSymbols);
    setStatus("ready");
    setErrorMessage("");
    setNotice("Demo watchlist restored.");
  }

  return (
    <AppShell active="Watchlist" plan={plan} title="Watchlist Dashboard">
      <DemoNotice />

      <Card className="border-sky-300/20 bg-slate-950/35">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <Badge tone="ai">Saved demo investments only</Badge>
            <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">My Watchlist</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              Track the investments you choose to save. Prices, values, alerts and trends are realistic demonstration data only.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-3">
            <p className="mb-2 text-xs font-semibold text-slate-300">Developer account switcher</p>
            <div className="grid grid-cols-2 gap-2">
              {(["Free", "Premium"] as AccountPlan[]).map((item) => (
                <button
                  className={`rounded-xl border px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-sky-300 ${
                    plan === item
                      ? item === "Premium"
                        ? "border-violet-300/50 bg-violet-500/20 text-violet-100"
                        : "border-sky-300/50 bg-sky-300/15 text-sky-100"
                      : "border-white/10 bg-slate-900 text-slate-300 hover:text-white"
                  }`}
                  key={item}
                  onClick={() => changePlan(item)}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-slate-400">
              {plan === "Free" ? `${symbols.length}/${FREE_WATCHLIST_LIMIT} saved` : `${symbols.length} saved, unlimited testing`}
            </p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
            <p className="text-xs text-slate-400">Watchlist items</p>
            <p className="mt-1 text-2xl font-bold text-white">{symbols.length}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
            <p className="text-xs text-slate-400">Plan state</p>
            <p className={plan === "Premium" ? "mt-1 text-2xl font-bold text-violet-200" : "mt-1 text-2xl font-bold text-sky-100"}>{plan}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
            <p className="text-xs text-slate-400">Alert quality</p>
            <p className="mt-1 text-sm font-semibold text-white">{plan === "Premium" ? "Smart Alerts unlocked" : "Delayed demo alerts"}</p>
          </div>
        </div>
      </Card>

      {notice ? (
        <div className="rounded-2xl border border-sky-300/20 bg-sky-300/10 p-3 text-sm text-sky-100" role="status">
          {notice}
        </div>
      ) : null}

      {status === "loading" ? (
        <Card>
          <div className="flex items-center gap-3 text-slate-300">
            <Loader2 className="h-5 w-5 animate-spin text-sky-300" /> Loading saved demo watchlist...
          </div>
        </Card>
      ) : null}

      {status === "error" ? (
        <Card className="border-red-300/25 bg-red-500/10">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-red-300" />
            <div>
              <h3 className="font-semibold text-white">Watchlist could not load</h3>
              <p className="mt-1 text-sm text-red-100">{errorMessage}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button onClick={restoreDefaults}>Restore demo watchlist</Button>
                <Button onClick={resetStorage} variant="secondary">Clear saved data</Button>
              </div>
            </div>
          </div>
        </Card>
      ) : null}

      {status === "ready" ? (
        <>
          <Card>
            <div className="grid gap-3 lg:grid-cols-[1fr_180px_190px]">
              <label className="relative block">
                <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  aria-label="Search watchlist"
                  className="w-full rounded-xl border border-white/10 bg-slate-950/70 py-2.5 pl-10 pr-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-sky-300 focus:ring-2 focus:ring-sky-300/25"
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search symbol or asset name"
                  type="search"
                  value={query}
                />
              </label>
              <label className="relative block">
                <Filter className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <select
                  aria-label="Filter by market"
                  className="w-full rounded-xl border border-white/10 bg-slate-950/70 py-2.5 pl-10 pr-3 text-sm text-white outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-300/25"
                  onChange={(event) => setMarket(event.target.value)}
                  value={market}
                >
                  {markets.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label className="relative block">
                <ArrowDownUp className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <select
                  aria-label="Sort watchlist"
                  className="w-full rounded-xl border border-white/10 bg-slate-950/70 py-2.5 pl-10 pr-3 text-sm text-white outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-300/25"
                  onChange={(event) => setSort(event.target.value as SortOption)}
                  value={sort}
                >
                  {sortOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
              </label>
            </div>
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1" role="tablist">
              {tabs.map((item) => (
                <button
                  aria-selected={tab === item}
                  className={`whitespace-nowrap rounded-full border px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-sky-300 ${
                    tab === item ? "border-sky-300/50 bg-sky-300/15 text-sky-100" : "border-white/10 bg-slate-950/50 text-slate-300 hover:text-white"
                  }`}
                  key={item}
                  onClick={() => setTab(item)}
                  role="tab"
                  type="button"
                >
                  {item}
                </button>
              ))}
            </div>
          </Card>

          {selectedAssets.length === 0 ? (
            <Card>
              <div className="text-center">
                <Star className="mx-auto h-9 w-9 text-slate-500" />
                <h3 className="mt-3 text-lg font-semibold text-white">Your demo watchlist is empty</h3>
                <p className="mx-auto mt-2 max-w-xl text-sm text-slate-400">Add a demonstration investment below to start tracking prices, movement, alerts and favourite status.</p>
              </div>
            </Card>
          ) : visibleAssets.length === 0 ? (
            <Card>
              <h3 className="text-lg font-semibold text-white">No matching saved investments</h3>
              <p className="mt-2 text-sm text-slate-400">Try another tab, market filter, search term or sort setting.</p>
            </Card>
          ) : (
            <Card className="overflow-hidden p-0">
              <div className="hidden grid-cols-[1.1fr_0.9fr_0.8fr_0.8fr_0.9fr_0.8fr_0.7fr_0.7fr] gap-3 border-b border-white/10 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 lg:grid">
                <span>Investment</span>
                <span>Market</span>
                <span>Price</span>
                <span>Today</span>
                <span>Market value</span>
                <span>7-day trend</span>
                <span>Alerts</span>
                <span>Actions</span>
              </div>
              <div className="divide-y divide-white/10">
                {visibleAssets.map((asset) => {
                  const marketValue = getDemoMarketValue(asset);
                  return (
                    <div className="grid gap-3 p-4 lg:grid-cols-[1.1fr_0.9fr_0.8fr_0.8fr_0.9fr_0.8fr_0.7fr_0.7fr] lg:items-center" key={asset.symbol}>
                      <Link className="group focus:outline-none focus:ring-2 focus:ring-sky-300" href={`/investments/${encodeURIComponent(asset.symbol)}`}>
                        <span className="block text-sm font-bold text-white group-hover:text-sky-100">{asset.symbol}</span>
                        <span className="block text-sm text-slate-400">{asset.name}</span>
                        <span className="mt-2 inline-flex lg:hidden"><Badge tone="neutral">{asset.type}</Badge></span>
                      </Link>
                      <div className="text-sm text-slate-300"><span className="lg:hidden text-slate-500">Market: </span>{asset.market}</div>
                      <div className="text-sm font-semibold text-white"><span className="lg:hidden text-slate-500">Price: </span>{formatCurrency(asset.demoPrice)}</div>
                      <div className="text-sm font-semibold"><span className="lg:hidden text-slate-500">Today: </span><Movement value={asset.movement} /></div>
                      <div className="text-sm text-slate-200"><span className="lg:hidden text-slate-500">Value: </span>{formatCurrency(marketValue)}</div>
                      <TrendLine asset={asset} />
                      <div>
                        <Badge tone={asset.movement >= 0 ? "positive" : "negative"}>{plan === "Premium" ? "Smart" : "Delayed"}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <button aria-label={`Favourite ${asset.symbol}`} className="rounded-full border border-white/10 p-2 text-amber-200 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-300" type="button">
                          <Heart className="h-4 w-4" fill="currentColor" />
                        </button>
                        <button aria-label={`Remove ${asset.symbol}`} className="rounded-full border border-white/10 p-2 text-red-200 hover:bg-red-500/15 focus:outline-none focus:ring-2 focus:ring-sky-300" onClick={() => removeSymbol(asset.symbol)} type="button">
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <select aria-label={`Actions for ${asset.symbol}`} className="rounded-full border border-white/10 bg-slate-950 p-2 text-slate-300" defaultValue="actions">
                          <option value="actions">Actions</option>
                          <option value="details">Open details</option>
                          <option value="alert">Set alert</option>
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
            <Card>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">Add demo watchlist items</h3>
                  <p className="mt-1 text-sm text-slate-400">Choose from realistic demonstration assets. Free accounts stop at five saved items.</p>
                </div>
                <Button onClick={restoreDefaults} variant="secondary">Restore defaults</Button>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {availableAssets.map((asset) => (
                  <button
                    className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-left transition hover:border-sky-300/35 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-300 disabled:cursor-not-allowed disabled:opacity-45"
                    disabled={isFreeLimitReached}
                    key={asset.symbol}
                    onClick={() => addSymbol(asset.symbol)}
                    type="button"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span>
                        <span className="block text-sm font-bold text-white">{asset.symbol}</span>
                        <span className="block text-xs text-slate-400">{asset.name}</span>
                      </span>
                      <Plus className="h-4 w-4 text-sky-200" />
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                      <span>{asset.type}</span>
                      <Movement value={asset.movement} />
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            <div className="space-y-5">
              <Card className={plan === "Premium" ? "border-violet-300/25 bg-violet-500/10" : "border-sky-300/20 bg-sky-300/10"}>
                <div className="flex items-center gap-3">
                  {plan === "Premium" ? <Crown className="h-5 w-5 text-violet-200" /> : <CheckCircle2 className="h-5 w-5 text-sky-200" />}
                  <h3 className="text-lg font-semibold text-white">{plan} state</h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {plan === "Premium"
                    ? "Premium users can save unlimited items and receive complete Smart Alerts and AI insights in later prompts."
                    : "Free users can save up to five items, receive delayed demonstration alerts and see locked Premium cards."}
                </p>
              </Card>
              <Card>
                <h3 className="text-lg font-semibold text-white">State testing</h3>
                <p className="mt-2 text-sm text-slate-400">Use these controls to review empty and error-style recovery states during prototype testing.</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button onClick={resetStorage} variant="secondary">Show empty state</Button>
                  <Button onClick={() => { setStatus("error"); setErrorMessage("Demonstration error state for tester review."); }} variant="secondary">Show error state</Button>
                </div>
              </Card>
            </div>
          </div>
        </>
      ) : null}
    </AppShell>
  );
}


