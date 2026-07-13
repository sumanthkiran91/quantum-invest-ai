import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { allInvestments } from "./market-data.ts";
import { canAddWatchlistItem, filterWatchlistAssets, FREE_WATCHLIST_LIMIT } from "./watchlist.ts";

describe("watchlist rules", () => {
  it("limits Free users to five saved items and allows Premium unlimited items", () => {
    assert.equal(canAddWatchlistItem("Free", FREE_WATCHLIST_LIMIT - 1), true);
    assert.equal(canAddWatchlistItem("Free", FREE_WATCHLIST_LIMIT), false);
    assert.equal(canAddWatchlistItem("Premium", 42), true);
  });

  it("filters saved assets by tab, search and market", () => {
    const assets = allInvestments.filter((asset) => ["NVDA", "BTC", "GLD"].includes(asset.symbol));
    const crypto = filterWatchlistAssets({ assets, tab: "Crypto", query: "bit", market: "All markets", sort: "symbol-asc" });
    const gold = filterWatchlistAssets({ assets, tab: "Commodities", query: "", market: "NYSE Arca", sort: "symbol-asc" });

    assert.deepEqual(crypto.map((asset) => asset.symbol), ["BTC"]);
    assert.deepEqual(gold.map((asset) => asset.symbol), ["GLD"]);
  });
});
