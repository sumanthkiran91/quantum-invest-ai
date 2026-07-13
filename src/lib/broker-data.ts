import type { Region } from "./market-data.ts";

export type BrokerRegion = Exclude<Region, "Global">;

export type BrokerEstimate = {
  name: string;
  region: BrokerRegion;
  feeLabel: string;
  feeModel: "flat" | "tiered" | "minimum-percent" | "first-small-buy";
  flatFee?: number;
  minimumFee?: number;
  percentFee?: number;
  firstBuyLimit?: number;
  firstBuyFee?: number;
  tiers?: Array<{ max?: number; fee: number }>;
  speed: string;
  fractional: boolean;
  bestFor: string;
  notes: string;
  sourceLabel?: string;
  sourceUrl?: string;
  lastChecked?: string;
  dataQuality: "source-backed" | "prototype-estimate";
};

export const brokerRegions: BrokerRegion[] = ["Australia", "USA", "India", "UK", "Europe", "Japan"];

const checkedDate = "13 Jul 2026";

const brokersByRegion: Record<BrokerRegion, BrokerEstimate[]> = {
  Australia: [
    {
      name: "CMC Invest",
      region: "Australia",
      feeLabel: "A$0 first buy under A$1,000; otherwise A$11 or 0.10%",
      feeModel: "first-small-buy",
      firstBuyLimit: 1000,
      firstBuyFee: 0,
      minimumFee: 11,
      percentFee: 0.001,
      speed: "Instant",
      fractional: false,
      bestFor: "First small buys",
      notes: "Published online ASX fee estimate. First buy is once per security, per day; sells and later buys use the standard fee.",
      sourceLabel: "CMC Invest pricing",
      sourceUrl: "https://www.cmcmarkets.com/en-au/stockbroking/pricing",
      lastChecked: checkedDate,
      dataQuality: "source-backed"
    },
    {
      name: "Stake",
      region: "Australia",
      feeLabel: "A$3/trade or 0.01% above A$30,000",
      feeModel: "minimum-percent",
      minimumFee: 3,
      percentFee: 0.0001,
      speed: "Instant",
      fractional: true,
      bestFor: "Beginners",
      notes: "Published ASX fee estimate. Wall St has a separate US$ fee and FX may apply.",
      sourceLabel: "Stake pricing",
      sourceUrl: "https://hellostake.com/au/pricing",
      lastChecked: checkedDate,
      dataQuality: "source-backed"
    },
    {
      name: "CommSec",
      region: "Australia",
      feeLabel: "A$5 up to A$1,000, then tiered",
      feeModel: "tiered",
      tiers: [
        { max: 1000, fee: 5 },
        { max: 3000, fee: 10 },
        { max: 10000, fee: 19.95 },
        { max: 25000, fee: 29.95 }
      ],
      percentFee: 0.0012,
      speed: "Instant",
      fractional: false,
      bestFor: "Bank integration",
      notes: "Published online ASX fee estimate when eligible trades settle to CDIA or CommSec Margin Loan.",
      sourceLabel: "CommSec rates and fees",
      sourceUrl: "https://www.commsec.com.au/support/rates-and-fees.html",
      lastChecked: checkedDate,
      dataQuality: "source-backed"
    },
    {
      name: "Interactive Brokers",
      region: "Australia",
      feeLabel: "0.08% with A$5 tiered minimum",
      feeModel: "minimum-percent",
      minimumFee: 5,
      percentFee: 0.0008,
      speed: "Instant",
      fractional: true,
      bestFor: "Global access",
      notes: "Published Australia tiered estimate before any applicable taxes or third-party fees.",
      sourceLabel: "IBKR AU commissions",
      sourceUrl: "https://www.interactivebrokers.com.au/en/pricing/commissions-stocks-asia-pacific.php",
      lastChecked: checkedDate,
      dataQuality: "source-backed"
    },
    {
      name: "nabtrade",
      region: "Australia",
      feeLabel: "A$9.95 up to A$1,000, then tiered",
      feeModel: "tiered",
      tiers: [
        { max: 1000, fee: 9.95 },
        { max: 5000, fee: 14.95 },
        { max: 20000, fee: 19.95 }
      ],
      percentFee: 0.0011,
      speed: "Instant",
      fractional: false,
      bestFor: "NAB customers",
      notes: "Published domestic shares fee estimate, GST inclusive.",
      sourceLabel: "nabtrade pricing",
      sourceUrl: "https://www.nabtrade.com.au/pricing",
      lastChecked: checkedDate,
      dataQuality: "source-backed"
    }
  ],
  USA: [
    { name: "Fidelity", region: "USA", feeLabel: "$0 listed stock/ETF estimate", feeModel: "flat", flatFee: 0, speed: "Instant", fractional: true, bestFor: "Long-term investors", notes: "Prototype estimate for listed US stocks and ETFs.", dataQuality: "prototype-estimate" },
    { name: "Charles Schwab", region: "USA", feeLabel: "$0 listed stock/ETF estimate", feeModel: "flat", flatFee: 0, speed: "Instant", fractional: true, bestFor: "Beginners", notes: "Prototype estimate for listed US stocks and ETFs.", dataQuality: "prototype-estimate" },
    { name: "Robinhood", region: "USA", feeLabel: "$0 listed stock/ETF estimate", feeModel: "flat", flatFee: 0, speed: "Instant", fractional: true, bestFor: "Small accounts", notes: "Prototype estimate for listed US stocks and ETFs.", dataQuality: "prototype-estimate" },
    { name: "E*TRADE", region: "USA", feeLabel: "$0 listed stock/ETF estimate", feeModel: "flat", flatFee: 0, speed: "Instant", fractional: false, bestFor: "Research tools", notes: "Prototype estimate for listed US stocks and ETFs.", dataQuality: "prototype-estimate" },
    { name: "Interactive Brokers", region: "USA", feeLabel: "$0.35 tiered small-order estimate", feeModel: "flat", flatFee: 0.35, speed: "Instant", fractional: true, bestFor: "Advanced users", notes: "Prototype estimate for tiered small orders.", dataQuality: "prototype-estimate" }
  ],
  India: [
    { name: "Zerodha", region: "India", feeLabel: "$0.25 converted estimate", feeModel: "flat", flatFee: 0.25, speed: "Instant", fractional: false, bestFor: "Low-cost trading", notes: "Prototype estimate converted for comparison.", dataQuality: "prototype-estimate" },
    { name: "Groww", region: "India", feeLabel: "$0.30 converted estimate", feeModel: "flat", flatFee: 0.3, speed: "Instant", fractional: false, bestFor: "Beginners", notes: "Prototype estimate converted for comparison.", dataQuality: "prototype-estimate" },
    { name: "Upstox", region: "India", feeLabel: "$0.35 converted estimate", feeModel: "flat", flatFee: 0.35, speed: "Instant", fractional: false, bestFor: "Mobile trading", notes: "Prototype estimate converted for comparison.", dataQuality: "prototype-estimate" },
    { name: "Angel One", region: "India", feeLabel: "$0.40 converted estimate", feeModel: "flat", flatFee: 0.4, speed: "Instant", fractional: false, bestFor: "Research support", notes: "Prototype estimate converted for comparison.", dataQuality: "prototype-estimate" },
    { name: "ICICI Direct", region: "India", feeLabel: "$0.55 converted estimate", feeModel: "flat", flatFee: 0.55, speed: "~2 min", fractional: false, bestFor: "Bank integration", notes: "Prototype estimate converted for comparison.", dataQuality: "prototype-estimate" }
  ],
  UK: [
    { name: "Trading 212", region: "UK", feeLabel: "$0 estimate", feeModel: "flat", flatFee: 0, speed: "Instant", fractional: true, bestFor: "Small amounts", notes: "Prototype estimate for comparison only.", dataQuality: "prototype-estimate" },
    { name: "Freetrade", region: "UK", feeLabel: "$0.99 estimate", feeModel: "flat", flatFee: 0.99, speed: "Instant", fractional: true, bestFor: "Beginners", notes: "Prototype estimate for comparison only.", dataQuality: "prototype-estimate" },
    { name: "Interactive Brokers", region: "UK", feeLabel: "$1.00 estimate", feeModel: "flat", flatFee: 1, speed: "Instant", fractional: true, bestFor: "Global access", notes: "Prototype estimate for comparison only.", dataQuality: "prototype-estimate" },
    { name: "AJ Bell", region: "UK", feeLabel: "$5.00 estimate", feeModel: "flat", flatFee: 5, speed: "~2 min", fractional: false, bestFor: "ISA investors", notes: "Prototype estimate for comparison only.", dataQuality: "prototype-estimate" },
    { name: "Hargreaves Lansdown", region: "UK", feeLabel: "$11.95 estimate", feeModel: "flat", flatFee: 11.95, speed: "~2 min", fractional: false, bestFor: "Research tools", notes: "Prototype estimate for comparison only.", dataQuality: "prototype-estimate" }
  ],
  Europe: [
    { name: "DEGIRO", region: "Europe", feeLabel: "$1.00 estimate", feeModel: "flat", flatFee: 1, speed: "Instant", fractional: false, bestFor: "Low fees", notes: "Prototype estimate for comparison only.", dataQuality: "prototype-estimate" },
    { name: "Trade Republic", region: "Europe", feeLabel: "$1.00 estimate", feeModel: "flat", flatFee: 1, speed: "Instant", fractional: true, bestFor: "Small amounts", notes: "Prototype estimate for comparison only.", dataQuality: "prototype-estimate" },
    { name: "Scalable Capital", region: "Europe", feeLabel: "$0.99 estimate", feeModel: "flat", flatFee: 0.99, speed: "Instant", fractional: true, bestFor: "ETF plans", notes: "Prototype estimate for comparison only.", dataQuality: "prototype-estimate" },
    { name: "Interactive Brokers", region: "Europe", feeLabel: "$1.25 estimate", feeModel: "flat", flatFee: 1.25, speed: "Instant", fractional: true, bestFor: "Global access", notes: "Prototype estimate for comparison only.", dataQuality: "prototype-estimate" },
    { name: "Saxo", region: "Europe", feeLabel: "$3.00 estimate", feeModel: "flat", flatFee: 3, speed: "~2 min", fractional: false, bestFor: "Advanced tools", notes: "Prototype estimate for comparison only.", dataQuality: "prototype-estimate" }
  ],
  Japan: [
    { name: "SBI Securities", region: "Japan", feeLabel: "$0 estimate", feeModel: "flat", flatFee: 0, speed: "Instant", fractional: false, bestFor: "Local investors", notes: "Prototype estimate for comparison only.", dataQuality: "prototype-estimate" },
    { name: "Rakuten Securities", region: "Japan", feeLabel: "$0 estimate", feeModel: "flat", flatFee: 0, speed: "Instant", fractional: false, bestFor: "Beginners", notes: "Prototype estimate for comparison only.", dataQuality: "prototype-estimate" },
    { name: "Monex", region: "Japan", feeLabel: "$0.50 estimate", feeModel: "flat", flatFee: 0.5, speed: "Instant", fractional: false, bestFor: "US stocks", notes: "Prototype estimate for comparison only.", dataQuality: "prototype-estimate" },
    { name: "Matsui Securities", region: "Japan", feeLabel: "$0.60 estimate", feeModel: "flat", flatFee: 0.6, speed: "~2 min", fractional: false, bestFor: "Local equities", notes: "Prototype estimate for comparison only.", dataQuality: "prototype-estimate" },
    { name: "Interactive Brokers", region: "Japan", feeLabel: "$1.20 estimate", feeModel: "flat", flatFee: 1.2, speed: "Instant", fractional: true, bestFor: "Global access", notes: "Prototype estimate for comparison only.", dataQuality: "prototype-estimate" }
  ]
};

