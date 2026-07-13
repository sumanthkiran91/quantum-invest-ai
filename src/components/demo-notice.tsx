import { ShieldAlert } from "lucide-react";

export function DemoNotice() {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-sky-300/15 bg-sky-300/5 px-3 py-2 text-xs text-sky-100">
      <ShieldAlert aria-hidden="true" className="mt-0.5 h-4 w-4 flex-none" />
      <p className="leading-5">
        Display-data notice: prices and market movement may be live, delayed or demonstration data and are labelled in
        the app. AI insights, alerts, scenarios and broker fees are educational prototype estimates, not financial
        advice. No broker login, payment, order placement or real-money trading connection is active.
      </p>
    </div>
  );
}
