export const prototypeGuardrails = [
  "Display-only live or delayed market data may be shown",
  "Safe demonstration fallback data is required",
  "No real brokers or payments",
  "No real-money trading",
  "Beginner-friendly wording",
  "Free and Premium states clearly labelled"
] as const;

export function isPrototypeOnlyIntegration(name: string) {
  const blockedTerms = ["broker connection", "payment", "stripe", "plaid", "real money", "place trade", "execute trade"];
  return blockedTerms.some((term) => name.toLowerCase().includes(term));
}
