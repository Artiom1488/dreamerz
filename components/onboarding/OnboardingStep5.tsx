"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { Caveat } from "next/font/google";
import { cn } from "@/lib/utils";

// Handwritten/script display font used for the logo mark, the page title,
// and each plan name — matches the marker-style script in the design.
const caveat = Caveat({ subsets: ["latin"], weight: ["600", "700"] });

type Plan = {
  id: string;
  name: string;
  price: number;
  stars: number;
  features: string[];
  popular?: boolean;
};

const plans: Plan[] = [
  {
    id: "dreamer",
    name: "Dreamer",
    price: 11,
    stars: 1,
    features: [
      "Fulfill 10 dreams every month",
      "Donate and collect one fulfilled dream every 3 days",
      "Gain 10x visibility with each fulfilled dream",
      "Get recognized by a community that values your contributions",
    ],
  },
  {
    id: "visionary",
    name: "Visionary",
    price: 44,
    stars: 2,
    popular: true,
    features: [
      "Fulfill 40 dreams every month",
      "Donate and collect 1 fulfilled dream daily",
      "Gain 15x visibility with each fulfilled dream",
      "Show your support level in community updates",
    ],
  },
  {
    id: "innovator",
    name: "Innovator",
    price: 88,
    stars: 3,
    features: [
      "Fulfill 80 dreams every month",
      "Donate and collect 3 fulfilled dreams daily",
      "Gain 20x visibility with each fulfilled dream",
      "Show your support level with a recognition badge",
      "Accelerate your dream",
    ],
  },
  {
    id: "luminary",
    name: "Luminary",
    price: 440,
    stars: 4,
    features: [
      "Fulfill 400 dreams every month",
      "Donate and collect 14 fulfilled dreams daily",
      "Gain 25x visibility with each fulfilled dream",
      "Show your support level with a recognition badge",
      "Earn prominent recognition in the community",
    ],
  },
];

// Fifth, partially-revealed "build your own" tier — a nice peek-of-the-next-card
// carousel effect, same as the reference design.
const customPlan = {
  id: "custom",
  name: "Dreamweaver",
  stars: 5,
  features: [
    "Increase your visibility beyond the standard tiers",
    "Get early access to new features",
    "Partner with the Dreamerz team on initiatives",
    "Promote your own campaigns to the community",
  ],
};

function StarRow({ count }: { count: number }) {
  return (
    <div className="mb-3 flex gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <Sparkles key={i} className="h-4 w-4 text-amber-400" fill="currentColor" />
      ))}
    </div>
  );
}

function FeatureList({ features }: { features: string[] }) {
  return (
    <ul className="mb-6 flex-1 space-y-2.5">
      {features.map((feature) => (
        <li key={feature} className="flex items-start gap-2 text-[13px] leading-snug text-neutral-500">
          <span className="mt-[7px] h-1 w-1 flex-shrink-0 rounded-full bg-neutral-400" />
          {feature}
        </li>
      ))}
    </ul>
  );
}

function PlanCard({ plan, onSubscribe }: { plan: Plan; onSubscribe: (id: string) => void }) {
  return (
    <div className="relative w-[220px] flex-shrink-0 snap-start">
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
          most chosen
        </div>
      )}
      <div
        className={cn(
          "flex h-full flex-col rounded-2xl border bg-white p-5 pt-7",
          plan.popular ? "border-teal-300" : "border-neutral-200"
        )}
      >
        <StarRow count={plan.stars} />
        <h3 className={cn(caveat.className, "mb-1 text-2xl text-[#b98fd0]")}>{plan.name}</h3>
        <p className="mb-4 text-lg font-semibold text-neutral-900">
          {plan.price}$ <span className="text-sm font-normal text-neutral-400">/ month</span>
        </p>
        <FeatureList features={plan.features} />
        <button
          type="button"
          onClick={() => onSubscribe(plan.id)}
          className="w-full rounded-full bg-gradient-to-r from-[#8fe3c0] via-[#d7f0dc] to-[#f5e6a3] py-2.5 text-sm font-medium text-neutral-800 transition-opacity hover:opacity-90"
        >
          Subscribe
        </button>
      </div>
    </div>
  );
}

function CustomPlanCard({ plan }: { plan: typeof customPlan }) {
  const [amount, setAmount] = useState("");

  return (
    <div className="w-[220px] flex-shrink-0 snap-start">
      <div className="flex h-full flex-col rounded-2xl border border-neutral-200 bg-white p-5 pt-7">
        <StarRow count={plan.stars} />
        <h3 className={cn(caveat.className, "mb-1 text-2xl text-[#b98fd0]")}>{plan.name}</h3>
        <p className="mb-4 text-lg font-semibold text-neutral-900">custom</p>
        <FeatureList features={plan.features} />
        <div className="flex items-center gap-2">
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="$ amount"
            className="w-full rounded-full border border-neutral-200 px-4 py-2.5 text-sm text-neutral-700 outline-none focus:border-neutral-400"
          />
          <button
            type="button"
            aria-label="Confirm custom amount"
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 transition-colors hover:bg-neutral-200"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingStep5({
  step = 5,
  totalSteps = 5,
  onBack,
  onSubscribe,
  onSkip,
}: {
  step?: number;
  totalSteps?: number;
  onBack?: () => void;
  onSubscribe?: (planId: string) => void;
  onSkip?: () => void;
}) {
  return (
    <div className="min-h-screen bg-neutral-100 px-4 py-10">
      <div className="mx-auto max-w-6xl rounded-[28px] bg-white p-8 sm:p-12">
        {/* Header: back button + progress rule + step counter */}
        <div className="mb-10 flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 rounded-full bg-neutral-100 px-4 py-2 text-sm text-neutral-600 transition-colors hover:bg-neutral-200"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            back
          </button>
          <div className="h-px flex-1 bg-neutral-200" />
          <span className="text-sm text-neutral-400">
            step {step} of {totalSteps}
          </span>
        </div>

        {/* Logo mark */}
        <div className="mb-6 flex flex-col items-center gap-1">
          <div className="relative">
            <svg width="44" height="18" viewBox="0 0 44 18" fill="none" className="text-neutral-900">
              <path
                d="M2 16C10 2 34 2 42 16"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
            <Sparkles className="absolute -right-2 -top-1.5 h-3 w-3 text-neutral-900" fill="currentColor" />
          </div>
          <span className="text-xs font-bold tracking-[0.25em] text-neutral-900">DREAMERZ</span>
        </div>

        {/* Title + subtitle */}
        <h1 className={cn(caveat.className, "mb-5 text-center text-5xl text-neutral-900 sm:text-6xl")}>
          Your Dream Realization Plan
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-center text-[15px] leading-relaxed text-slate-400">
          Every $1 donated represents a fulfilled dream collected towards realizing your own dreams
          while boosting their visibility worldwide. The more you give the more your support network
          grows, allowing you to achieve your dreams faster, while funding only half.
        </p>

        {/* Plan cards — horizontally scrollable so the 5th card peeks at the edge */}
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} onSubscribe={onSubscribe ?? (() => {})} />
          ))}
          <CustomPlanCard plan={customPlan} />
        </div>

        {/* Skip link */}
        <button
          type="button"
          onClick={onSkip}
          className="mx-auto mt-10 block text-sm text-sky-300 transition-colors hover:text-sky-400 hover:underline"
        >
          Skip for 7 days
        </button>
      </div>
    </div>
  );
}