import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { findInvestment } from "./market-data.ts";
import { applyLiveQuote, buildDemoMarketDataResponse, formatLiveValue, liveDataFallbackMessage } from "./live-market-data.ts";

describe("live market data fallback", () => {
  it("returns a demo response with a warning when live data is unavailable", () => {
    const response = buildDemoMarketDataResponse(["AAPL", "BTC"], liveDataFallbackMessage);

    assert.equal(response.mode, "demo");
    assert.equal(response.provider, "demo");
    assert.equal(response.warning, liveDataFallbackMessage);
    assert.equal(response.quotes.AAPL.priceSource, "demo");
    assert.equal(response.quotes.BTC.movementSource, "demo");
    assert.equal(response.quotes.BTC.currencyCode, "USD");
    assert.equal(formatLiveValue(response.quotes.BTC.price, response.quotes.BTC.currencyCode, true), "$118,420 USD");
  });

  it("applies a live quote without changing the reusable asset identity", () => {
    const asset = findInvestment("AAPL");
    assert.ok(asset);

    const merged = applyLiveQuote(asset, {
      symbol: "AAPL",
      providerSymbol: "AAPL",
      price: 250.12,
      movement: 1.45,
      currencyCode: "USD",
      priceSource: "live",
      movementSource: "live",
      updatedAt: "2026-07-13T00:00:00.000Z"
    });

    assert.equal(merged.symbol, "AAPL");
    assert.equal(merged.demoPrice, 250.12);
    assert.equal(merged.movement, 1.45);
    assert.equal(merged.type, asset.type);
  });
});
