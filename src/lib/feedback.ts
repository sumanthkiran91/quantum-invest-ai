export type FeedbackKind = "General Feedback" | "Report an Issue" | "Suggest an Improvement";

export type TesterFeedback = {
  id: string;
  createdAt: string;
  kind: FeedbackKind;
  page: string;
  easyToUnderstand: "Yes" | "Somewhat" | "No";
  likedMost: string;
  confusing: string;
  shouldAdd: string;
  shouldRemove: string;
  failed: string;
  wouldPay: "Yes" | "Maybe" | "No";
  comments: string;
  consentAccepted: boolean;
};

export const feedbackStorageKey = "quantum-invest-ai-feedback";

export function createFeedbackId(now = new Date()) {
  return `fb-${now.getTime().toString(36)}`;
}

export function validateFeedback(feedback: TesterFeedback) {
  return Boolean(feedback.page.trim() && feedback.easyToUnderstand && feedback.wouldPay && feedback.consentAccepted);
}

export function summarizeFeedback(items: TesterFeedback[]) {
  const total = items.length;
  const payingInterest = items.filter((item) => item.wouldPay === "Yes" || item.wouldPay === "Maybe").length;
  const issues = items.filter((item) => item.kind === "Report an Issue" || item.failed.trim()).length;
  const improvements = items.filter((item) => item.kind === "Suggest an Improvement" || item.shouldAdd.trim()).length;
  return { total, payingInterest, issues, improvements };
}
