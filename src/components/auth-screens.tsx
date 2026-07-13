"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, CheckCircle2, KeyRound, Lock, Mail, ShieldCheck, Sparkles, UserPlus } from "lucide-react";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { DemoNotice } from "@/components/demo-notice";
import {
  authenticateDemoAccount,
  createSession,
  demoAccounts,
  getAccessSummary,
  planStorageKey,
  sessionStorageKey,
  type AccountPlan,
  type OnboardingChoice
} from "@/lib/auth";

const onboardingOptions: { label: string; value: OnboardingChoice; description: string }[] = [
  { label: "I am new to investing", value: "new", description: "Use plain-English explanations and practice-first prompts." },
  { label: "I already invest", value: "investor", description: "Show more detail while keeping demo data clear." },
  { label: "I am just exploring", value: "exploring", description: "Let you browse without pressure to build a portfolio." }
];

function saveSession(session: ReturnType<typeof createSession>) {
  window.localStorage.setItem(sessionStorageKey, JSON.stringify(session));
  window.localStorage.setItem(planStorageKey, session.plan);
  window.dispatchEvent(new Event("quantum-auth-change"));
}

export function AuthPanel({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [email, setEmail] = useState(mode === "login" ? "free@test.com" : "");
  const [password, setPassword] = useState(mode === "login" ? "Demo123!" : "");
  const [name, setName] = useState("");
  const [plan, setPlan] = useState<AccountPlan>("Free");
  const [onboarding, setOnboarding] = useState<OnboardingChoice>("new");
  const [practiceJourney, setPracticeJourney] = useState(false);
  const [message, setMessage] = useState("");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (mode === "login") {
      const account = authenticateDemoAccount(email, password);
      if (!account) {
        setMessage("Use free@test.com or premium@test.com with password Demo123! for this prototype.");
        return;
      }
      saveSession(createSession({ email: account.email, name: account.name, plan: account.plan, onboarding, practiceJourney }));
      router.push("/");
      return;
    }

    if (!email.includes("@") || password.length < 6) {
      setMessage("Enter a demonstration email and a password of at least six characters.");
      return;
    }

    saveSession(createSession({ email, name, plan, onboarding, practiceJourney }));
    router.push("/");
  }

  function fillDemo(accountPlan: AccountPlan) {
    const account = demoAccounts.find((item) => item.plan === accountPlan);
    if (!account) return;
    setEmail(account.email);
    setPassword(account.password);
    setPlan(account.plan);
    setMessage(`${account.plan} demo credentials filled in.`);
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="space-y-5">
          <Badge tone="ai">Local prototype access</Badge>
          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-white">Quantum Invest AI</h1>
            <p className="text-base leading-7 text-slate-300">
              Sign in or register for a local-only demo account. No production authentication, broker connection, payment flow or real-money trading is active.
            </p>
          </div>
          <DemoNotice />
          <Card>
            <h2 className="text-lg font-semibold text-white">Tester accounts</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {demoAccounts.map((account) => (
                <button
                  className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-left hover:border-sky-300/40 focus:outline-none focus:ring-2 focus:ring-sky-300"
                  key={account.email}
                  onClick={() => fillDemo(account.plan)}
                  type="button"
                >
                  <Badge tone={account.plan === "Premium" ? "premium" : "neutral"}>{account.plan}</Badge>
                  <p className="mt-3 text-sm font-semibold text-white">{account.email}</p>
                  <p className="mt-1 text-xs text-slate-400">Password: Demo123!</p>
                </button>
              ))}
            </div>
          </Card>
        </section>

        <Card>
          <div className="flex items-center justify-between gap-3">
            <div>
              <Badge tone={mode === "register" ? "premium" : "neutral"}>{mode === "login" ? "Login" : "Register"}</Badge>
              <h2 className="mt-3 text-2xl font-bold text-white">{mode === "login" ? "Welcome back" : "Create a demo profile"}</h2>
            </div>
            {mode === "login" ? <KeyRound className="h-8 w-8 text-sky-300" /> : <UserPlus className="h-8 w-8 text-violet-300" />}
          </div>

          <form className="mt-5 space-y-4" onSubmit={submit}>
            {mode === "register" ? (
              <label className="grid gap-1 text-sm font-semibold text-slate-300">
                Display name
                <input className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-300/20" onChange={(event) => setName(event.target.value)} value={name} />
              </label>
            ) : null}
            <label className="grid gap-1 text-sm font-semibold text-slate-300">
              Email
              <span className="relative">
                <Mail className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <input className="w-full rounded-xl border border-white/10 bg-slate-950 py-2 pl-10 pr-3 text-white outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-300/20" onChange={(event) => setEmail(event.target.value)} type="email" value={email} />
              </span>
            </label>
            <label className="grid gap-1 text-sm font-semibold text-slate-300">
              Password
              <span className="relative">
                <Lock className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <input className="w-full rounded-xl border border-white/10 bg-slate-950 py-2 pl-10 pr-3 text-white outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-300/20" onChange={(event) => setPassword(event.target.value)} type="password" value={password} />
              </span>
            </label>

            <div>
              <p className="mb-2 text-sm font-semibold text-slate-300">Onboarding option</p>
              <div className="grid gap-2">
                {onboardingOptions.map((option) => (
                  <button
                    className={`rounded-2xl border p-3 text-left focus:outline-none focus:ring-2 focus:ring-sky-300 ${onboarding === option.value ? "border-sky-300/50 bg-sky-300/15" : "border-white/10 bg-slate-950/50"}`}
                    key={option.value}
                    onClick={() => setOnboarding(option.value)}
                    type="button"
                  >
                    <span className="block text-sm font-semibold text-white">{option.label}</span>
                    <span className="mt-1 block text-xs text-slate-400">{option.description}</span>
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-950/45 p-3 text-sm text-slate-300">
              <input checked={practiceJourney} className="mt-1" onChange={(event) => setPracticeJourney(event.target.checked)} type="checkbox" />
              <span><strong className="text-white">Optional:</strong> offer a 7-day Practice Investing journey using virtual money.</span>
            </label>

            {mode === "register" ? (
              <div>
                <p className="mb-2 text-sm font-semibold text-slate-300">Prototype plan</p>
                <div className="grid grid-cols-2 gap-2">
                  {(["Free", "Premium"] as AccountPlan[]).map((item) => (
                    <button className={`rounded-xl border px-3 py-2 text-sm font-semibold ${plan === item ? "border-violet-300/50 bg-violet-500/20 text-violet-100" : "border-white/10 bg-slate-950 text-slate-300"}`} key={item} onClick={() => setPlan(item)} type="button">
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {message ? <p className="rounded-xl border border-sky-300/20 bg-sky-300/10 p-3 text-sm text-sky-100">{message}</p> : null}
            <Button className="w-full" type="submit">{mode === "login" ? "Login to prototype" : "Create demo account"}<ArrowRight className="ml-2 h-4 w-4" /></Button>
          </form>

          <div className="mt-5 flex flex-wrap gap-3 text-sm text-sky-200">
            <Link href={mode === "login" ? "/register" : "/login"}>{mode === "login" ? "Create a demo account" : "Already have a demo account"}</Link>
            <Link href="/forgot-password">Forgotten password demo</Link>
          </div>
        </Card>
      </div>
    </main>
  );
}

export function ForgotPasswordDemo() {
  const [email, setEmail] = useState("free@test.com");
  const [sent, setSent] = useState(false);
  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl space-y-5">
        <DemoNotice />
        <Card>
          <Badge tone="neutral">Demonstration only</Badge>
          <h1 className="mt-3 text-2xl font-bold text-white">Forgotten password</h1>
          <p className="mt-2 text-sm leading-6 text-slate-300">This screen simulates recovery. No email is sent and no production account exists.</p>
          <label className="mt-5 grid gap-1 text-sm font-semibold text-slate-300">
            Email
            <input className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-300/20" onChange={(event) => setEmail(event.target.value)} type="email" value={email} />
          </label>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button onClick={() => setSent(true)}>Send demo reset</Button>
            <Link className="inline-flex min-h-10 items-center text-sm font-semibold text-sky-200" href="/login">Back to login</Link>
          </div>
          {sent ? <p className="mt-4 rounded-xl border border-emerald-300/20 bg-emerald-300/10 p-3 text-sm text-emerald-100">Demo reset message prepared for {email}. Use Demo123! to continue testing.</p> : null}
        </Card>
      </div>
    </main>
  );
}

export function UpgradeDemo() {
  const router = useRouter();
  const [selected, setSelected] = useState<AccountPlan>("Premium");
  function applyUpgrade() {
    const raw = window.localStorage.getItem(sessionStorageKey);
    const existing = raw ? JSON.parse(raw) : null;
    const session = existing?.email
      ? { ...existing, plan: selected }
      : createSession({ email: "premium@test.com", name: "Premium Tester", plan: selected, onboarding: "exploring", practiceJourney: true });
    saveSession(session);
    router.push("/");
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-5">
        <DemoNotice />
        <Card className="border-violet-300/20 bg-violet-500/10">
          <Badge tone="premium">No real payment processing</Badge>
          <h1 className="mt-3 text-3xl font-bold text-white">Upgrade flow demonstration</h1>
          <p className="mt-2 text-sm leading-6 text-slate-300">This changes your local prototype plan only. It does not collect money, create a subscription or contact a payment service.</p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {(["Free", "Premium"] as AccountPlan[]).map((item) => (
              <button className={`rounded-2xl border p-4 text-left ${selected === item ? "border-violet-300/50 bg-violet-500/20" : "border-white/10 bg-slate-950/50"}`} key={item} onClick={() => setSelected(item)} type="button">
                <Badge tone={item === "Premium" ? "premium" : "neutral"}>{item}</Badge>
                <ul className="mt-3 space-y-2 text-sm text-slate-300">
                  {getAccessSummary(item).map((feature) => <li className="flex gap-2" key={feature}><CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-300" />{feature}</li>)}
                </ul>
              </button>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button onClick={applyUpgrade}><Sparkles className="mr-2 h-4 w-4" /> Apply demo plan</Button>
            <Button onClick={() => router.push("/")} variant="secondary">Cancel</Button>
          </div>
        </Card>
        <Card>
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 text-sky-300" />
            <p className="text-sm leading-6 text-slate-300">Prototype tester note: Premium unlocks Smart Alerts, complete AI insights, full scenario planner, broker comparison, AI Daily Report and complete Practice Investing views for local testing only.</p>
          </div>
        </Card>
      </div>
    </main>
  );
}

