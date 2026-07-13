import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createFeedbackId, summarizeFeedback, validateFeedback, type TesterFeedback } from "./feedback.ts";

function makeFeedback(overrides: Partial<TesterFeedback> = {}): TesterFeedback {
  return {
    id: "fb-test",
    createdAt: "2026-07-13T00:00:00.000Z",
    kind: "General Feedback",
    page: "/watchlist",
    easyToUnderstand: "Yes",
    likedMost: "Filtering",
    confusing: "",
    shouldAdd: "",
    shouldRemove: "",
    failed: "",
    wouldPay: "Maybe",
    comments: "Useful prototype",
    consentAccepted: true,
    ...overrides
  };
}

describe("feedback helpers", () => {
  it("validates required tester consent and page fields", () => {
    assert.equal(validateFeedback(makeFeedback()), true);
    assert.equal(validateFeedback(makeFeedback({ consentAccepted: false })), false);
    assert.equal(validateFeedback(makeFeedback({ page: "" })), false);
  });

  it("summarizes local tester feedback", () => {
    const summary = summarizeFeedback([
      makeFeedback({ kind: "Report an Issue", wouldPay: "No" }),
      makeFeedback({ kind: "Suggest an Improvement", shouldAdd: "More alerts", wouldPay: "Yes" })
    ]);

    assert.equal(summary.total, 2);
    assert.equal(summary.payingInterest, 1);
    assert.equal(summary.issues, 1);
    assert.equal(summary.improvements, 1);
    assert.equal(createFeedbackId(new Date("2026-07-13T00:00:00.000Z")).startsWith("fb-"), true);
  });
});
