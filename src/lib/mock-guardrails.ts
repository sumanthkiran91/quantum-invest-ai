export const prototypeGuardrails = [
  "Mock demonstration data only",
  "No real brokers or payments",
  "No live market feeds",
  "No real-money trading",
  "Beginner-friendly wording",
  "Free and Premium states clearly labelled"
] as const;

export function isPrototypeOnlyIntegration(name: string) {
  const blockedTerms = ["broker", "payment", "stripe", "plaid", "live feed", "real money"];
  return blockedTerms.some((term) => name.toLowerCase().includes(term));
}
