import { allInvestments, marketOverview, type Investment } from "./market-data.ts";

export type MarketDataMode = "live" | "demo";
export type MarketDataProvider = "alpha-vantage" | "demo";
export type QuoteDataSource = "live" | "demo";

export type LiveMarketQuote = {
  symbol: string;
  providerSymbol: string;
  price: number;
  movement: number;
  priceSource: QuoteDataSource;
  movementSource: QuoteDataSource;
  updatedAt: string;
};

export type LiveMarketOverviewItem = {
  name: string;
  value: string;
  movement: number;
  source: QuoteDataSource;
};

export type LiveMarketDataResponse = {
  mode: MarketDataMode;
  provider: MarketDataProvider;
  updatedAt: string;
  warning?: string;
  quotes: Record<string, LiveMarketQuote>;
  overview: LiveMarketOverviewItem[];
};

export const liveDataFallbackMessage =
  "Live market data is temporarily unavailable. Due to a technical issue, demonstration data is being displayed and live data will be restored automatically when the provider responds.";

const providerSymbolMap: Record<string, string> = {
  BTC: "BTC",
  ETH: "ETH",
  SOL: "SOL",
  ROBO: "ROBO",
  GOVT: "GOVT",
  TLT: "TLT",
  VNQ: "VNQ",
  GLD: "GLD",
  USO: "USO"
};

export const marketOverviewSymbols = ["SPY", "QQQ", "DIA", "EWA", "EWU", "INDY", "EWJ", "BTC", "ETH"] as const;

export function toProviderSymbol(symbol: string) {
  const normalized = symbol.trim().toUpperCase();
  return providerSymbolMap[normalized] ?? normalized;
}

export function formatLiveValue(value: number, currency = true) {
  const formatted = value.toLocaleString(undefined, {
    maximumFractionDigits: value >= 1000 ? 0 : 2,
    minimumFractionDigits: value >= 1000 ? 0 : 2
  });
  return currency ? `$${formatted}` : formatted;
}

export function buildDemoQuote(symbol: string, updatedAt = new Date().toISOString()): LiveMarketQuote | null {
  const asset = allInvestments.find((item) => item.symbol.toUpperCase() === symbol.toUpperCase());
  if (!asset) return null;
  return {
    symbol: asset.symbol,
    providerSymbol: toProviderSymbol(asset.symbol),
    price: asset.demoPrice,
    movement: asset.movement,
    priceSource: "demo",
    movementSource: "demo",
    updatedAt
  };
}

export function buildDemoMarketDataResponse(symbols: string[], warning?: string): LiveMarketDataResponse {
  const updatedAt = new Date().toISOString();
  const uniqueSymbols = Array.from(new Set(symbols.map((symbol) => symbol.trim().toUpperCase()).filter(Boolean)));
  const quotes = uniqueSymbols.reduce<Record<string, LiveMarketQuote>>((accumulator, symbol) => {
    const quote = buildDemoQuote(symbol, updatedAt);
    if (quote) accumulator[quote.symbol] = quote;
    return accumulator;
  }, {});

  return {
    mode: "demo",
    provider: "demo",
    updatedAt,
    warning,
    quotes,
    overview: marketOverview.map((item) => ({ ...item, source: "demo" as const }))
  };
}

export function applyLiveQuote(asset: Investment, quote?: LiveMarketQuote): Investment {
  if (!quote) return asset;
  const priceLabel = quote.priceSource === "live" ? "Live price" : "Demonstration price";
  const movementLabel = quote.movementSource === "live" ? "live movement" : "demonstration movement";
  return {
    ...asset,
    demoPrice: quote.price,
    movement: quote.movement,
    reason: `${priceLabel} with ${movementLabel}. ${asset.reason}`
  };
}

export function getMarketDataSymbols(...groups: string[][]) {
  return Array.from(new Set(groups.flat().map((symbol) => symbol.trim().toUpperCase()).filter(Boolean)));
}
