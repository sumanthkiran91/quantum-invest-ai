import { InvestmentDetailsDashboard } from "@/components/investment-details-dashboard";
import { findInvestment, type Investment } from "@/lib/market-data";

function createFallbackInvestment(symbol: string): Investment {
  return {
    symbol: symbol.toUpperCase(),
    name: `${symbol.toUpperCase()} Demo Asset`,
    industry: "Technology",
    region: "Global",
    market: "Demo Exchange",
    type: "Share",
    demoPrice: 42.5,
    movement: 0.8,
    reason: "This reusable page uses a fallback demonstration profile when the symbol is not in mock data."
  };
}

export default async function InvestmentDetailsPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;
  const decodedSymbol = decodeURIComponent(symbol);
  const asset = findInvestment(decodedSymbol) ?? createFallbackInvestment(decodedSymbol);

  return <InvestmentDetailsDashboard asset={asset} />;
}
