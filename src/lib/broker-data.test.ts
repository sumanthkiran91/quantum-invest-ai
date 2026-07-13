import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { estimateBrokerFee, estimateBrokerTotal, getRecommendedBroker, getTopBrokersForRegion } from "./broker-data.ts";

describe("broker comparison data", () => {
  it("returns top five regional broker estimates", () => {
    const brokers = getTopBrokersForRegion("Australia");

    assert.equal(brokers.length, 5);
    assert.equal(brokers[0].name, "CMC Invest");
    assert.equal(estimateBrokerFee(20, brokers[0]), 0);
    assert.equal(estimateBrokerTotal(20, brokers[0]), 20);
  });

  it("recommends the lowest estimated fee broker", () => {
    const recommended = getRecommendedBroker("USA");

    assert.equal(estimateBrokerFee(20, recommended), 0);
  });
});
