import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isPrototypeOnlyIntegration, prototypeGuardrails } from "./mock-guardrails.ts";

describe("prototype guardrails", () => {
  it("records the required display-data boundaries", () => {
    assert.equal(prototypeGuardrails.includes("Display-only live or delayed market data may be shown"), true);
    assert.equal(prototypeGuardrails.includes("Safe demonstration fallback data is required"), true);
    assert.equal(prototypeGuardrails.includes("No real-money trading"), true);
  });

  it("flags integration names that should stay out of the prototype", () => {
    assert.equal(isPrototypeOnlyIntegration("Stripe payment checkout"), true);
    assert.equal(isPrototypeOnlyIntegration("live display quote"), false);
    assert.equal(isPrototypeOnlyIntegration("demo watchlist card"), false);
  });
});
