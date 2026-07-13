import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { findInvestment } from "./market-data.ts";
import { generateScenarios, getChartPoints, getConfidence, getRiskScore } from "./investment-details.ts";

describe("investment details calculations", () => {
  it("generates deterministic scenarios for each term and outcome", () => {
    const asset = findInvestment("BTC");
    assert.ok(asset);

    const first = generateScenarios(asset, 20);
    const second = generateScenarios(asset, 20);

    assert.equal(first.length, 9);
    assert.deepEqual(first, second);
    assert.equal(first.some((scenario) => scenario.finalValue !== 20), true);
  });

  it("creates chart points and bounded confidence from asset profile", () => {
    const asset = findInvestment("GLD");
    assert.ok(asset);

    assert.equal(getChartPoints(asset, "1D").length, 24);
    assert.equal(getChartPoints(asset, "1Y").length, 30);
    assert.notDeepEqual(getChartPoints(asset, "1D"), getChartPoints(asset, "6M"));
    assert.equal(getRiskScore(asset) > 0, true);
    assert.equal(getConfidence(asset) >= 54, true);
  });
});
