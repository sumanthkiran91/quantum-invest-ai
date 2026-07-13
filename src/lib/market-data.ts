export type Industry =
  | "Technology"
  | "Healthcare"
  | "Private Finance"
  | "Government Finance"
  | "Insurance"
  | "Cryptocurrency"
  | "Artificial Intelligence and Robotics"
  | "Energy"
  | "Renewable Energy"
  | "Automotive"
  | "Retail"
  | "Real Estate"
  | "Pharmaceuticals"
  | "Biotechnology"
  | "Telecommunications"
  | "Manufacturing"
  | "Defence and Aerospace"
  | "Commodities";

export type Region = "Global" | "USA" | "Australia" | "India" | "UK" | "Europe" | "Japan";

export type AssetType = "Share" | "Crypto" | "ETF" | "Commodity";

export type Investment = {
  symbol: string;
  name: string;
  industry: Industry;
  region: Region;
  market: string;
  type: AssetType;
  demoPrice: number;
  movement: number;
  reason: string;
};

export const industries: Industry[] = [
  "Technology",
  "Healthcare",
  "Private Finance",
  "Government Finance",
  "Insurance",
  "Cryptocurrency",
  "Artificial Intelligence and Robotics",
  "Energy",
  "Renewable Energy",
  "Automotive",
  "Retail",
  "Real Estate",
  "Pharmaceuticals",
  "Biotechnology",
  "Telecommunications",
  "Manufacturing",
  "Defence and Aerospace",
  "Commodities"
];

export const regions: Region[] = ["Global", "USA", "Australia", "India", "UK", "Europe", "Japan"];

export const marketOverview = [
  { name: "S&P 500", value: "6,124.28", movement: 0.64 },
  { name: "NASDAQ", value: "20,183.77", movement: 0.91 },
  { name: "Dow Jones", value: "44,208.43", movement: -0.18 },
  { name: "ASX 200", value: "8,214.60", movement: 0.32 },
  { name: "FTSE 100", value: "8,781.14", movement: -0.11 },
  { name: "Nifty 50", value: "25,346.70", movement: 0.47 },
  { name: "Nikkei 225", value: "40,041.12", movement: -0.26 },
  { name: "Bitcoin", value: "$118,420", movement: 1.84 },
  { name: "Ethereum", value: "$3,285", movement: 2.16 }
];

