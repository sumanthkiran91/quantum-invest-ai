export type MarketTiming = {
  flag: string;
  country: string;
  market: string;
  timeZone: string;
  openHour: number;
  closeHour: number;
  crypto?: boolean;
};

export const marketTimings: MarketTiming[] = [
  { flag: "🇺🇸", country: "USA", market: "NYSE / NASDAQ", timeZone: "America/New_York", openHour: 9.5, closeHour: 16 },
  { flag: "🇦🇺", country: "Australia", market: "ASX", timeZone: "Australia/Sydney", openHour: 10, closeHour: 16 },
  { flag: "🇮🇳", country: "India", market: "NSE / BSE", timeZone: "Asia/Kolkata", openHour: 9.25, closeHour: 15.5 },
  { flag: "🇬🇧", country: "UK", market: "London Stock Exchange", timeZone: "Europe/London", openHour: 8, closeHour: 16.5 },
  { flag: "🇪🇺", country: "Europe", market: "Euronext", timeZone: "Europe/Paris", openHour: 9, closeHour: 17.5 },
  { flag: "🇯🇵", country: "Japan", market: "Tokyo Stock Exchange", timeZone: "Asia/Tokyo", openHour: 9, closeHour: 15 },
  { flag: "₿", country: "Crypto", market: "Crypto markets", timeZone: "UTC", openHour: 0, closeHour: 24, crypto: true }
];

function getTimeParts(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).formatToParts(date);
  const value = (type: string) => parts.find((part) => part.type === type)?.value ?? "0";
  return {
    weekday: value("weekday"),
    hour: Number(value("hour")),
    minute: Number(value("minute"))
  };
}

function formatHour(decimalHour: number) {
  const hour = Math.floor(decimalHour);
  const minute = Math.round((decimalHour - hour) * 60);
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function getMarketStatus(market: MarketTiming, now = new Date()) {
  if (market.crypto) {
    return { status: "Open", localTime: "24/7", nextEvent: "Always open" };
  }

  const parts = getTimeParts(now, market.timeZone);
  const current = parts.hour + parts.minute / 60;
  const isWeekend = parts.weekday === "Sat" || parts.weekday === "Sun";
  const isOpen = !isWeekend && current >= market.openHour && current < market.closeHour;

  return {
    status: isOpen ? "Open" : "Closed",
    localTime: `${String(parts.hour).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}`,
    nextEvent: isOpen ? `Closes ${formatHour(market.closeHour)}` : `Opens ${formatHour(market.openHour)}`
  };
}
