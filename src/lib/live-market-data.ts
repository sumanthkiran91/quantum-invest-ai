import { allInvestments, marketOverview, type Investment } from "./market-data.ts";

export type MarketDataMode = "live" | "demo";
export type MarketDataProvider = "alpha-vantage" | "coingecko" | "mixed" | "demo";
export type QuoteDataSource = "live" | "demo";

export type LiveMarketQuote = {
  symbol: string;
  providerSymbol: string;
  price: number;
  movement: number;
  currencyCode: string;
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
  diagnostics?: string;
  updatedAt: string;
  warning?: string;
  quotes: Record<string, LiveMarketQuote>;
  overview: LiveMarketOverviewItem[];
};

export const liveDataFallbackMessage =
  "Live market data is temporarily unavailable, so demonstration data is being displayed for now. The app will automatically return to live display data when the provider responds.";

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

const currencySymbols: Record<string, string> = {
  AUD: "A$",
  USD: "$",
  GBP: "\u00a3",
  EUR: "\u20ac",
  INR: "\u20b9",
  JPY: "\u00a5"
};

export const marketOverviewSymbols = ["SPY", "QQQ", "DIA", "EWA", "EWU", "INDY", "EWJ", "BTC", "ETH"] as const;

export function toProviderSymbol(symbol: string) {
  const normalized = symbol.trim().toUpperCase();
  return providerSymbolMap[normalized] ?? normalized;
}

export function getAssetCurrencyCode(asset: Pick<Investment, "region" | "type" | "market">) {
  if (asset.type === "Crypto") return "USD";
  if (asset.region === "Australia") return "AUD";
  if (asset.region === "UK") return "GBP";
  if (asset.region === "Europe") return "EUR";
  if (asset.region === "India") return "INR";
  if (asset.region === "Japan") return "JPY";
  return "USD";
}

export function getCurrencySymbol(currencyCode: string) {
  return currencySymbols[currencyCode.toUpperCase()] ?? `${currencyCode.toUpperCase()} `;
}

export function formatLiveValue(value: number, currencyCode = "USD", includeCode = false) {
  const code = currencyCode.toUpperCase();
  const decimals = code === "JPY" || code === "INR" || Math.abs(value) >= 1000 ? 0 : 2;
  const formatted = value.toLocaleString(undefined, {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals
  });
  return `${getCurrencySymbol(code)}${formatted}${includeCode ? ` ${code}` : ""}`;
}

export function buildDemoQuote(symbol: string, updatedAt = new Date().toISOString()): LiveMarketQuote | null {
  const asset = allInvestments.find((item) => item.symbol.toUpperCase() === symbol.toUpperCase());
  if (!asset) return null;
  return {
    symbol: asset.symbol,
    providerSymbol: toProviderSymbol(asset.symbol),
    price: asset.demoPrice,
    movement: asset.movement,
    currencyCode: getAssetCurrencyCode(asset),
    priceSource: "demo",
    movementSource: "demo",
    updatedAt
  };
}

export function buildDemoMarketDataResponse(symbols: string[], warning?: string, diagnostics?: string): LiveMarketDataResponse {
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
    diagnostics,
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