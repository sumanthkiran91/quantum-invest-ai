import type { Region } from "./market-data.ts";

export type BrokerRegion = Exclude<Region, "Global">;

export type BrokerEstimate = {
  name: string;
  region: BrokerRegion;
  currencyCode: string;
  currencySymbol: string;
  feeLabel: string;
  feeModel: "flat" | "tiered" | "minimum-percent" | "bounded-percent" | "first-small-buy";
  flatFee?: number;
  minimumFee?: number;
  maximumFee?: number;
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
      currencyCode: "AUD",
      currencySymbol: "A$",
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
      currencyCode: "AUD",
      currencySymbol: "A$",
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
      currencyCode: "AUD",
      currencySymbol: "A$",
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
      currencyCode: "AUD",
      currencySymbol: "A$",
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
      currencyCode: "AUD",
      currencySymbol: "A$",
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
    {
      name: "Fidelity",
      region: "USA",
      currencyCode: "USD",
      currencySymbol: "$",
      feeLabel: "$0 online U.S. stocks and ETFs",
      feeModel: "flat",
      flatFee: 0,
      speed: "Instant",
      fractional: true,
      bestFor: "Long-term investors",
      notes: "Published online U.S. stock and ETF commission estimate. Options, bonds, foreign assets and representative-assisted trades can differ.",
      sourceLabel: "Fidelity commissions",
      sourceUrl: "https://www.fidelity.com/trading/commissions-margin-rates",
      lastChecked: checkedDate,
      dataQuality: "source-backed"
    },
    {
      name: "Charles Schwab",
      region: "USA",
      currencyCode: "USD",
      currencySymbol: "$",
      feeLabel: "$0 online listed stocks and ETFs",
      feeModel: "flat",
      flatFee: 0,
      speed: "Instant",
      fractional: true,
      bestFor: "Beginners",
      notes: "Published online listed stock and ETF commission estimate. OTC, foreign, options and broker-assisted trades can differ.",
      sourceLabel: "Schwab pricing",
      sourceUrl: "https://www.schwab.com/pricing",
      lastChecked: checkedDate,
      dataQuality: "source-backed"
    },
    {
      name: "Robinhood",
      region: "USA",
      currencyCode: "USD",
      currencySymbol: "$",
      feeLabel: "$0 commission for stocks and ETFs; pass-through regulatory fees may apply",
      feeModel: "flat",
      flatFee: 0,
      speed: "Instant",
      fractional: true,
      bestFor: "Small accounts",
      notes: "Published commission-free estimate. Sell orders can include regulatory pass-through fees.",
      sourceLabel: "Robinhood trading fees",
      sourceUrl: "https://robinhood.com/us/en/support/articles/trading-fees-on-robinhood/",
      lastChecked: checkedDate,
      dataQuality: "source-backed"
    },
    {
      name: "E*TRADE",
      region: "USA",
      currencyCode: "USD",
      currencySymbol: "$",
      feeLabel: "$0 online stocks, ETFs and mutual funds",
      feeModel: "flat",
      flatFee: 0,
      speed: "Instant",
      fractional: false,
      bestFor: "Research tools",
      notes: "Published online commission estimate. Options contracts, OTC, broker-assisted and crypto fees can differ.",
      sourceLabel: "E*TRADE pricing",
      sourceUrl: "https://us.etrade.com/what-we-offer/pricing-and-rates",
      lastChecked: checkedDate,
      dataQuality: "source-backed"
    },
    {
      name: "Interactive Brokers",
      region: "USA",
      currencyCode: "USD",
      currencySymbol: "$",
      feeLabel: "IBKR Lite $0; IBKR Pro tiered from $0.0035/share",
      feeModel: "flat",
      flatFee: 0,
      speed: "Instant",
      fractional: true,
      bestFor: "Advanced users",
      notes: "Published IBKR Lite estimate for eligible U.S. exchange-listed stocks and ETFs. Pro, OTC and special orders can differ.",
      sourceLabel: "IBKR US commissions",
      sourceUrl: "https://www.interactivebrokers.com/en/pricing/commissions-stocks.php",
      lastChecked: checkedDate,
      dataQuality: "source-backed"
    }
  ],
  India: [
    {
      name: "Zerodha",
      region: "India",
      currencyCode: "INR",
      currencySymbol: "₹",
      feeLabel: "₹0 equity delivery; intraday/F&O up to ₹20",
      feeModel: "flat",
      flatFee: 0,
      speed: "Instant",
      fractional: false,
      bestFor: "Long-term delivery investing",
      notes: "Published equity delivery estimate. Intraday, F&O, DP and statutory charges can apply separately.",
      sourceLabel: "Zerodha charges",
      sourceUrl: "https://zerodha.com/charges/",
      lastChecked: checkedDate,
      dataQuality: "source-backed"
    },
    {
      name: "Dhan",
      region: "India",
      currencyCode: "INR",
      currencySymbol: "₹",
      feeLabel: "₹0 equity delivery; intraday/MTF ₹20 or 0.03% lower",
      feeModel: "flat",
      flatFee: 0,
      speed: "Instant",
      fractional: false,
      bestFor: "Active investors",
      notes: "Published equity delivery estimate. Trading, DP, statutory and MTF charges can apply separately.",
      sourceLabel: "Dhan pricing",
      sourceUrl: "https://dhan.co/pricing/",
      lastChecked: checkedDate,
      dataQuality: "source-backed"
    },
    {
      name: "Groww",
      region: "India",
      currencyCode: "INR",
      currencySymbol: "₹",
      feeLabel: "0.1% per executed equity order, min ₹5, max ₹20",
      feeModel: "bounded-percent",
      minimumFee: 5,
      maximumFee: 20,
      percentFee: 0.001,
      speed: "Instant",
      fractional: false,
      bestFor: "Beginners",
      notes: "Published equity brokerage estimate. DP, statutory and exchange charges can apply separately.",
      sourceLabel: "Groww pricing",
      sourceUrl: "https://groww.in/pricing",
      lastChecked: checkedDate,
      dataQuality: "source-backed"
    },
    {
      name: "Upstox",
      region: "India",
      currencyCode: "INR",
      currencySymbol: "₹",
      feeLabel: "₹20 per equity delivery order; intraday ₹20 or 0.1% lower",
      feeModel: "flat",
      flatFee: 20,
      speed: "Instant",
      fractional: false,
      bestFor: "Mobile trading",
      notes: "Published brokerage estimate. DP, statutory and exchange charges can apply separately.",
      sourceLabel: "Upstox brokerage charges",
      sourceUrl: "https://upstox.com/brokerage-charges/",
      lastChecked: checkedDate,
      dataQuality: "source-backed"
    },
    {
      name: "5paisa",
      region: "India",
      currencyCode: "INR",
      currencySymbol: "₹",
      feeLabel: "Flat ₹20 per executed order",
      feeModel: "flat",
      flatFee: 20,
      speed: "Instant",
      fractional: false,
      bestFor: "Simple flat pricing",
      notes: "Published flat brokerage estimate. DP, statutory and exchange charges can apply separately.",
      sourceLabel: "5paisa pricing",
      sourceUrl: "https://www.5paisa.com/pricing",
      lastChecked: checkedDate,
      dataQuality: "source-backed"
    }
  ],
  UK: [
    {
      name: "Freetrade",
      region: "UK",
      currencyCode: "GBP",
      currencySymbol: "£",
      feeLabel: "£0 dealing commission; FX fees on non-GBP trades",
      feeModel: "flat",
      flatFee: 0,
      speed: "Instant",
      fractional: true,
      bestFor: "Small amounts",
      notes: "Published dealing commission estimate. Plan fees, FX and product costs can apply.",
      sourceLabel: "Freetrade plans",
      sourceUrl: "https://freetrade.io/pricing",
      lastChecked: checkedDate,
      dataQuality: "source-backed"
    },
    {
      name: "eToro",
      region: "UK",
      currencyCode: "USD",
      currencySymbol: "$",
      feeLabel: "$1-$2 stock commission may apply; ETFs $0 commission",
      feeModel: "flat",
      flatFee: 1,
      speed: "Instant",
      fractional: true,
      bestFor: "Social investing",
      notes: "Published stock fee estimate. Fee depends on country, exchange and asset; conversion fees may apply.",
      sourceLabel: "eToro fees",
      sourceUrl: "https://www.etoro.com/trading/fees/",
      lastChecked: checkedDate,
      dataQuality: "source-backed"
    },
    {
      name: "Interactive Brokers",
      region: "UK",
      currencyCode: "GBP",
      currencySymbol: "£",
      feeLabel: "0.05% tiered, minimum £1 for UK shares",
      feeModel: "minimum-percent",
      minimumFee: 1,
      percentFee: 0.0005,
      speed: "Instant",
      fractional: true,
      bestFor: "Global access",
      notes: "Published UK GBP-denominated tiered estimate. Other currencies, routing and third-party fees can differ.",
      sourceLabel: "IBKR UK commissions",
      sourceUrl: "https://www.interactivebrokers.co.uk/en/pricing/commissions-stocks-europe.php",
      lastChecked: checkedDate,
      dataQuality: "source-backed"
    },
    {
      name: "AJ Bell",
      region: "UK",
      currencyCode: "GBP",
      currencySymbol: "£",
      feeLabel: "From £1.50 dealing charge; regular investing £0",
      feeModel: "flat",
      flatFee: 1.5,
      speed: "~2 min",
      fractional: false,
      bestFor: "ISA investors",
      notes: "Published one-off dealing estimate. Account charges, FX and frequent-dealer rates can differ.",
      sourceLabel: "AJ Bell charges",
      sourceUrl: "https://www.ajbell.co.uk/charges",
      lastChecked: checkedDate,
      dataQuality: "source-backed"
    },
    {
      name: "Hargreaves Lansdown",
      region: "UK",
      currencyCode: "GBP",
      currencySymbol: "£",
      feeLabel: "£6.95 online share dealing for 0-19 trades last month",
      feeModel: "flat",
      flatFee: 6.95,
      speed: "~2 min",
      fractional: false,
      bestFor: "Research tools",
      notes: "Published online share dealing estimate. Frequent-trader, regular-savings, account and stamp-duty charges can differ.",
      sourceLabel: "HL dealing charges",
      sourceUrl: "https://www.hl.co.uk/shares/share-dealing/dealing-charges",
      lastChecked: checkedDate,
      dataQuality: "source-backed"
    }
  ],
  Europe: [
    {
      name: "Trade Republic",
      region: "Europe",
      currencyCode: "EUR",
      currencySymbol: "€",
      feeLabel: "Approx. €1 third-party settlement cost per securities order",
      feeModel: "flat",
      flatFee: 1,
      speed: "Instant",
      fractional: true,
      bestFor: "Small amounts",
      notes: "Regional estimate for markets where Trade Republic operates. Requires country-specific confirmation before production use.",
      sourceLabel: "Trade Republic pricing",
      sourceUrl: "https://traderepublic.com/",
      lastChecked: checkedDate,
      dataQuality: "prototype-estimate"
    },
    {
      name: "DEGIRO",
      region: "Europe",
      currencyCode: "EUR",
      currencySymbol: "€",
      feeLabel: "Example: Euronext Dublin €2 commission + €1 handling",
      feeModel: "flat",
      flatFee: 3,
      speed: "Instant",
      fractional: false,
      bestFor: "Exchange access",
      notes: "Published Ireland fee example. Fees vary by DEGIRO country site, exchange and connectivity.",
      sourceLabel: "DEGIRO fees",
      sourceUrl: "https://www.degiro.ie/fees",
      lastChecked: checkedDate,
      dataQuality: "source-backed"
    },
    {
      name: "Interactive Brokers",
      region: "Europe",
      currencyCode: "EUR",
      currencySymbol: "€",
      feeLabel: "0.05% tiered, minimum about €1.25 for EUR shares",
      feeModel: "minimum-percent",
      minimumFee: 1.25,
      percentFee: 0.0005,
      speed: "Instant",
      fractional: true,
      bestFor: "Global access",
      notes: "Published Europe tiered estimate. Fees vary by market currency and routing.",
      sourceLabel: "IBKR Europe commissions",
      sourceUrl: "https://www.interactivebrokers.ie/en/pricing/commissions-stocks-europe.php",
      lastChecked: checkedDate,
      dataQuality: "source-backed"
    },
    {
      name: "eToro",
      region: "Europe",
      currencyCode: "USD",
      currencySymbol: "$",
      feeLabel: "$1-$2 stock commission may apply; ETFs $0 commission",
      feeModel: "flat",
      flatFee: 1,
      speed: "Instant",
      fractional: true,
      bestFor: "Social investing",
      notes: "Published stock fee estimate. Fees depend on residence country, exchange and account currency.",
      sourceLabel: "eToro fees",
      sourceUrl: "https://www.etoro.com/trading/fees/",
      lastChecked: checkedDate,
      dataQuality: "source-backed"
    },
    {
      name: "Saxo",
      region: "Europe",
      currencyCode: "EUR",
      currencySymbol: "€",
      feeLabel: "Indicative pricing varies by residence and account tier",
      feeModel: "flat",
      flatFee: 1,
      speed: "~2 min",
      fractional: false,
      bestFor: "Advanced tools",
      notes: "Published page says exact stock pricing varies by country of residence and platform trade ticket.",
      sourceLabel: "Saxo stock commissions",
      sourceUrl: "https://www.home.saxo/rates-and-conditions/stocks/commissions",
      lastChecked: checkedDate,
      dataQuality: "source-backed"
    }
  ],
  Japan: [
    {
      name: "SBI Securities",
      region: "Japan",
      currencyCode: "JPY",
      currencySymbol: "¥",
      feeLabel: "Domestic stock fee estimate: ¥0 on eligible online plans",
      feeModel: "flat",
      flatFee: 0,
      speed: "Instant",
      fractional: false,
      bestFor: "Local investors",
      notes: "Japan-local estimate requiring Japanese fee-table confirmation before production use.",
      sourceLabel: "SBI Securities fees",
      sourceUrl: "https://www.sbisec.co.jp/",
      lastChecked: checkedDate,
      dataQuality: "prototype-estimate"
    },
    {
      name: "Rakuten Securities",
      region: "Japan",
      currencyCode: "JPY",
      currencySymbol: "¥",
      feeLabel: "Domestic stock fee estimate: ¥0 on eligible online plans",
      feeModel: "flat",
      flatFee: 0,
      speed: "Instant",
      fractional: false,
      bestFor: "Beginners",
      notes: "Japan-local estimate requiring Japanese fee-table confirmation before production use.",
      sourceLabel: "Rakuten Securities fees",
      sourceUrl: "https://www.rakuten-sec.co.jp/web/commission/",
      lastChecked: checkedDate,
      dataQuality: "prototype-estimate"
    },
    {
      name: "Matsui Securities",
      region: "Japan",
      currencyCode: "JPY",
      currencySymbol: "¥",
      feeLabel: "Domestic stock fee estimate: tiered by daily contract amount",
      feeModel: "flat",
      flatFee: 0,
      speed: "Instant",
      fractional: false,
      bestFor: "Local equities",
      notes: "Japan-local estimate requiring Japanese fee-table confirmation before production use.",
      sourceLabel: "Matsui fees",
      sourceUrl: "https://www.matsui.co.jp/service/fee/",
      lastChecked: checkedDate,
      dataQuality: "prototype-estimate"
    },
    {
      name: "Monex",
      region: "Japan",
      currencyCode: "JPY",
      currencySymbol: "¥",
      feeLabel: "Domestic stock fee estimate: plan-based online commission",
      feeModel: "flat",
      flatFee: 55,
      speed: "Instant",
      fractional: false,
      bestFor: "US stocks",
      notes: "Japan-local estimate requiring Japanese fee-table confirmation before production use.",
      sourceLabel: "Monex fees",
      sourceUrl: "https://info.monex.co.jp/service/fee/",
      lastChecked: checkedDate,
      dataQuality: "prototype-estimate"
    },
    {
      name: "Interactive Brokers",
      region: "Japan",
      currencyCode: "JPY",
      currencySymbol: "¥",
      feeLabel: "0.05% tiered, minimum ¥80 for Japan shares",
      feeModel: "minimum-percent",
      minimumFee: 80,
      percentFee: 0.0005,
      speed: "Instant",
      fractional: true,
      bestFor: "Global access",
      notes: "Published Japan tiered estimate from IBKR Asia-Pacific commission table.",
      sourceLabel: "IBKR Japan commissions",
      sourceUrl: "https://www.interactivebrokers.com.au/en/pricing/commissions-stocks-asia-pacific.php",
      lastChecked: checkedDate,
      dataQuality: "source-backed"
    }
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

  if (broker.feeModel === "bounded-percent") {
    const percentageFee = safeAmount * (broker.percentFee ?? 0);
    fee = Math.min(broker.maximumFee ?? percentageFee, Math.max(broker.minimumFee ?? 0, percentageFee));
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