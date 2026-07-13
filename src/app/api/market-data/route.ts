import { NextResponse } from "next/server";
import { allInvestments, marketOverview } from "@/lib/market-data";
import {
  buildDemoMarketDataResponse,
  formatLiveValue,
  liveDataFallbackMessage,
  marketOverviewSymbols,
  toProviderSymbol,
  type LiveMarketDataResponse,
  type LiveMarketOverviewItem,
  type LiveMarketQuote
} from "@/lib/live-market-data";

export const dynamic = "force-dynamic";

const MAX_SYMBOLS = 14;
const DEFAULT_TIMEOUT_MS = 3500;

const overviewNames = marketOverview.map((item) => item.name);
const cryptoSymbols = new Set(["BTC", "ETH", "SOL"]);

function parseSymbols(raw: string | null) {
  if (!raw) return [];
  return Array.from(new Set(raw.split(",").map((symbol) => symbol.trim().toUpperCase()).filter(Boolean))).slice(0, MAX_SYMBOLS);
}

function parseNumber(value: unknown) {
  const numberValue = Number(String(value ?? "").replace(/[,%$]/g, ""));
  return Number.isFinite(numberValue) ? numberValue : null;
}

function parsePercent(value: unknown) {
  const parsed = parseNumber(value);
  return parsed ?? 0;
}

function getDemoMovement(symbol: string) {
  return allInvestments.find((asset) => asset.symbol.toUpperCase() === symbol.toUpperCase())?.movement ?? 0;
}

function getTimeoutMs() {
  const configured = Number(process.env.MARKET_DATA_TIMEOUT_MS);
  return Number.isFinite(configured) && configured > 500 ? configured : DEFAULT_TIMEOUT_MS;
}

async function fetchJsonWithTimeout(url: URL) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), getTimeoutMs());
  try {
    const response = await fetch(url, { cache: "no-store", signal: controller.signal });
    if (!response.ok) throw new Error(`Provider returned ${response.status}`);
    return (await response.json()) as Record<string, unknown>;
  } finally {
    clearTimeout(timeout);
  }
}

function assertProviderPayload(data: Record<string, unknown>) {
  const note = data.Note ?? data.Information ?? data["Error Message"];
  if (note) throw new Error(String(note));
}

async function fetchAlphaQuote(symbol: string, apiKey: string, updatedAt: string): Promise<LiveMarketQuote> {
  const providerSymbol = toProviderSymbol(symbol);
  if (cryptoSymbols.has(providerSymbol)) {
    const url = new URL("https://www.alphavantage.co/query");
    url.searchParams.set("function", "CURRENCY_EXCHANGE_RATE");
    url.searchParams.set("from_currency", providerSymbol);
    url.searchParams.set("to_currency", "USD");
    url.searchParams.set("apikey", apiKey);
    const data = await fetchJsonWithTimeout(url);
    assertProviderPayload(data);
    const rate = data["Realtime Currency Exchange Rate"] as Record<string, unknown> | undefined;
    const price = parseNumber(rate?.["5. Exchange Rate"]);
    if (price == null) throw new Error(`No crypto price returned for ${symbol}`);
    return {
      symbol,
      providerSymbol,
      price,
      movement: getDemoMovement(symbol),
      priceSource: "live",
      movementSource: "demo",
      updatedAt
    };
  }

  const url = new URL("https://www.alphavantage.co/query");
  url.searchParams.set("function", "GLOBAL_QUOTE");
  url.searchParams.set("symbol", providerSymbol);
  url.searchParams.set("apikey", apiKey);
  const data = await fetchJsonWithTimeout(url);
  assertProviderPayload(data);
  const quote = data["Global Quote"] as Record<string, unknown> | undefined;
  const price = parseNumber(quote?.["05. price"]);
  if (price == null) throw new Error(`No quote price returned for ${symbol}`);
  return {
    symbol,
    providerSymbol,
    price,
    movement: parsePercent(quote?.["10. change percent"]),
    priceSource: "live",
    movementSource: "live",
    updatedAt
  };
}

function quoteToOverviewItem(name: string, quote: LiveMarketQuote | null): LiveMarketOverviewItem | null {
  if (!quote) return null;
  return {
    name,
    value: formatLiveValue(quote.price),
    movement: quote.movement,
    source: quote.priceSource
  };
}

async function getAlphaVantageData(symbols: string[], includeOverview: boolean, apiKey: string): Promise<LiveMarketDataResponse> {
  const updatedAt = new Date().toISOString();
  const requestSymbols = includeOverview ? Array.from(new Set([...symbols, ...marketOverviewSymbols])) : symbols;
  const results = await Promise.allSettled(requestSymbols.map((symbol) => fetchAlphaQuote(symbol, apiKey, updatedAt)));
  const liveQuotes = results.reduce<Record<string, LiveMarketQuote>>((accumulator, result) => {
    if (result.status === "fulfilled") accumulator[result.value.symbol] = result.value;
    return accumulator;
  }, {});

  const demo = buildDemoMarketDataResponse(symbols);
  const quotes = { ...demo.quotes };
  for (const symbol of symbols) {
    const quote = liveQuotes[symbol];
    if (quote) quotes[symbol] = quote;
  }

  const overview = includeOverview
    ? overviewNames.map((name, index) => quoteToOverviewItem(name, liveQuotes[marketOverviewSymbols[index]]) ?? { ...marketOverview[index], source: "demo" as const })
    : demo.overview;

  const liveCount = Object.values(quotes).filter((quote) => quote.priceSource === "live").length;
  if (liveCount === 0) {
    return buildDemoMarketDataResponse(symbols, liveDataFallbackMessage);
  }

  return {
    mode: liveCount === symbols.length ? "live" : "demo",
    provider: "alpha-vantage",
    updatedAt,
    warning: liveCount < symbols.length ? liveDataFallbackMessage : undefined,
    quotes,
    overview
  };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const symbols = parseSymbols(url.searchParams.get("symbols"));
  const includeOverview = url.searchParams.get("overview") === "1";
  const liveEnabled = (process.env.MARKET_DATA_MODE ?? "live").toLowerCase() !== "demo";
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

  if (!liveEnabled) {
    return NextResponse.json(buildDemoMarketDataResponse(symbols, "Live data mode is currently switched off, so demonstration data is being displayed."));
  }

  if (!apiKey) {
    return NextResponse.json(buildDemoMarketDataResponse(symbols, "Live data is not connected yet, so demonstration data is being displayed for now. Add an Alpha Vantage API key in Vercel environment variables to enable live display data."));
  }

  try {
    const data = await getAlphaVantageData(symbols, includeOverview, apiKey);
    return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json(buildDemoMarketDataResponse(symbols, liveDataFallbackMessage), { headers: { "Cache-Control": "no-store" } });
  }
}
