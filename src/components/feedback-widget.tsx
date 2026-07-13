"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Send, X } from "lucide-react";
import { Button } from "@/components/button";
import { createFeedbackId, feedbackStorageKey, validateFeedback, type FeedbackKind, type TesterFeedback } from "@/lib/feedback";

const kinds: FeedbackKind[] = ["General Feedback", "Report an Issue", "Suggest an Improvement"];
const easeOptions: TesterFeedback["easyToUnderstand"][] = ["Yes", "Somewhat", "No"];
const payOptions: TesterFeedback["wouldPay"][] = ["Yes", "Maybe", "No"];

function getCurrentPage() {
  if (typeof window === "undefined") return "/";
  return window.location.pathname || "/";
}

function readFeedback() {
  const raw = window.localStorage.getItem(feedbackStorageKey);
  if (!raw) return [];
  const parsed = JSON.parse(raw) as TesterFeedback[];
  return Array.isArray(parsed) ? parsed : [];
}

export function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<Omit<TesterFeedback, "id" | "createdAt">>({
    kind: "General Feedback",
    page: "/",
    easyToUnderstand: "Yes",
    likedMost: "",
    confusing: "",
    shouldAdd: "",
    shouldRemove: "",
    failed: "",
    wouldPay: "Maybe",
    comments: "",
    consentAccepted: false
  });

  useEffect(() => {
    if (open) {
      setForm((current) => ({ ...current, page: getCurrentPage() }));
      setSaved(false);
      setError("");
    }
  }, [open]);

  function updateField<Key extends keyof typeof form>(key: Key, value: (typeof form)[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const feedback: TesterFeedback = {
      ...form,
      id: createFeedbackId(),
      createdAt: new Date().toISOString()
    };

    if (!validateFeedback(feedback)) {
      setError("Please confirm tester consent and keep the page field filled in.");
      return;
    }

    const items = readFeedback();
    window.localStorage.setItem(feedbackStorageKey, JSON.stringify([feedback, ...items]));
    setSaved(true);
    setError("");
  }

  return (
    <>
      <button
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full border border-sky-300/35 bg-sky-400 px-4 py-3 text-sm font-bold text-slate-950 shadow-premium hover:bg-sky-300 focus:outline-none focus:ring-2 focus:ring-white"
        onClick={() => setOpen(true)}
        type="button"
      >
        <MessageSquare className="h-4 w-4" /> Feedback
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 px-4 py-6 backdrop-blur" role="dialog" aria-modal="true" aria-label="Tester feedback form">
          <div className="mx-auto max-w-3xl rounded-2xl border border-quantum-border bg-quantum-card p-5 shadow-premium">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-200">Prototype tester feedback</p>
                <h2 className="mt-2 text-2xl font-bold text-white">Help improve Quantum Invest AI</h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Feedback is stored locally in this browser for prototype review. Do not include private financial details, passwords or real account information.
                </p>
              </div>
              <button aria-label="Close feedback form" className="rounded-full border border-white/10 p-2 text-slate-300 hover:bg-slate-800" onClick={() => setOpen(false)} type="button">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 grid gap-3 rounded-2xl border border-sky-300/20 bg-sky-300/10 p-4 text-sm text-sky-100 md:grid-cols-3">
              <p><strong>Tester consent:</strong> you agree this is a prototype test.</p>
              <p><strong>Demo data:</strong> all market data is educational only.</p>
              <p><strong>Privacy:</strong> responses stay in local browser storage.</p>
            </div>

            {saved ? (
              <div className="mt-5 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-emerald-100">
                Feedback saved locally. Thank you for testing.
              </div>
            ) : (
              <form className="mt-5 space-y-4" onSubmit={submit}>
                <div className="grid gap-3 md:grid-cols-3">
                  {kinds.map((kind) => (
                    <button className={`rounded-2xl border p-3 text-left text-sm font-semibold ${form.kind === kind ? "border-sky-300/50 bg-sky-300/15 text-sky-100" : "border-white/10 bg-slate-950 text-slate-300"}`} key={kind} onClick={() => updateField("kind", kind)} type="button">
                      {kind}
                    </button>
                  ))}
                </div>

                <label className="grid gap-1 text-sm font-semibold text-slate-300">
                  Which page were you viewing?
                  <input className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-300/20" onChange={(event) => updateField("page", event.target.value)} value={form.page} />
                </label>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-1 text-sm font-semibold text-slate-300">
                    Was the page easy to understand?
                    <select className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white" onChange={(event) => updateField("easyToUnderstand", event.target.value as TesterFeedback["easyToUnderstand"])} value={form.easyToUnderstand}>
                      {easeOptions.map((option) => <option key={option}>{option}</option>)}
                    </select>
                  </label>
                  <label className="grid gap-1 text-sm font-semibold text-slate-300">
                    Would you consider paying for this service?
                    <select className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white" onChange={(event) => updateField("wouldPay", event.target.value as TesterFeedback["wouldPay"])} value={form.wouldPay}>
                      {payOptions.map((option) => <option key={option}>{option}</option>)}
                    </select>
                  </label>
                </div>

                {[
                  ["likedMost", "Which feature did you like most?"],
                  ["confusing", "What was confusing?"],
                  ["shouldAdd", "What should be added?"],
                  ["shouldRemove", "What should be removed?"],
                  ["failed", "Did anything fail?"],
                  ["comments", "Free-text comments"]
                ].map(([key, label]) => (
                  <label className="grid gap-1 text-sm font-semibold text-slate-300" key={key}>
                    {label}
                    <textarea className="min-h-20 rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-300/20" onChange={(event) => updateField(key as keyof typeof form, event.target.value as never)} value={form[key as keyof typeof form] as string} />
                  </label>
                ))}

                <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-950/50 p-3 text-sm text-slate-300">
                  <input checked={form.consentAccepted} className="mt-1" onChange={(event) => updateField("consentAccepted", event.target.checked)} type="checkbox" />
                  <span>I consent to storing this prototype feedback locally in this browser for testing review.</span>
                </label>

                {error ? <p className="rounded-xl border border-red-300/20 bg-red-500/10 p-3 text-sm text-red-100">{error}</p> : null}
                <div className="flex flex-wrap gap-3">
                  <Button type="submit"><Send className="mr-2 h-4 w-4" /> Save feedback</Button>
                  <Button onClick={() => setOpen(false)} type="button" variant="secondary">Cancel</Button>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
