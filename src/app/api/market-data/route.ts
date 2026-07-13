import { NextResponse } from "next/server";
import { allInvestments, marketOverview } from "@/lib/market-data";
import {
  buildDemoMarketDataResponse,
  formatLiveValue,
  getAssetCurrencyCode,
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
const cryptoIdBySymbol: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana"
};
const symbolByCryptoId: Record<string, string> = Object.fromEntries(Object.entries(cryptoIdBySymbol).map(([symbol, id]) => [id, symbol]));
const providerSupportedSymbols = new Set([...allInvestments.map((asset) => asset.symbol.toUpperCase()), ...marketOverviewSymbols]);

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

function getQuoteCurrencyCode(symbol: string) {
  const asset = allInvestments.find((item) => item.symbol.toUpperCase() === symbol.toUpperCase());
  return asset ? getAssetCurrencyCode(asset) : "USD";
}

function getCryptoQuoteCurrency() {
  const configured = (process.env.MARKET_DATA_CRYPTO_CURRENCY ?? "AUD").trim().toUpperCase();
  return /^[A-Z]{3,5}$/.test(configured) ? configured : "AUD";
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

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function summarizeProviderFailures(errors: string[]) {
  const combined = errors.join(" ").toLowerCase();
  if (!errors.length) return "The provider returned no usable live quote data.";
  if (combined.includes("rate limit") || combined.includes("25 requests") || combined.includes("frequency")) {
    return "The live provider rate limit was reached, so demonstration data is being displayed until the quota resets.";
  }
  if (combined.includes("invalid api") || combined.includes("api key")) {
    return "The live provider rejected the API key. Check the key value in Vercel and redeploy.";
  }
  if (combined.includes("no quote") || combined.includes("no crypto price")) {
    return "The live provider did not return quotes for one or more requested symbols, so demonstration data is being displayed for those items.";
  }
  if (combined.includes("abort") || combined.includes("timeout")) {
    return "The live provider timed out, so demonstration data is being displayed for now.";
  }
  return "The live provider returned an unusable response, so demonstration data is being displayed for now.";
}

function withProviderWarning(detail: string) {
  return `${liveDataFallbackMessage} ${detail}`;
}

async function fetchCoinGeckoCryptoQuotes(symbols: string[], currencyCode: string, updatedAt: string): Promise<Record<string, LiveMarketQuote>> {
  const requestedCryptoIds = symbols.map((symbol) => cryptoIdBySymbol[symbol]).filter(Boolean);
  if (!requestedCryptoIds.length) return {};

  const url = new URL("https://api.coingecko.com/api/v3/simple/price");
  url.searchParams.set("ids", Array.from(new Set(requestedCryptoIds)).join(","));
  url.searchParams.set("vs_currencies", currencyCode.toLowerCase());
  url.searchParams.set("include_24hr_change", "true");
  url.searchParams.set("include_last_updated_at", "true");
  const headers: HeadersInit = {};
  const coinGeckoKey = process.env.COINGECKO_DEMO_API_KEY;
  if (coinGeckoKey) headers["x-cg-demo-api-key"] = coinGeckoKey;

  const response = await fetch(url, { cache: "no-store", headers });
  if (!response.ok) throw new Error(`CoinGecko returned ${response.status}`);
  const data = (await response.json()) as Record<string, Record<string, unknown>>;

  return Object.entries(data).reduce<Record<string, LiveMarketQuote>>((accumulator, [id, quote]) => {
    const symbol = symbolByCryptoId[id];
    const price = parseNumber(quote?.[currencyCode.toLowerCase()]);
    if (!symbol || price == null) return accumulator;
    accumulator[symbol] = {
      symbol,
      providerSymbol: id,
      price,
      movement: parsePercent(quote?.[`${currencyCode.toLowerCase()}_24h_change`]),
      currencyCode,
      priceSource: "live",
      movementSource: quote?.[`${currencyCode.toLowerCase()}_24h_change`] == null ? "demo" : "live",
      updatedAt
    };
    return accumulator;
  }, {});
}

async function fetchAlphaQuote(symbol: string, apiKey: string, updatedAt: string, cryptoCurrencyCode: string): Promise<LiveMarketQuote> {
  const providerSymbol = toProviderSymbol(symbol);
  if (cryptoSymbols.has(providerSymbol)) {
    const url = new URL("https://www.alphavantage.co/query");
    url.searchParams.set("function", "CURRENCY_EXCHANGE_RATE");
    url.searchParams.set("from_currency", providerSymbol);
    url.searchParams.set("to_currency", cryptoCurrencyCode);
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
      currencyCode: cryptoCurrencyCode,
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
    currencyCode: getQuoteCurrencyCode(symbol),
    priceSource: "live",
    movementSource: "live",
    updatedAt
  };
}

function quoteToOverviewItem(name: string, quote: LiveMarketQuote | null): LiveMarketOverviewItem | null {
  if (!quote) return null;
  return {
    name,
    value: formatLiveValue(quote.price, quote.currencyCode),
    movement: quote.movement,
    source: quote.priceSource
  };
}

async function getProviderMarketData(symbols: string[], includeOverview: boolean, apiKey: string): Promise<LiveMarketDataResponse> {
  const updatedAt = new Date().toISOString();
  const rawRequestSymbols = includeOverview ? Array.from(new Set([...symbols, ...marketOverviewSymbols])) : symbols;
  const requestSymbols = rawRequestSymbols.filter((symbol) => providerSupportedSymbols.has(symbol));
  const cryptoCurrencyCode = getCryptoQuoteCurrency();
  const cryptoRequestSymbols = requestSymbols.filter((symbol) => cryptoSymbols.has(symbol));
  const alphaRequestSymbols = requestSymbols.filter((symbol) => !cryptoSymbols.has(symbol));
  const providerErrors: string[] = [];

  let cryptoQuotes: Record<string, LiveMarketQuote> = {};
  if (cryptoRequestSymbols.length) {
    try {
      cryptoQuotes = await fetchCoinGeckoCryptoQuotes(cryptoRequestSymbols, cryptoCurrencyCode, updatedAt);
    } catch (error) {
      providerErrors.push(getErrorMessage(error));
    }
  }

  const missingCryptoSymbols = cryptoRequestSymbols.filter((symbol) => !cryptoQuotes[symbol]);
  const alphaSymbols = [...alphaRequestSymbols, ...missingCryptoSymbols];
  const results = await Promise.allSettled(alphaSymbols.map((symbol) => fetchAlphaQuote(symbol, apiKey, updatedAt, cryptoCurrencyCode)));
  const alphaQuotes = results.reduce<Record<string, LiveMarketQuote>>((accumulator, result) => {
    if (result.status === "fulfilled") {
      accumulator[result.value.symbol] = result.value;
    } else {
      providerErrors.push(getErrorMessage(result.reason));
    }
    return accumulator;
  }, {});

  const liveQuotes = { ...alphaQuotes, ...cryptoQuotes };
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
  const requestedQuoteCount = Object.values(quotes).length;
  const provider = Object.values(liveQuotes).some((quote) => cryptoSymbols.has(quote.symbol)) && Object.values(liveQuotes).some((quote) => !cryptoSymbols.has(quote.symbol))
    ? "mixed"
    : Object.values(liveQuotes).some((quote) => cryptoSymbols.has(quote.symbol))
      ? "coingecko"
      : "alpha-vantage";
  const failureDetail = summarizeProviderFailures(providerErrors);

  if (liveCount === 0) {
    return buildDemoMarketDataResponse(symbols, withProviderWarning(failureDetail), failureDetail);
  }

  return {
    mode: liveCount === requestedQuoteCount ? "live" : "demo",
    provider,
    diagnostics: providerErrors.length ? failureDetail : undefined,
    updatedAt,
    warning: liveCount < requestedQuoteCount ? withProviderWarning(failureDetail) : undefined,
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
    const data = await getProviderMarketData(symbols, includeOverview, apiKey);
    return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const detail = summarizeProviderFailures([getErrorMessage(error)]);
    return NextResponse.json(buildDemoMarketDataResponse(symbols, withProviderWarning(detail), detail), { headers: { "Cache-Control": "no-store" } });
  }
}
