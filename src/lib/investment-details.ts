import type { Investment } from "./market-data.ts";

export type TimeRange = "1D" | "1W" | "1M" | "3M" | "6M" | "1Y" | "5Y" | "Max";
export type ScenarioTerm = "Short Term" | "Medium Term" | "Long Term";
export type ScenarioStrength = "Strong outcome" | "Moderate outcome" | "Weak or loss outcome";
export type InvestorMode = "Beginner" | "Expert";

export type InvestmentScenario = {
  term: ScenarioTerm;
  strength: ScenarioStrength;
  finalValue: number;
  profitLoss: number;
  percentageChange: number;
  explanation: string;
};

export const timeRanges: TimeRange[] = ["1D", "1W", "1M", "3M", "6M", "1Y", "5Y", "Max"];

export function getRiskScore(asset: Investment) {
  const typeRisk = asset.type === "Crypto" ? 8.5 : asset.type === "Commodity" ? 6.2 : asset.type === "ETF" ? 4.2 : 5.5;
  const movementRisk = Math.min(3, Math.abs(asset.movement) * 0.42);
  const industryRisk = asset.industry === "Biotechnology" || asset.industry === "Artificial Intelligence and Robotics" ? 1.1 : 0;
  return Number(Math.min(10, typeRisk + movementRisk + industryRisk).toFixed(1));
}

export function getConfidence(asset: Investment) {
  const risk = getRiskScore(asset);
  return Math.max(54, Math.round(86 - risk * 3 + Math.min(8, Math.abs(asset.movement))));
}

export function getMarketStatusLabel(asset: Investment) {
  return asset.type === "Crypto" ? "Open 24/7" : "Demo status: market hours vary";
}

export function getChartPoints(asset: Investment, range: TimeRange) {
  const rangeScale: Record<TimeRange, number> = {
    "1D": 0.8,
    "1W": 1.1,
    "1M": 1.6,
    "3M": 2.2,
    "6M": 2.8,
    "1Y": 3.6,
    "5Y": 5.4,
    Max: 6.8
  };
  const seed = asset.symbol.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
  const risk = getRiskScore(asset);
  return Array.from({ length: 18 }, (_, index) => {
    const wave = Math.sin((seed + index * 19) / 15) * risk * rangeScale[range];
    const trend = asset.movement * index * 0.38 * rangeScale[range];
    return Number(Math.max(5, 100 + wave + trend).toFixed(2));
  });
}

export function generateScenarios(asset: Investment, amount: number) {
  const safeAmount = Number.isFinite(amount) && amount > 0 ? amount : 20;
  const risk = getRiskScore(asset);
  const momentum = asset.movement / 100;
  const base = asset.type === "ETF" ? 0.055 : asset.type === "Crypto" ? 0.12 : asset.type === "Commodity" ? 0.045 : 0.075;
  const terms: { term: ScenarioTerm; years: number; label: string }[] = [
    { term: "Short Term", years: 0.16, label: "about 1 day to 3 months" },
    { term: "Medium Term", years: 1.4, label: "about 3 months to 3 years" },
    { term: "Long Term", years: 5.5, label: "about 3 to 10 years" }
  ];
  const strengths: { strength: ScenarioStrength; multiplier: number }[] = [
    { strength: "Strong outcome", multiplier: 1.45 },
    { strength: "Moderate outcome", multiplier: 0.75 },
    { strength: "Weak or loss outcome", multiplier: -0.8 }
  ];

  return terms.flatMap(({ term, years, label }) =>
    strengths.map(({ strength, multiplier }) => {
      const projectedChange = (base * years + momentum * (0.7 + years / 3)) * multiplier + (risk / 100) * (multiplier < 0 ? -0.42 : 0.18);
      const finalValue = Number(Math.max(0, safeAmount * (1 + projectedChange)).toFixed(2));
      const profitLoss = Number((finalValue - safeAmount).toFixed(2));
      const percentageChange = Number(((profitLoss / safeAmount) * 100).toFixed(1));
      return {
        term,
        strength,
        finalValue,
        profitLoss,
        percentageChange,
        explanation: `${label}: ${asset.symbol} is modelled with ${risk}/10 demo risk and ${asset.movement >= 0 ? "positive" : "negative"} recent movement.`
      } satisfies InvestmentScenario;
    })
  );
}

export function getAiInsight(asset: Investment) {
  const movementText = asset.movement >= 0 ? "moved higher" : "moved lower";
  return {
    whatHappened: `${asset.name} ${movementText} by ${Math.abs(asset.movement).toFixed(2)}% in today's demonstration data.`,
    possibleReasons: asset.reason,
    relevantNews: `${asset.industry} headlines and global risk appetite are the main mock news inputs for this asset.`,
    monitor: `Watch price momentum, sector news, market status and whether the move is broad across ${asset.industry} or limited to ${asset.symbol}.`
  };
}

export function getKeyData(asset: Investment) {
  const risk = getRiskScore(asset);
  return [
    { label: "Asset type", value: asset.type },
    { label: "Market", value: asset.market },
    { label: "Region", value: asset.region },
    { label: "Demo risk", value: `${risk}/10` },
    { label: "Demo price", value: `$${asset.demoPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}` },
    { label: "Today", value: `${asset.movement >= 0 ? "+" : ""}${asset.movement.toFixed(2)}%` }
  ];
}

export function getRelatedInvestments(asset: Investment, allAssets: Investment[]) {
  return allAssets.filter((item) => item.symbol !== asset.symbol && (item.industry === asset.industry || item.type === asset.type)).slice(0, 4);
}
