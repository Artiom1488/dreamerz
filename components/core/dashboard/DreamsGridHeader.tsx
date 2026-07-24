"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import type { DreamsTab } from "./useDreamsGrid";

const tabTriggerClass =
  "rounded-none border-0 bg-transparent px-0 text-base font-semibold text-gray-400 shadow-none data-[state=active]:bg-transparent data-[state=active]:text-gray-900 data-[state=active]:shadow-none";

interface DreamsGridHeaderProps {
  tab: DreamsTab;
  onTabChange: (tab: DreamsTab) => void;
  onRandomFulfill: () => void;
  randomFulfillDisabled: boolean;
}

export function DreamsGridHeader({
  tab,
  onTabChange,
  onRandomFulfill,
  randomFulfillDisabled,
}: DreamsGridHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4 bg-gray-100 px-6 py-4">
      <Tabs value={tab} onValueChange={(value) => onTabChange(value as DreamsTab)}>
        <TabsList className="gap-4 bg-transparent p-0">
          <TabsTrigger value="popular" className={tabTriggerClass}>
            Most Popular
          </TabsTrigger>
          <TabsTrigger value="less-popular" className={tabTriggerClass}>
            Less popular
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Button
        variant="outline"
        className="rounded-full"
        onClick={onRandomFulfill}
        disabled={randomFulfillDisabled}
      >
        Random fulfill
      </Button>
    </div>
  );
}
