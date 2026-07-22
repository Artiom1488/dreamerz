"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { customPlan, type Plan } from "@/data/mock-data/onboarding";
import { StarRow } from "@/constants/social-icons";

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

export function PlanCard({
  plan,
  onSubscribe,
}: {
  plan: Plan;
  onSubscribe: (id: string) => void;
}) {
  return (
    <div className="relative h-full">
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full border border-teal-200 bg-teal-50 px-2.5 py-1 text-[11px] font-medium text-teal-700 shadow-sm sm:px-3 sm:text-xs">
          most chosen
        </div>
      )}
      <div
        className={cn(
          "relative flex h-full flex-col rounded-2xl border bg-white/90 p-4 backdrop-blur-sm sm:p-5 md:p-6",
          plan.popular ? "border-teal-200" : "border-neutral-200/80",
        )}
      >
        <StarRow count={plan.stars} />
        <h3 className="mb-1 mt-2 text-lg font-indie-flower text-[#b98fd0] sm:text-xl md:text-2xl">
          {plan.name}
        </h3>
        <p className="mb-4 text-base font-semibold text-neutral-900 sm:mb-5 md:mb-6">
          {plan.price}${" "}
          <span className="text-xs font-normal text-neutral-400">/ month</span>
        </p>
        <FeatureList features={plan.features} />
        <Button
          type="button"
          onClick={() => onSubscribe(plan.id)}
          variant="gradient_fill"
          className="mt-4 w-full rounded-xl font-medium text-neutral-800"
          size="sm"
        >
          Subscribe
        </Button>
      </div>
    </div>
  );
}

export function CustomPlanCard({ plan }: { plan: typeof customPlan }) {
  return (
    <div className="relative h-full">
      <div className="flex h-full flex-col rounded-2xl border border-neutral-200/80 bg-white/90 p-4 backdrop-blur-sm sm:p-5 md:p-6">
        <StarRow count={plan.stars} />
        <h3 className="mb-1 mt-2 text-lg font-indie-flower text-[#b98fd0] sm:text-xl md:text-2xl">
          {plan.name}
        </h3>
        <p className="mb-4 text-base font-semibold text-neutral-900 sm:mb-5 md:mb-6">
          custom
        </p>
        <FeatureList features={plan.features} />
        <Button
          type="button"
          variant="gradient_fill"
          className="mt-4 w-full rounded-xl font-medium text-neutral-800"
          size="sm"
        >
          Contact us
        </Button>
      </div>
    </div>
  );
}
