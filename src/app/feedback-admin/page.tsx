"use client";

import { useEffect, useState } from "react";
import { Download, RefreshCw, Trash2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { feedbackStorageKey, summarizeFeedback, type TesterFeedback } from "@/lib/feedback";

function readFeedback() {
  const raw = window.localStorage.getItem(feedbackStorageKey);
  if (!raw) return [];
  const parsed = JSON.parse(raw) as TesterFeedback[];
  return Array.isArray(parsed) ? parsed : [];
}

export default function FeedbackAdminPage() {
  const [items, setItems] = useState<TesterFeedback[]>([]);
  const summary = summarizeFeedback(items);

  function refresh() {
    setItems(readFeedback());
  }

  function clearAll() {
    window.localStorage.removeItem(feedbackStorageKey);
    setItems([]);
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "quantum-invest-ai-feedback.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <AppShell active="Dashboard" title="Feedback Viewer">
      <Card className="border-sky-300/20 bg-slate-950/35">
        <Badge tone="ai">Local prototype admin</Badge>
        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Tester Feedback Viewer</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              Feedback is stored only in this browser. Use this page during friends-and-family testing to review comments, issues and improvement suggestions.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={refresh} variant="secondary"><RefreshCw className="mr-2 h-4 w-4" /> Refresh</Button>
            <Button onClick={exportJson} variant="secondary"><Download className="mr-2 h-4 w-4" /> Export JSON</Button>
            <Button onClick={clearAll} variant="secondary"><Trash2 className="mr-2 h-4 w-4" /> Clear</Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-4">
        <Card><p className="text-xs text-slate-400">Total responses</p><p className="mt-1 text-2xl font-bold text-white">{summary.total}</p></Card>
        <Card><p className="text-xs text-slate-400">Paying interest</p><p className="mt-1 text-2xl font-bold text-emerald-300">{summary.payingInterest}</p></Card>
        <Card><p className="text-xs text-slate-400">Issues</p><p className="mt-1 text-2xl font-bold text-red-300">{summary.issues}</p></Card>
        <Card><p className="text-xs text-slate-400">Improvements</p><p className="mt-1 text-2xl font-bold text-sky-300">{summary.improvements}</p></Card>
      </div>

      {items.length === 0 ? (
        <Card>
          <h2 className="text-lg font-semibold text-white">No feedback yet</h2>
          <p className="mt-2 text-sm text-slate-400">Submit feedback from any page using the floating Feedback button.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <Card key={item.id}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <Badge tone={item.kind === "Report an Issue" ? "negative" : item.kind === "Suggest an Improvement" ? "ai" : "neutral"}>{item.kind}</Badge>
                    <Badge tone="neutral">{item.page}</Badge>
                    <Badge tone={item.wouldPay === "Yes" ? "positive" : "neutral"}>Would pay: {item.wouldPay}</Badge>
                  </div>
                  <p className="mt-3 text-sm text-slate-400">{new Date(item.createdAt).toLocaleString()}</p>
                </div>
                <p className="text-sm text-slate-300">Easy to understand: <strong className="text-white">{item.easyToUnderstand}</strong></p>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <p className="text-sm text-slate-300"><strong className="text-white">Liked:</strong> {item.likedMost || "Not provided"}</p>
                <p className="text-sm text-slate-300"><strong className="text-white">Confusing:</strong> {item.confusing || "Not provided"}</p>
                <p className="text-sm text-slate-300"><strong className="text-white">Add:</strong> {item.shouldAdd || "Not provided"}</p>
                <p className="text-sm text-slate-300"><strong className="text-white">Remove:</strong> {item.shouldRemove || "Not provided"}</p>
                <p className="text-sm text-slate-300"><strong className="text-white">Failed:</strong> {item.failed || "No failure reported"}</p>
                <p className="text-sm text-slate-300"><strong className="text-white">Comments:</strong> {item.comments || "Not provided"}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </AppShell>
  );
}