export function getTopBrokersForRegion(region: Region): BrokerEstimate[] {
  const brokerRegion: BrokerRegion = region === "Global" ? "Australia" : region;
  return brokersByRegion[brokerRegion] ?? brokersByRegion.Australia;
}

export function estimateBrokerFee(amount: number, broker: BrokerEstimate) {
  const safeAmount = Number.isFinite(amount) && amount > 0 ? amount : 0;
  let fee = broker.flatFee ?? 0;

  if (broker.feeModel === "first-small-buy") {
    const limit = broker.firstBuyLimit ?? 0;
    if (safeAmount <= limit) {
      fee = broker.firstBuyFee ?? 0;
    } else {
      fee = Math.max(broker.minimumFee ?? 0, safeAmount * (broker.percentFee ?? 0));
    }
  }

  if (broker.feeModel === "minimum-percent") {
    fee = Math.max(broker.minimumFee ?? 0, safeAmount * (broker.percentFee ?? 0));
  }

  if (broker.feeModel === "tiered") {
    const tier = broker.tiers?.find((item) => item.max === undefined || safeAmount <= item.max);
    fee = tier?.fee ?? safeAmount * (broker.percentFee ?? 0);
  }

  return Number(fee.toFixed(2));
}

export function estimateBrokerTotal(amount: number, broker: BrokerEstimate) {
  const safeAmount = Number.isFinite(amount) && amount > 0 ? amount : 0;
  return Number((safeAmount + estimateBrokerFee(safeAmount, broker)).toFixed(2));
}

export function getRecommendedBroker(region: Region, amount = 20) {
  return getTopBrokersForRegion(region)
    .slice()
    .sort((a, b) => estimateBrokerFee(amount, a) - estimateBrokerFee(amount, b))[0];
}
