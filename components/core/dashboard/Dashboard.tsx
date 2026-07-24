"use client";

// Reused as-is from NewsFeed.tsx — same sidebar, same components.
import MiniProfile from "@/components/core/newsfeedcomp/MiniProfile";
import CompleteProfileCard from "@/components/core/newsfeedcomp/CompleteProfileCard";
import WingDonations from "@/components/core/newsfeedcomp/WingDonations";
import { ScrollArea } from "@/components/ui/scroll-area";

// New for the dashboard.
import { DreamsGrid } from "./DreamsGrid";
import { DreamsGridHeader } from "./DreamsGridHeader";
import { LastFulfilled } from "./LastFulfilled";
import { useDreamsGrid } from "./useDreamsGrid";

export default function Dashboard() {
  const { tab, setTab, dreams, isLoading, handleFulfill, handleRandomFulfill } =
    useDreamsGrid();

  return (
    <>
      {/* Mobile: CompleteProfileCard above the grid */}
      <div className="md:hidden px-4 pb-4 bg-gray-100">
        <CompleteProfileCard />
      </div>

      {/* Desktop: sidebar + dream grid + last fulfilled */}
      <div className="hidden md:flex px-4 md:px-6 lg:px-8 bg-gray-100">
        <div className="flex h-[calc(100vh-4rem)] w-full gap-6">
          {/* Sidebar with MiniProfile, CompleteProfileCard, and WingDonations */}
          <ScrollArea className="w-72 lg:w-80 flex-shrink-0 h-full min-h-0">
            <div className="p-6 space-y-6">
              <MiniProfile />
              <CompleteProfileCard />
              <WingDonations />
            </div>
          </ScrollArea>

          {/* Main content: header stays fixed, only the grid scrolls */}
          <div className="flex flex-1 min-w-0 h-full min-h-0 flex-col">
            <DreamsGridHeader
              tab={tab}
              onTabChange={setTab}
              onRandomFulfill={handleRandomFulfill}
              randomFulfillDisabled={dreams.length === 0}
            />
            <ScrollArea className="flex-1 min-h-0">
              <div className="px-6 pb-6 pt-2">
                <DreamsGrid
                  dreams={dreams}
                  isLoading={isLoading}
                  onFulfill={handleFulfill}
                />
              </div>
            </ScrollArea>
          </div>

          {/* Last fulfilled sidebar */}
          <div className="hidden lg:block w-80 xl:w-96 flex-shrink-0 h-full min-h-0 overflow-hidden border-l py-6 pl-4 pr-4">
            <LastFulfilled />
          </div>
        </div>
      </div>

      {/* Mobile: header + dream grid (last-fulfilled panel is desktop-only for now) */}
      <div className="md:hidden">
        <DreamsGridHeader
          tab={tab}
          onTabChange={setTab}
          onRandomFulfill={handleRandomFulfill}
          randomFulfillDisabled={dreams.length === 0}
        />
        <div className="px-4">
          <DreamsGrid dreams={dreams} isLoading={isLoading} onFulfill={handleFulfill} />
        </div>
      </div>
    </>
  );
}