const seedInvestments: Investment[] = [
  { symbol: "NVDA", name: "Nvidia", industry: "Artificial Intelligence and Robotics", region: "USA", market: "NASDAQ", type: "Share", demoPrice: 184.22, movement: 4.8, reason: "AI chip demand stayed strong in demo earnings assumptions." },
  { symbol: "ROBO", name: "Global Robotics ETF", industry: "Artificial Intelligence and Robotics", region: "Global", market: "NYSE Arca", type: "ETF", demoPrice: 72.44, movement: 3.2, reason: "Automation suppliers gained across several regions." },
  { symbol: "TSLA", name: "Tesla", industry: "Automotive", region: "USA", market: "NASDAQ", type: "Share", demoPrice: 321.18, movement: -2.6, reason: "Margin worries weighed on the auto group." },
  { symbol: "BTC", name: "Bitcoin", industry: "Cryptocurrency", region: "Global", market: "Crypto", type: "Crypto", demoPrice: 118420, movement: 1.84, reason: "Risk appetite improved in the demonstration crypto basket." },
  { symbol: "ETH", name: "Ethereum", industry: "Cryptocurrency", region: "Global", market: "Crypto", type: "Crypto", demoPrice: 3285, movement: 2.16, reason: "Network activity and ETF interest improved in mock data." },
  { symbol: "SOL", name: "Solana", industry: "Cryptocurrency", region: "Global", market: "Crypto", type: "Crypto", demoPrice: 181.7, movement: -3.1, reason: "Profit-taking followed a strong weekly rise." },
  { symbol: "AAPL", name: "Apple", industry: "Technology", region: "USA", market: "NASDAQ", type: "Share", demoPrice: 226.74, movement: 1.2, reason: "Device demand estimates improved." },
  { symbol: "MSFT", name: "Microsoft", industry: "Technology", region: "USA", market: "NASDAQ", type: "Share", demoPrice: 508.12, movement: 1.9, reason: "Cloud and AI software assumptions lifted sentiment." },
  { symbol: "ASML", name: "ASML Holding", industry: "Technology", region: "Europe", market: "Euronext", type: "Share", demoPrice: 913.55, movement: -1.4, reason: "Semiconductor equipment orders cooled in demo data." },
  { symbol: "CSL", name: "CSL Limited", industry: "Healthcare", region: "Australia", market: "ASX", type: "Share", demoPrice: 296.43, movement: 2.1, reason: "Healthcare defensives attracted steady interest." },
  { symbol: "UNH", name: "UnitedHealth", industry: "Healthcare", region: "USA", market: "NYSE", type: "Share", demoPrice: 512.8, movement: -2.2, reason: "Cost assumptions pressured insurer-linked healthcare names." },
  { symbol: "JPM", name: "JPMorgan Chase", industry: "Private Finance", region: "USA", market: "NYSE", type: "Share", demoPrice: 247.18, movement: 0.8, reason: "Large bank earnings remained resilient." },
  { symbol: "CBA", name: "Commonwealth Bank", industry: "Private Finance", region: "Australia", market: "ASX", type: "Share", demoPrice: 137.42, movement: -0.7, reason: "Mortgage margin expectations eased." },
  { symbol: "GOVT", name: "Global Government Bond ETF", industry: "Government Finance", region: "Global", market: "NYSE Arca", type: "ETF", demoPrice: 23.16, movement: 0.4, reason: "Bond prices firmed as yields softened." },
  { symbol: "TLT", name: "Long Treasury ETF", industry: "Government Finance", region: "USA", market: "NASDAQ", type: "ETF", demoPrice: 91.72, movement: -0.5, reason: "Long-duration bonds lagged shorter maturities." },
  { symbol: "AIA", name: "AIA Group", industry: "Insurance", region: "Global", market: "HKEX", type: "Share", demoPrice: 68.44, movement: 1.1, reason: "Insurance demand assumptions improved." },
  { symbol: "ALL", name: "Allstate", industry: "Insurance", region: "USA", market: "NYSE", type: "Share", demoPrice: 178.21, movement: -1.8, reason: "Claims cost assumptions moved higher." },
  { symbol: "XOM", name: "Exxon Mobil", industry: "Energy", region: "USA", market: "NYSE", type: "Share", demoPrice: 119.32, movement: 1.5, reason: "Oil price assumptions rose modestly." },
  { symbol: "BP", name: "BP", industry: "Energy", region: "UK", market: "LSE", type: "Share", demoPrice: 4.81, movement: -0.9, reason: "Refining margin assumptions softened." },
  { symbol: "ENPH", name: "Enphase Energy", industry: "Renewable Energy", region: "USA", market: "NASDAQ", type: "Share", demoPrice: 84.38, movement: 3.7, reason: "Solar demand outlook improved from a low base." },
  { symbol: "NEE", name: "NextEra Energy", industry: "Renewable Energy", region: "USA", market: "NYSE", type: "Share", demoPrice: 78.46, movement: -1.1, reason: "Rate sensitivity weighed on utilities." },
  { symbol: "TM", name: "Toyota Motor", industry: "Automotive", region: "Japan", market: "TSE", type: "Share", demoPrice: 2879, movement: 1.3, reason: "Hybrid demand assumptions supported the group." },
  { symbol: "AMZN", name: "Amazon", industry: "Retail", region: "USA", market: "NASDAQ", type: "Share", demoPrice: 231.55, movement: 2.3, reason: "Retail and cloud expectations improved." },
  { symbol: "WMT", name: "Walmart", industry: "Retail", region: "USA", market: "NYSE", type: "Share", demoPrice: 94.12, movement: -0.4, reason: "Defensive retail paused after a strong run." },
  { symbol: "VNQ", name: "US Real Estate ETF", industry: "Real Estate", region: "USA", market: "NYSE Arca", type: "ETF", demoPrice: 88.67, movement: 1.4, reason: "Lower yield assumptions helped property assets." },
  { symbol: "GMG", name: "Goodman Group", industry: "Real Estate", region: "Australia", market: "ASX", type: "Share", demoPrice: 33.18, movement: -0.8, reason: "Warehouse valuations cooled slightly." },
  { symbol: "PFE", name: "Pfizer", industry: "Pharmaceuticals", region: "USA", market: "NYSE", type: "Share", demoPrice: 28.42, movement: 0.9, reason: "Pipeline update assumptions improved." },
  { symbol: "AZN", name: "AstraZeneca", industry: "Pharmaceuticals", region: "UK", market: "LSE", type: "Share", demoPrice: 124.2, movement: -0.6, reason: "Investors rotated toward higher-growth healthcare names." },
  { symbol: "MRNA", name: "Moderna", industry: "Biotechnology", region: "USA", market: "NASDAQ", type: "Share", demoPrice: 44.77, movement: 4.1, reason: "Biotech trial assumptions lifted risk appetite." },
  { symbol: "REGN", name: "Regeneron", industry: "Biotechnology", region: "USA", market: "NASDAQ", type: "Share", demoPrice: 812.3, movement: -1.9, reason: "Large-cap biotech lagged smaller growth names." },
  { symbol: "VZ", name: "Verizon", industry: "Telecommunications", region: "USA", market: "NYSE", type: "Share", demoPrice: 42.53, movement: 0.7, reason: "Cash-flow assumptions stayed stable." },
  { symbol: "BT.A", name: "BT Group", industry: "Telecommunications", region: "UK", market: "LSE", type: "Share", demoPrice: 1.96, movement: -1.2, reason: "Network investment costs remained a concern." },
  { symbol: "CAT", name: "Caterpillar", industry: "Manufacturing", region: "USA", market: "NYSE", type: "Share", demoPrice: 389.26, movement: 1.6, reason: "Industrial demand assumptions improved." },
  { symbol: "SIE", name: "Siemens", industry: "Manufacturing", region: "Europe", market: "Xetra", type: "Share", demoPrice: 184.91, movement: -0.9, reason: "Factory automation orders softened." },
  { symbol: "LMT", name: "Lockheed Martin", industry: "Defence and Aerospace", region: "USA", market: "NYSE", type: "Share", demoPrice: 478.63, movement: 1.8, reason: "Defence backlog assumptions improved." },
  { symbol: "BA", name: "Boeing", industry: "Defence and Aerospace", region: "USA", market: "NYSE", type: "Share", demoPrice: 189.37, movement: -2.4, reason: "Delivery timing worries weighed on aerospace." },
  { symbol: "GLD", name: "Gold Trust", industry: "Commodities", region: "Global", market: "NYSE Arca", type: "Commodity", demoPrice: 223.65, movement: 1.1, reason: "Gold gained as rate expectations eased." },
  { symbol: "USO", name: "Oil Fund", industry: "Commodities", region: "USA", market: "NYSE Arca", type: "Commodity", demoPrice: 79.28, movement: -1.5, reason: "Energy commodities pulled back after supply updates." }
];

