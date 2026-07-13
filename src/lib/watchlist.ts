import type { AssetType, Investment } from "./market-data.ts";

export type AccountPlan = "Free" | "Premium";
export type WatchlistTab = "All" | "Shares" | "Crypto" | "ETFs" | "Commodities" | "Long-Term Picks";
export type SortOption = "movement-desc" | "movement-asc" | "price-desc" | "price-asc" | "symbol-asc";

export const FREE_WATCHLIST_LIMIT = 5;

export function canAddWatchlistItem(plan: AccountPlan, currentCount: number) {
  return plan === "Premium" || currentCount < FREE_WATCHLIST_LIMIT;
}

export function assetMatchesTab(asset: Investment, tab: WatchlistTab) {
  const typeMap: Record<Exclude<WatchlistTab, "All" | "Long-Term Picks">, AssetType> = {
    Shares: "Share",
    Crypto: "Crypto",
    ETFs: "ETF",
    Commodities: "Commodity"
  };

  if (tab === "All") return true;
  if (tab === "Long-Term Picks") {
    return asset.type === "ETF" || asset.industry === "Healthcare" || asset.industry === "Renewable Energy" || asset.movement >= 1;
  }
  return asset.type === typeMap[tab];
}

export function filterWatchlistAssets({
  assets,
  tab,
  query,
  market,
  sort
}: {
  assets: Investment[];
  tab: WatchlistTab;
  query: string;
  market: string;
  sort: SortOption;
}) {
  const normalized = query.trim().toLowerCase();
  const filtered = assets.filter((asset) => {
    const searchMatch = !normalized || asset.symbol.toLowerCase().includes(normalized) || asset.name.toLowerCase().includes(normalized);
    const marketMatch = market === "All markets" || asset.market === market;
    return assetMatchesTab(asset, tab) && searchMatch && marketMatch;
  });

  return filtered.sort((a, b) => {
    if (sort === "movement-desc") return b.movement - a.movement;
    if (sort === "movement-asc") return a.movement - b.movement;
    if (sort === "price-desc") return b.demoPrice - a.demoPrice;
    if (sort === "price-asc") return a.demoPrice - b.demoPrice;
    return a.symbol.localeCompare(b.symbol);
  });
}

export function getDemoMarketValue(asset: Investment) {
  const units = Math.max(1, (asset.symbol.charCodeAt(0) + asset.symbol.length) % 18);
  return Number((units * asset.demoPrice).toFixed(2));
}

export function getTrendPoints(asset: Investment) {
  const seed = asset.symbol.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
  return Array.from({ length: 7 }, (_, index) => {
    const wave = Math.sin((seed + index * 17) / 12) * 8;
    const drift = asset.movement * index * 0.55;
    return Number((50 + wave + drift).toFixed(2));
  });
}
