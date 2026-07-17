"use client";

import { ArrowLeft, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { plans, customPlan, type Plan } from "@/data/mock-data/onboarding";
import { StarRow } from "@/constants/social-icons";
import { LogoIconBlack } from "@/constants/social-icons";

function FeatureList({ features }: { features: string[] }) {
  return (
    <ul className="mb-2 flex-1 space-y-1 sm:mb-3 sm:space-y-1.5 md:mb-4 md:space-y-2">
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
    <div className="relative w-[140px] min-w-[140px] flex-1 snap-start sm:w-[160px] sm:min-w-[160px] md:w-[220px] md:min-w-[220px] lg:w-[240px] lg:min-w-[240px]">
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
    <div className="w-[140px] min-w-[140px] flex-1 snap-start sm:w-[160px] sm:min-w-[160px] md:w-[220px] md:min-w-[220px] lg:w-[240px] lg:min-w-[240px]">
      <div className="flex h-full flex-col rounded-2xl border border-neutral-200 bg-white p-2 pt-3 sm:p-2.5 sm:pt-4 md:p-3 md:pt-5">
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

const Pricing = () => {
  const router = useRouter();
  const handleSubscribe = (planId: string) => {
    console.log("Subscribe to plan:", planId);
    // TODO: Implement subscription logic
  };

  return (
    <div className="min-h-screen bg-[#efeef2] px-4 py-4 sm:px-6 sm:py-6 md:py-8">
      <div className="mx-auto w-full max-w-xl space-y-4 rounded-3xl bg-white p-4 shadow-[0_4px_24px_rgba(15,15,20,0.06)] sm:max-w-2xl sm:space-y-5 sm:p-6 md:max-w-3xl md:space-y-4 md:p-6 lg:max-w-5xl lg:p-6 xl:max-w-6xl">
        {/* Back button + line */}
        <div className="mb-3 flex items-center gap-2 sm:mb-4 sm:gap-3 md:mb-4 md:gap-3">
          <button
            type="button"
            onClick={() => router.push("/newsfeed")}
            className="flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-600 transition-colors hover:bg-neutral-200 sm:px-3 sm:py-1.5 sm:text-sm md:px-4 md:py-2"
          >
            <ArrowLeft className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            back
          </button>
          <div className="h-px flex-1 bg-neutral-200" />
        </div>

        {/* Logo mark */}
        <div className="mb-2 flex flex-col items-center gap-1 sm:mb-3 md:mb-3">
          <LogoIconBlack className="h-5 w-auto sm:h-6 md:h-auto" />
        </div>

        {/* Title + subtitle */}
        <h1 className="mb-2 text-center font-indie-flower text-2xl text-neutral-900 sm:mb-3 sm:text-3xl md:mb-3 md:text-4xl lg:text-[2.75rem]">
          Your Dream Realization Plan
        </h1>
        <p className="mx-auto mb-3 max-w-2xl text-center text-[12px] leading-relaxed text-slate-400 sm:mb-4 sm:text-[13px] md:mb-4 md:text-[15px]">
          Every $1 donated represents a fulfilled dream collected towards
          realizing your own dreams while boosting their visibility worldwide.
          The more you give the more your support network grows, allowing you to
          achieve your dreams faster, while funding only half.
        </p>

        {/* Plan cards — horizontally scrollable on all screen sizes, wider cards on larger screens */}
        <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1 pt-1 sm:gap-3 sm:pb-1 sm:pt-2 md:gap-4 md:overflow-x-auto md:pt-2 lg:gap-5 lg:pt-2">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} onSubscribe={handleSubscribe} />
          ))}
          <CustomPlanCard plan={customPlan} />
        </div>
      </div>
    </div>
  );
};

export default Pricing;
