import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { authenticateDemoAccount, canUsePremiumFeature, createSession, getAccessSummary } from "./auth.ts";

describe("local prototype authentication", () => {
  it("authenticates the two required demo accounts", () => {
    assert.equal(authenticateDemoAccount("free@test.com", "Demo123!")?.plan, "Free");
    assert.equal(authenticateDemoAccount("premium@test.com", "Demo123!")?.plan, "Premium");
    assert.equal(authenticateDemoAccount("free@test.com", "wrong"), null);
  });

  it("creates local sessions and separates premium access", () => {
    const session = createSession({ email: "New@Test.com", name: "", plan: "Free", onboarding: "new", practiceJourney: true });

    assert.equal(session.email, "new@test.com");
    assert.equal(session.name, "Prototype Tester");
    assert.equal(canUsePremiumFeature("Premium"), true);
    assert.equal(canUsePremiumFeature("Free"), false);
    assert.equal(getAccessSummary("Free").includes("Maximum five watchlist items"), true);
  });
});
