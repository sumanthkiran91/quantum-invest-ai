export type AccountPlan = "Free" | "Premium";
export type OnboardingChoice = "new" | "investor" | "exploring";

export type DemoAccount = {
  email: string;
  password: string;
  plan: AccountPlan;
  name: string;
};

export type LocalSession = {
  email: string;
  name: string;
  plan: AccountPlan;
  onboarding: OnboardingChoice;
  practiceJourney: boolean;
  createdAt: string;
};

export const demoAccounts: DemoAccount[] = [
  { email: "free@test.com", password: "Demo123!", plan: "Free", name: "Free Tester" },
  { email: "premium@test.com", password: "Demo123!", plan: "Premium", name: "Premium Tester" }
];

export const sessionStorageKey = "quantum-invest-ai-session";
export const planStorageKey = "quantum-invest-ai-plan";

export function authenticateDemoAccount(email: string, password: string) {
  const normalized = email.trim().toLowerCase();
  return demoAccounts.find((account) => account.email === normalized && account.password === password) ?? null;
}

export function createSession({
  email,
  name,
  plan,
  onboarding,
  practiceJourney
}: {
  email: string;
  name: string;
  plan: AccountPlan;
  onboarding: OnboardingChoice;
  practiceJourney: boolean;
}): LocalSession {
  return {
    email: email.trim().toLowerCase(),
    name: name.trim() || "Prototype Tester",
    plan,
    onboarding,
    practiceJourney,
    createdAt: new Date().toISOString()
  };
}

export function getAccessSummary(plan: AccountPlan) {
  if (plan === "Premium") {
    return [
      "Unlimited watchlists",
      "Complete AI insights",
      "Smart Alerts",
      "Full scenario planner",
      "Broker comparison",
      "AI Daily Report",
      "Complete Practice Investing"
    ];
  }

  return [
    "Maximum five watchlist items",
    "Limited AI insights",
    "Delayed demonstration alerts",
    "Limited daily report",
    "Locked Premium cards"
  ];
}

export function canUsePremiumFeature(plan: AccountPlan) {
  return plan === "Premium";
}
