import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { estimateBrokerTotal, getRecommendedBroker, getTopBrokersForRegion } from "./broker-data.ts";

describe("broker comparison data", () => {
  it("returns top five regional broker estimates", () => {
    const brokers = getTopBrokersForRegion("Australia");

    assert.equal(brokers.length, 5);
    assert.equal(brokers[0].name, "CommSec");
    assert.equal(estimateBrokerTotal(20, brokers[0]), 20.5);
  });

  it("recommends the lowest estimated fee broker", () => {
    const recommended = getRecommendedBroker("USA");

    assert.equal(recommended.fee, 0);
  });
});
