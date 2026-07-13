"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  HelpCircle,
  Info,
  Check,
  LineChart,
  Newspaper,
  PlayCircle,
  Plus,
  Sparkles
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { DemoNotice } from "@/components/demo-notice";
import { allInvestments, type Investment, type Region } from "@/lib/market-data";
import { planStorageKey, sessionStorageKey, type LocalSession } from "@/lib/auth";
import { brokerRegions, estimateBrokerFee, estimateBrokerTotal, getRecommendedBroker, getTopBrokersForRegion, type BrokerRegion } from "@/lib/broker-data";
import {
  generateScenarios,
  getAiInsight,
  getChartPoints,
  getConfidence,
  getKeyData,
  getMarketStatusLabel,
  getRelatedInvestments,
  timeRanges,
  type InvestorMode,
  type ScenarioTerm,
  type TimeRange
} from "@/lib/investment-details";
import {
  applyLiveQuote,
  buildDemoMarketDataResponse,
  getMarketDataSymbols,
  liveDataFallbackMessage,
  type LiveMarketDataResponse
} from "@/lib/live-market-data";

function formatCurrency(value: number) {
  if (value >= 1000) return `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function Movement({ value }: { value: number }) {
  const positive = value >= 0;
  return <span className={positive ? "text-emerald-300" : "text-red-300"}>{positive ? "+" : ""}{value.toFixed(2)}%</span>;
}

function DemoChart({ asset, range }: { asset: Investment; range: TimeRange }) {
  const points = getChartPoints(asset, range);
  const min = Math.min(...points);
  const max = Math.max(...points);
  const rangeSize = Math.max(1, max - min);
  const polyline = points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * 560;
      const y = 112 - ((point - min) / rangeSize) * 88;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg aria-label={`${asset.symbol} ${range} display chart`} className="h-28 w-full" role="img" viewBox="0 0 580 130">
      {[24, 46, 68, 90, 112].map((y) => <line key={y} stroke="rgba(148,163,184,0.14)" strokeWidth="1" x1="0" x2="560" y1={y} y2={y} />)}
      <polyline fill="none" points={polyline} stroke={asset.movement >= 0 ? "#22C55E" : "#EF4444"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
    </svg>
  );
}

function Tooltip({ text }: { text: string }) {
  return <span className="inline-flex" title={text}><HelpCircle className="h-4 w-4 text-sky-200" /></span>;
}

function MarketDataStatus({ marketData }: { marketData: LiveMarketDataResponse | null }) {
  if (!marketData) {
    return <div className="rounded-lg border border-sky-300/15 bg-sky-300/5 px-3 py-2 text-xs text-sky-100">Checking live quote provider. Safe fallback data remains available.</div>;
  }
  if (marketData.warning) {
    return <div className="rounded-lg border border-amber-300/25 bg-amber-400/10 px-3 py-2 text-xs leading-5 text-amber-100" role="status">{marketData.warning}</div>;
  }
  return <div className="rounded-lg border border-emerald-300/20 bg-emerald-400/10 px-3 py-2 text-xs text-emerald-100" role="status">Live display data connected. Last updated {new Date(marketData.updatedAt).toLocaleTimeString()}.</div>;
}

export function InvestmentDetailsDashboard({ asset }: { asset: Investment }) {
  const [range, setRange] = useState<TimeRange>("1M");
  const [amount, setAmount] = useState(20);
  const [mode, setMode] = useState<InvestorMode>("Beginner");
  const [plan, setPlan] = useState<"Free" | "Premium">("Free");
  const [watchlistNotice, setWatchlistNotice] = useState("");
  const [marketData, setMarketData] = useState<LiveMarketDataResponse | null>(null);
  const [brokerRegion, setBrokerRegion] = useState<BrokerRegion>("Australia");

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

  const relatedBase = useMemo(() => getRelatedInvestments(asset, allInvestments), [asset]);
  const requestedSymbols = useMemo(
    () => getMarketDataSymbols([asset.symbol], relatedBase.slice(0, 4).map((item) => item.symbol)),
    [asset.symbol, relatedBase]
  );

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    async function loadMarketData() {
      try {
        const response = await fetch(`/api/market-data?symbols=${encodeURIComponent(requestedSymbols.join(","))}`, {
          cache: "no-store",
          signal: controller.signal
        });
        if (!response.ok) throw new Error("Market data request failed");
        const data = (await response.json()) as LiveMarketDataResponse;
        if (!cancelled) setMarketData(data);
      } catch {
        if (!cancelled) setMarketData(buildDemoMarketDataResponse(requestedSymbols, liveDataFallbackMessage));
      }
    }
    loadMarketData();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [requestedSymbols]);

  const displayAsset = applyLiveQuote(asset, marketData?.quotes[asset.symbol]);
  const aiInsight = getAiInsight(displayAsset);
  const scenarios = useMemo(() => generateScenarios(displayAsset, amount), [amount, displayAsset]);
  const confidence = getConfidence(displayAsset);
  const related = relatedBase.map((item) => applyLiveQuote(item, marketData?.quotes[item.symbol]));
  const assetQuote = marketData?.quotes[asset.symbol];
  const brokers = getTopBrokersForRegion(brokerRegion as Region);
  const recommendedBroker = getRecommendedBroker(brokerRegion as Region, amount);

  function addToWatchlist() {
    const raw = window.localStorage.getItem("quantum-invest-ai-watchlist");
    const current = raw ? (JSON.parse(raw) as string[]) : [];
    const next = current.includes(asset.symbol) ? current : [...current, asset.symbol];
    window.localStorage.setItem("quantum-invest-ai-watchlist", JSON.stringify(next));
    setWatchlistNotice(`${asset.symbol} saved to your demo watchlist.`);
  }

  return (
    <AppShell active="Dashboard" plan={plan} title="Investment Details">
      <DemoNotice />
      <MarketDataStatus marketData={marketData} />
      <div className="grid min-w-0 gap-3 xl:grid-cols-[1fr_300px]">
        <section className="min-w-0 space-y-3">
          <Card className="border-sky-300/20 bg-slate-950/35 p-3">
            <div className="grid gap-3 lg:grid-cols-[72px_1fr_210px] lg:items-start">
              <div className="grid h-16 w-16 place-items-center rounded-lg border border-white/10 bg-black text-xl font-bold text-white">
                {displayAsset.symbol.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-slate-500">Watchlist / {displayAsset.name}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold leading-tight text-white">{displayAsset.name} ({displayAsset.symbol})</h1>
                  <Badge tone={displayAsset.movement >= 0 ? "positive" : "negative"}>{getMarketStatusLabel(displayAsset)}</Badge>
                  <Badge tone={assetQuote?.priceSource === "live" ? "positive" : "neutral"}>{assetQuote?.priceSource === "live" ? "Live price" : "Demo fallback"}</Badge>
                </div>
                <p className="mt-1 text-xs text-slate-400">{displayAsset.market} / {displayAsset.region} / {displayAsset.type}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <span className="text-2xl font-bold text-white">{formatCurrency(displayAsset.demoPrice)}</span>
                  <span className="text-sm font-semibold"><Movement value={displayAsset.movement} /> today</span>
                  <span className="text-xs text-slate-500">Display data only, no trading connection</span>
                </div>
              </div>
              <div className="grid gap-2">
                <Button onClick={addToWatchlist}><Plus className="mr-2 h-4 w-4" /> Add to Watchlist</Button>
                <Button variant="secondary"><PlayCircle className="mr-2 h-4 w-4" /> Practice with Virtual Cash</Button>
              </div>
            </div>
            <div className="mt-3 flex gap-2 overflow-x-auto border-t border-white/10 pt-3">
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
            <div className="mt-3 rounded-lg border border-white/10 bg-[#071326] p-2"><DemoChart asset={displayAsset} range={range} /></div>
            {watchlistNotice ? <p className="mt-3 rounded-lg border border-sky-300/20 bg-sky-300/10 p-2 text-xs text-sky-100">{watchlistNotice}</p> : null}
          </Card>

          <div className="grid gap-3 xl:grid-cols-[1fr_240px]">
            <Card className="p-3">
              <div className="mb-2 flex items-center gap-2">
                <h2 className="text-sm font-bold text-white">Investment Scenario <span className="text-xs font-normal text-slate-500">(Educational estimate)</span></h2>
                <Tooltip text="These figures are educational estimates based on available display data, demonstration historical data, market conditions and news assumptions. They are not guaranteed predictions or financial advice." />
              </div>
              <div className="grid gap-2 lg:grid-cols-3">
                {(["Short Term", "Medium Term", "Long Term"] as ScenarioTerm[]).map((term) => (
                  <div className="rounded-lg border border-white/10 bg-[#071326] p-2" key={term}>
                    <h3 className="text-xs font-bold text-amber-200">{term}</h3>
                    <p className="text-[10px] text-slate-500">{term === "Short Term" ? "1 day - 3 months" : term === "Medium Term" ? "3 months - 3 years" : "3 - 10 years"}</p>
                    <div className="mt-2 space-y-2">
                      {scenarios.filter((scenario) => scenario.term === term).map((scenario) => {
                        const positive = scenario.profitLoss >= 0;
                        return (
                          <div className="grid grid-cols-[1fr_auto] gap-1.5 text-xs" key={`${scenario.term}-${scenario.strength}`}>
                            <span className="text-slate-300">{scenario.strength.replace(" outcome", "")}</span>
                            <span className="text-right font-semibold text-white">{formatCurrency(scenario.finalValue)}</span>
                            <span className={positive ? "col-span-2 text-[11px] text-emerald-300" : "col-span-2 text-[11px] text-red-300"}>
                              {positive ? "+" : ""}{formatCurrency(scenario.profitLoss)} / {positive ? "+" : ""}{scenario.percentageChange}%
                            </span>
                            <span className="col-span-2 text-[10px] leading-4 text-slate-500">{scenario.explanation}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <label className="mt-3 flex items-center gap-2 text-xs font-semibold text-slate-300">
                Amount
                <input className="h-8 w-28 rounded-md border border-white/10 bg-slate-950 px-2 text-white outline-none focus:border-sky-300" min="1" onChange={(event) => setAmount(Number(event.target.value))} type="number" value={amount} />
              </label>
            </Card>

            <Card className="p-3">
              <div className="flex items-center gap-2"><Info className="h-4 w-4 text-sky-300" /><h2 className="text-sm font-bold text-white">Key Data</h2></div>
              <div className="mt-3 grid gap-1.5">
                {getKeyData(displayAsset).slice(0, 9).map((item) => (
                  <div className="flex items-center justify-between border-b border-white/5 py-1 text-xs" key={item.label}>
                    <span className="text-slate-400">{item.label}</span>
                    <span className="font-semibold text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card className="p-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white">Broker Comparison <span className="text-xs font-normal text-slate-500">(Practice {displayAsset.symbol} - {formatCurrency(amount)})</span></h2>
                <Tooltip text="Broker fees are shown as published-fee estimates for comparison. Charges, spreads, FX fees, market access, eligibility and promotions can change. Always verify directly with the broker before opening an account or placing a trade." />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-400" htmlFor="broker-region">Region</label>
                <select
                  className="rounded-md border border-white/10 bg-slate-950 px-2 py-1.5 text-xs text-white outline-none focus:border-sky-300"
                  id="broker-region"
                  onChange={(event) => setBrokerRegion(event.target.value as BrokerRegion)}
                  value={brokerRegion}
                >
                  {brokerRegions.map((region) => <option key={region} value={region}>{region}</option>)}
                </select>
              </div>
            </div>
            <div className="mt-3 overflow-x-auto rounded-lg border border-white/10">
              <div className="min-w-[760px]">
                <div className="grid grid-cols-[1.05fr_1.25fr_0.75fr_0.65fr_0.65fr_0.95fr] gap-2 bg-slate-950/70 px-2 py-2 text-[11px] font-semibold text-slate-400">
                  <span>Broker</span><span>Est. fee</span><span>Total cost</span><span>Speed</span><span>Fractional</span><span>Best for</span>
                </div>
                <div className="divide-y divide-white/10">
                  {brokers.map((broker) => (
                    <div className="grid grid-cols-[1.05fr_1.25fr_0.75fr_0.65fr_0.65fr_0.95fr] gap-2 px-2 py-2 text-xs text-slate-300" key={broker.name}>
                      <span>
                        {broker.sourceUrl ? (
                          <a className="block font-semibold text-white hover:text-sky-200" href={broker.sourceUrl} rel="noreferrer" target="_blank">{broker.name}</a>
                        ) : (
                          <span className="block font-semibold text-white">{broker.name}</span>
                        )}
                        <span className={broker.dataQuality === "source-backed" ? "block text-[10px] text-emerald-300" : "block text-[10px] text-amber-200"}>
                          {broker.dataQuality === "source-backed" ? "Published fee" : "Prototype estimate"}
                        </span>
                      </span>
                      <span>
                        <span className="block font-semibold text-white">{formatCurrency(estimateBrokerFee(amount, broker))}</span>
                        <span className="block text-[10px] leading-4 text-slate-500">{broker.feeLabel}</span>
                      </span>
                      <span>{formatCurrency(estimateBrokerTotal(amount, broker))}</span>
                      <span>{broker.speed}</span>
                      <span>{broker.fractional ? <Check className="h-4 w-4 text-emerald-300" /> : <span className="text-slate-500">No</span>}</span>
                      <span>{broker.bestFor}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-2 text-[11px] leading-4 text-slate-500">
              Published-fee rows use public broker pricing pages checked on {brokers.find((broker) => broker.lastChecked)?.lastChecked ?? "the latest review"}. Final charges can differ because of FX, tax, order type, account plan, settlement method and broker promotions.
            </p>
            <div className="mt-3 rounded-lg border border-amber-300/25 bg-amber-400/10 p-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-bold text-amber-100">AI suggestion: {recommendedBroker.name}</p>
                  <ul className="mt-2 space-y-1 text-xs text-amber-50/90">
                    <li>Lowest estimated fee for this selected region</li>
                    <li>{recommendedBroker.speed} order flow in the prototype comparison</li>
                    <li>Best for {recommendedBroker.bestFor.toLowerCase()}</li>
                  </ul>
                </div>
                <Button variant="secondary">Practice with {recommendedBroker.name}</Button>
              </div>
            </div>
          </Card>

          <div className="grid gap-3 md:grid-cols-2">
            <Card className="p-3">
              <div className="flex items-center justify-between"><div className="flex items-center gap-2"><Newspaper className="h-4 w-4 text-sky-300" /><h2 className="text-sm font-bold text-white">Recent News</h2></div><Link className="text-xs text-sky-300" href="/">View All News</Link></div>
              <ul className="mt-3 space-y-2 text-xs text-slate-300">
                <li>{displayAsset.name} watched after today&apos;s display-data move.</li>
                <li>{displayAsset.industry} sentiment changed after global market rotation.</li>
                <li>Analysts monitor pricing, demand and sector momentum.</li>
              </ul>
            </Card>
            <Card className="p-3">
              <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-sky-300" /><h2 className="text-sm font-bold text-white">Upcoming Events</h2></div>
              <ul className="mt-3 space-y-2 text-xs text-slate-300">
                <li className="flex justify-between"><span>Earnings Date</span><strong>Jul 31, 2025</strong></li>
                <li className="flex justify-between"><span>Dividend Ex-Date</span><strong>May 16, 2025</strong></li>
                <li className="flex justify-between"><span>Product Launch Event</span><strong>Jun 10, 2025</strong></li>
              </ul>
            </Card>
          </div>
        </section>

        <aside className="space-y-3">
          <Card className="border-violet-300/20 bg-violet-500/10 p-3">
            <div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-violet-200" /><h2 className="text-sm font-bold text-white">AI Insights</h2></div><Badge tone={displayAsset.movement >= 0 ? "positive" : "negative"}>{displayAsset.movement >= 0 ? "Bullish" : "Cautious"}</Badge></div>
            <div className="mt-3 space-y-2 text-xs leading-5 text-slate-200">
              <p>{aiInsight.whatHappened}</p>
              <p>{aiInsight.possibleReasons}</p>
              <p>Confidence: <span className="text-emerald-300">{confidence}%</span></p>
            </div>
            <Button className="mt-3 w-full" variant="secondary">View Detailed Analysis</Button>
          </Card>

          <Card className="p-3">
            <h2 className="text-sm font-bold text-white">Analyst Ratings</h2>
            <div className="mt-3 grid grid-cols-[86px_1fr] items-center gap-3">
              <div className="grid h-20 w-20 place-items-center rounded-full border-[8px] border-emerald-400/80 bg-[#071326] text-center">
                <span className="text-xl font-bold text-white">{Math.max(20, Math.round(confidence / 2))}</span>
                <span className="text-[10px] text-slate-400">Ratings</span>
              </div>
              <div className="space-y-1 text-xs">
                <p className="flex justify-between text-emerald-300"><span>Strong Buy</span><span>18</span></p>
                <p className="flex justify-between text-sky-300"><span>Buy</span><span>9</span></p>
                <p className="flex justify-between text-slate-300"><span>Hold</span><span>3</span></p>
                <p className="flex justify-between text-red-300"><span>Sell</span><span>0</span></p>
              </div>
            </div>
          </Card>

          <Card className="p-3">
            <div className="flex items-center gap-2"><LineChart className="h-4 w-4 text-sky-300" /><h2 className="text-sm font-bold text-white">Related Stocks</h2></div>
            <div className="mt-3 space-y-2">
              {related.slice(0, 4).map((item) => (
                <Link className="flex items-center justify-between rounded-md border border-white/10 bg-[#071326] px-2 py-1.5 text-xs hover:border-sky-300/40" href={`/investments/${encodeURIComponent(item.symbol)}`} key={item.symbol}>
                  <span className="font-semibold text-white">{item.name} ({item.symbol})</span>
                  <Movement value={item.movement} />
                </Link>
              ))}
            </div>
          </Card>

          <Card className="p-3">
            <div className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-sky-300" /><h2 className="text-sm font-bold text-white">{mode} Mode</h2></div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {(["Beginner", "Expert"] as InvestorMode[]).map((item) => (
                <button className={`rounded-md border px-3 py-1.5 text-xs font-semibold ${mode === item ? "border-sky-300/50 bg-sky-300/15 text-sky-100" : "border-white/10 bg-slate-950 text-slate-300"}`} key={item} onClick={() => setMode(item)} type="button">
                  {item}
                </button>
              ))}
            </div>
          </Card>
        </aside>
      </div>
    </AppShell>
  );
}
