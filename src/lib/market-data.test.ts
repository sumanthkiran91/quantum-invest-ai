import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getTopMovers } from "./market-data.ts";
import { getMarketStatus, marketTimings } from "./market-timings.ts";

describe("global dashboard data", () => {
  it("returns five growing and five losing movers for every selected industry", () => {
    const movers = getTopMovers("Technology", "Global");

    assert.equal(movers.growing.length, 5);
    assert.equal(movers.losing.length, 5);
    assert.equal(movers.growing.every((asset) => asset.movement > 0), true);
    assert.equal(movers.losing.every((asset) => asset.movement < 0), true);
  });

  it("keeps crypto markets open all day in mock timing logic", () => {
    const crypto = marketTimings.find((market) => market.crypto);
    assert.ok(crypto);

    const status = getMarketStatus(crypto, new Date("2026-07-13T12:00:00Z"));
    assert.equal(status.status, "Open");
    assert.equal(status.nextEvent, "Always open");
  });
});
