import type { Region } from "./market-data.ts";

export type BrokerRegion = Exclude<Region, "Global">;

export type BrokerEstimate = {
  name: string;
  region: BrokerRegion;
  fee: number;
  speed: string;
  fractional: boolean;
  bestFor: string;
  notes: string;
};

export const brokerRegions: BrokerRegion[] = ["Australia", "USA", "India", "UK", "Europe", "Japan"];

const brokersByRegion: Record<BrokerRegion, BrokerEstimate[]> = {
  Australia: [
    { name: "CommSec", region: "Australia", fee: 0.5, speed: "Instant", fractional: true, bestFor: "Small amounts", notes: "Example small-order estimate for prototype comparison." },
    { name: "Stake", region: "Australia", fee: 0.7, speed: "Instant", fractional: true, bestFor: "Beginners", notes: "Example small-order estimate for prototype comparison." },
    { name: "Selfwealth", region: "Australia", fee: 0.9, speed: "Instant", fractional: true, bestFor: "Low fees", notes: "Example small-order estimate for prototype comparison." },
    { name: "CMC Invest", region: "Australia", fee: 1, speed: "~2 min", fractional: true, bestFor: "Active traders", notes: "Example small-order estimate for prototype comparison." },
    { name: "Interactive Brokers", region: "Australia", fee: 1.5, speed: "Instant", fractional: true, bestFor: "Professionals", notes: "Example small-order estimate for prototype comparison." }
  ],
  USA: [
    { name: "Fidelity", region: "USA", fee: 0, speed: "Instant", fractional: true, bestFor: "Long-term investors", notes: "Prototype estimate for listed US stocks and ETFs." },
    { name: "Charles Schwab", region: "USA", fee: 0, speed: "Instant", fractional: true, bestFor: "Beginners", notes: "Prototype estimate for listed US stocks and ETFs." },
    { name: "Robinhood", region: "USA", fee: 0, speed: "Instant", fractional: true, bestFor: "Small accounts", notes: "Prototype estimate for listed US stocks and ETFs." },
    { name: "E*TRADE", region: "USA", fee: 0, speed: "Instant", fractional: false, bestFor: "Research tools", notes: "Prototype estimate for listed US stocks and ETFs." },
    { name: "Interactive Brokers", region: "USA", fee: 0.35, speed: "Instant", fractional: true, bestFor: "Advanced users", notes: "Prototype estimate for tiered small orders." }
  ],
  India: [
    { name: "Zerodha", region: "India", fee: 0.25, speed: "Instant", fractional: false, bestFor: "Low-cost trading", notes: "Prototype estimate converted for comparison." },
    { name: "Groww", region: "India", fee: 0.3, speed: "Instant", fractional: false, bestFor: "Beginners", notes: "Prototype estimate converted for comparison." },
    { name: "Upstox", region: "India", fee: 0.35, speed: "Instant", fractional: false, bestFor: "Mobile trading", notes: "Prototype estimate converted for comparison." },
    { name: "Angel One", region: "India", fee: 0.4, speed: "Instant", fractional: false, bestFor: "Research support", notes: "Prototype estimate converted for comparison." },
    { name: "ICICI Direct", region: "India", fee: 0.55, speed: "~2 min", fractional: false, bestFor: "Bank integration", notes: "Prototype estimate converted for comparison." }
  ],
  UK: [
    { name: "Trading 212", region: "UK", fee: 0, speed: "Instant", fractional: true, bestFor: "Small amounts", notes: "Prototype estimate for comparison only." },
    { name: "Freetrade", region: "UK", fee: 0.99, speed: "Instant", fractional: true, bestFor: "Beginners", notes: "Prototype estimate for comparison only." },
    { name: "Interactive Brokers", region: "UK", fee: 1, speed: "Instant", fractional: true, bestFor: "Global access", notes: "Prototype estimate for comparison only." },
    { name: "AJ Bell", region: "UK", fee: 5, speed: "~2 min", fractional: false, bestFor: "ISA investors", notes: "Prototype estimate for comparison only." },
    { name: "Hargreaves Lansdown", region: "UK", fee: 11.95, speed: "~2 min", fractional: false, bestFor: "Research tools", notes: "Prototype estimate for comparison only." }
  ],
  Europe: [
    { name: "DEGIRO", region: "Europe", fee: 1, speed: "Instant", fractional: false, bestFor: "Low fees", notes: "Prototype estimate for comparison only." },
    { name: "Trade Republic", region: "Europe", fee: 1, speed: "Instant", fractional: true, bestFor: "Small amounts", notes: "Prototype estimate for comparison only." },
    { name: "Scalable Capital", region: "Europe", fee: 0.99, speed: "Instant", fractional: true, bestFor: "ETF plans", notes: "Prototype estimate for comparison only." },
    { name: "Interactive Brokers", region: "Europe", fee: 1.25, speed: "Instant", fractional: true, bestFor: "Global access", notes: "Prototype estimate for comparison only." },
    { name: "Saxo", region: "Europe", fee: 3, speed: "~2 min", fractional: false, bestFor: "Advanced tools", notes: "Prototype estimate for comparison only." }
  ],
  Japan: [
    { name: "SBI Securities", region: "Japan", fee: 0, speed: "Instant", fractional: false, bestFor: "Local investors", notes: "Prototype estimate for comparison only." },
    { name: "Rakuten Securities", region: "Japan", fee: 0, speed: "Instant", fractional: false, bestFor: "Beginners", notes: "Prototype estimate for comparison only." },
    { name: "Monex", region: "Japan", fee: 0.5, speed: "Instant", fractional: false, bestFor: "US stocks", notes: "Prototype estimate for comparison only." },
    { name: "Matsui Securities", region: "Japan", fee: 0.6, speed: "~2 min", fractional: false, bestFor: "Local equities", notes: "Prototype estimate for comparison only." },
    { name: "Interactive Brokers", region: "Japan", fee: 1.2, speed: "Instant", fractional: true, bestFor: "Global access", notes: "Prototype estimate for comparison only." }
  ]
};

export function getTopBrokersForRegion(region: Region): BrokerEstimate[] {
  const brokerRegion: BrokerRegion = region === "Global" ? "Australia" : region;
  return brokersByRegion[brokerRegion] ?? brokersByRegion.Australia;
}

export function estimateBrokerTotal(amount: number, broker: BrokerEstimate) {
  const safeAmount = Number.isFinite(amount) && amount > 0 ? amount : 0;
  return Number((safeAmount + broker.fee).toFixed(2));
}

export function getRecommendedBroker(region: Region) {
  return getTopBrokersForRegion(region).slice().sort((a, b) => a.fee - b.fee)[0];
}