function buildFallbackMover(industry: Industry, index: number, sign: 1 | -1): Investment {
  const symbol = `${industry.replace(/[^A-Z]/gi, "").slice(0, 4).toUpperCase()}${index + 1}`;
  return {
    symbol,
    name: `${industry} Demo ${sign > 0 ? "Leader" : "Lagger"} ${index + 1}`,
    industry,
    region: regions[(index % (regions.length - 1)) + 1],
    market: "Demo Exchange",
    type: industry === "Cryptocurrency" ? "Crypto" : industry === "Commodities" ? "Commodity" : "Share",
    demoPrice: 25 + index * 13 + industry.length,
    movement: sign * (0.8 + index * 0.7 + (industry.length % 5) * 0.2),
    reason: `${industry} moved on demonstration sentiment and sector rotation assumptions.`
  };
}

export function getInvestmentsForIndustry(industry: Industry, region: Region = "Global") {
  const matching = seedInvestments.filter(
    (item) => item.industry === industry && (region === "Global" || item.region === region || item.region === "Global")
  );
  const supplemented = [...matching];
  while (supplemented.filter((item) => item.movement > 0).length < 5) {
    supplemented.push(buildFallbackMover(industry, supplemented.length, 1));
  }
  while (supplemented.filter((item) => item.movement < 0).length < 5) {
    supplemented.push(buildFallbackMover(industry, supplemented.length, -1));
  }
  return supplemented;
}

export function getTopMovers(industry: Industry, region: Region = "Global") {
  const investments = getInvestmentsForIndustry(industry, region);
  return {
    growing: investments
      .filter((item) => item.movement > 0)
      .sort((a, b) => b.movement - a.movement)
      .slice(0, 5),
    losing: investments
      .filter((item) => item.movement < 0)
      .sort((a, b) => a.movement - b.movement)
      .slice(0, 5)
  };
}

export function findInvestment(symbol: string) {
  return seedInvestments.find((item) => item.symbol.toLowerCase() === symbol.toLowerCase()) ?? null;
}

export const watchlistPreview = ["NVDA", "BTC", "CSL", "GLD"];

export const newsAlerts = [
  "Demo alert: US technology names led global momentum.",
  "Demo news: Japan market closed lower after currency movement.",
  "Demo reminder: Crypto markets remain open 24/7."
];

export const aiSuggestions = [
  "Review AI and Robotics leaders for momentum, then compare risk before saving.",
  "Balance higher-growth demo assets with defensive sectors such as Healthcare.",
  "Use Practice Invest before acting on any unfamiliar asset type."
];


export const allInvestments = seedInvestments;
