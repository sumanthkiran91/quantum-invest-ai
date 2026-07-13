import { ShieldAlert } from "lucide-react";

export function DemoNotice() {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-sky-300/20 bg-sky-300/10 p-4 text-sm text-sky-100">
      <ShieldAlert aria-hidden="true" className="mt-0.5 h-5 w-5 flex-none" />
      <p>
        Prototype only: all prices, alerts, AI insights, investment scenarios, accounts, and Premium states use
        demonstration data. No broker, payment, live market, or real-money trading connection is active.
      </p>
    </div>
  );
}
