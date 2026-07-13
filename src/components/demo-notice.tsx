import { ShieldAlert } from "lucide-react";

export function DemoNotice() {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-sky-300/15 bg-sky-300/5 px-3 py-2 text-xs text-sky-100">
      <ShieldAlert aria-hidden="true" className="mt-0.5 h-4 w-4 flex-none" />
      <p className="leading-5">
        Prototype only: market data may be live, delayed or demonstration data and is labelled in the app. Accounts,
        alerts, AI insights, scenarios and Premium states are prototype-only. No broker, payment or real-money trading
        connection is active.
      </p>
    </div>
  );
}
