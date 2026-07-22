"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { plans, customPlan } from "@/data/mock-data/onboarding";
import { PlanCard, CustomPlanCard } from "@/components/ui/feature_plan_card";

interface PricingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubscribe?: (planId: string) => void;
}

export function PricingModal({
  open,
  onOpenChange,
  onSubscribe,
}: PricingModalProps) {
  const handleSubscribe = (planId: string) => {
    console.log("Subscribe to plan:", planId);
    if (onSubscribe) {
      onSubscribe(planId);
    }
    // TODO: Implement subscription logic
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[calc(100%-2rem)] p-0 sm:max-w-[calc(100%-2rem)] md:max-w-3xl lg:max-w-5xl xl:max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="px-6 pt-6 sm:px-8 sm:pt-8">
          <DialogTitle className="text-left text-2xl font-bold text-neutral-900 sm:text-3xl">
            Pricing
          </DialogTitle>
        </DialogHeader>

        {/* Plan cards — grid on large screens, carousel on small/medium */}
        <div className="relative overflow-hidden px-4 pb-8 pt-10 sm:px-6 sm:pt-12 md:px-8">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-16 h-[420px] w-[420px] rounded-full bg-gradient-to-br from-amber-100/60 via-yellow-50/50 to-transparent blur-3xl"
          />

          {/* Large screens: static grid, no carousel chrome */}
          <div className="relative hidden gap-4 lg:grid lg:grid-cols-5">
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onSubscribe={handleSubscribe}
              />
            ))}
            <CustomPlanCard plan={customPlan} />
          </div>

          {/* Small/medium screens: carousel */}
          <Carousel
            className="relative w-full lg:hidden"
            opts={{ align: "start" }}
          >
            <CarouselContent className="-ml-4">
              {plans.map((plan) => (
                <CarouselItem
                  key={plan.id}
                  className="basis-[85%] pl-4 sm:basis-1/2 md:basis-1/3"
                >
                  <PlanCard plan={plan} onSubscribe={handleSubscribe} />
                </CarouselItem>
              ))}
              <CarouselItem className="basis-[85%] pl-4 sm:basis-1/2 md:basis-1/3">
                <CustomPlanCard plan={customPlan} />
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </div>
      </DialogContent>
    </Dialog>
  );
}
