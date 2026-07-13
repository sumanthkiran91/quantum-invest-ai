import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { brokerRegions, estimateBrokerFee, estimateBrokerTotal, getRecommendedBroker, getTopBrokersForRegion } from "./broker-data.ts";

describe("broker comparison data", () => {
  it("returns top five regional broker estimates", () => {
    const brokers = getTopBrokersForRegion("Australia");

    assert.equal(brokers.length, 5);
    assert.equal(brokers[0].name, "CMC Invest");
    assert.equal(estimateBrokerFee(20, brokers[0]), 0);
    assert.equal(estimateBrokerTotal(20, brokers[0]), 20);
  });

  it("keeps each region broker list region specific", () => {
    for (const region of brokerRegions) {
      const brokers = getTopBrokersForRegion(region);

      assert.equal(brokers.length, 5);
      assert.equal(brokers.every((broker) => broker.region === region), true);
    }

    assert.equal(getTopBrokersForRegion("USA").some((broker) => broker.name === "CommSec"), false);
    assert.equal(getTopBrokersForRegion("India")[0].currencyCode, "INR");
    assert.equal(getTopBrokersForRegion("Japan")[0].currencyCode, "JPY");
  });

  it("uses fee models for published fee estimates", () => {
    const groww = getTopBrokersForRegion("India").find((broker) => broker.name === "Groww");
    const ibkrJapan = getTopBrokersForRegion("Japan").find((broker) => broker.name === "Interactive Brokers");

    assert.ok(groww);
    assert.ok(ibkrJapan);
    assert.equal(estimateBrokerFee(20, groww), 5);
    assert.equal(estimateBrokerFee(20, ibkrJapan), 80);
  });

  it("recommends the lowest estimated fee broker", () => {
    const recommended = getRecommendedBroker("USA");

    assert.equal(estimateBrokerFee(20, recommended), 0);
  });
});