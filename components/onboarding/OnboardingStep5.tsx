"use client";

import { ArrowLeft, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import { plans, customPlan, type Plan } from "@/data/mock-data/onboarding";
import { StarRow } from "@/constants/social-icons";
import type { OnboardingStep5Props } from "@/types/onboarding-types";
import { LogoIconBlack } from "@/constants/social-icons";

function FeatureList({ features }: { features: string[] }) {
  return (
    <ul className="mb-3 flex-1 space-y-1.5 sm:mb-4 sm:space-y-2 md:mb-6 md:space-y-2.5">
      {features.map((feature) => (
        <li
          key={feature}
          className="flex items-start gap-2 text-[10px] leading-snug text-neutral-500 sm:text-[11px] md:text-[13px]"
        >
          <span className="mt-[4px] h-1 w-1 flex-shrink-0 rounded-full bg-neutral-400 sm:mt-[5px] md:mt-[7px]" />
          {feature}
        </li>
      ))}
    </ul>
  );
}

function PlanCard({
  plan,
  onSubscribe,
}: {
  plan: Plan;
  onSubscribe: (id: string) => void;
}) {
  return (
    <div className="relative w-[140px] min-w-[140px] flex-1 snap-start sm:w-[160px] sm:min-w-[160px] md:w-[180px] md:min-w-[180px]">
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
          most chosen
        </div>
      )}
      <div
        className={cn(
          "flex h-full flex-col rounded-2xl border bg-white p-2.5 pt-4 sm:p-3 sm:pt-5 md:p-4 md:pt-7",
          plan.popular ? "border-teal-300" : "border-neutral-200",
        )}
      >
        <StarRow count={plan.stars} />
        <h3 className="mb-1 text-base font-indie-flower text-[#b98fd0] sm:text-lg md:text-xl">
          {plan.name}
        </h3>
        <p className="mb-2 text-sm font-semibold text-neutral-900 sm:mb-3 md:mb-4">
          {plan.price}${" "}
          <span className="text-xs font-normal text-neutral-400">/ month</span>
        </p>
        <FeatureList features={plan.features} />
        <Button
          type="button"
          onClick={() => onSubscribe(plan.id)}
          variant="gradient_fill"
          className="w-full"
          size="sm"
        >
          Subscribe
        </Button>
      </div>
    </div>
  );
}

function CustomPlanCard({ plan }: { plan: typeof customPlan }) {
  return (
    <div className="w-[140px] min-w-[140px] flex-1 snap-start sm:w-[160px] sm:min-w-[160px] md:w-[180px] md:min-w-[180px]">
      <div className="flex h-full flex-col rounded-2xl border border-neutral-200 bg-white p-2.5 pt-4 sm:p-3 sm:pt-5 md:p-4 md:pt-7">
        <StarRow count={plan.stars} />
        <h3 className="mb-1 text-base font-indie-flower text-[#b98fd0] sm:text-lg md:text-xl">
          {plan.name}
        </h3>
        <p className="mb-2 text-sm font-semibold text-neutral-900 sm:mb-3 md:mb-4">
          custom
        </p>
        <FeatureList features={plan.features} />
        <Button
          type="button"
          variant="gradient_fill"
          className="w-full"
          size="sm"
        >
          Contact us
        </Button>
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
}: OnboardingStep5Props) {
  return (
    <div className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-neutral-100 px-3 py-5 sm:px-4 sm:py-6 md:py-10">
      <div className="mx-auto max-w-6xl rounded-[28px] bg-white p-3 sm:p-4 md:p-8 lg:p-12">
        {/* Header: back button + progress rule + step counter */}
        <div className="mb-4 flex items-center gap-2 sm:mb-6 sm:gap-3 md:mb-10 md:gap-4">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-600 transition-colors hover:bg-neutral-200 sm:px-3 sm:py-1.5 sm:text-sm md:px-4 md:py-2"
          >
            <ArrowLeft className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            back
          </button>
          <div className="h-px flex-1 bg-neutral-200" />
          <span className="text-[10px] text-neutral-400 sm:text-xs md:text-sm">
            step {step} of {totalSteps}
          </span>
        </div>

        {/* Logo mark */}
        <div className="mb-3 flex flex-col items-center gap-1 sm:mb-4 md:mb-6">
          <LogoIconBlack className="h-5 w-auto sm:h-6 md:h-auto" />
        </div>

        {/* Title + subtitle */}
        <h1 className="mb-3 text-center font-indie-flower text-2xl text-neutral-900 sm:mb-4 sm:text-3xl md:mb-5 md:text-4xl lg:text-5xl xl:text-6xl">
          Your Dream Realization Plan
        </h1>
        <p className="mx-auto mb-4 max-w-2xl text-center text-[12px] leading-relaxed text-slate-400 sm:mb-6 sm:text-[13px] md:mb-10 md:text-[15px]">
          Every $1 donated represents a fulfilled dream collected towards
          realizing your own dreams while boosting their visibility worldwide.
          The more you give the more your support network grows, allowing you to
          achieve your dreams faster, while funding only half.
        </p>

        {/* Plan cards — horizontally scrollable so the 5th card peeks at the edge */}
        <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2 pt-2 sm:gap-3 sm:pb-2 sm:pt-3 md:gap-4 md:pt-4">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onSubscribe={onSubscribe ?? (() => {})}
            />
          ))}
          <CustomPlanCard plan={customPlan} />
        </div>

        {/* Skip link */}
        <button
          type="button"
          onClick={onSkip}
          className="mx-auto mt-4 flex items-center gap-1 text-sm text-sky-300 transition-colors hover:text-sky-400 hover:underline sm:mt-6 md:mt-10"
        >
          Skip for 7 days <MoveRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
