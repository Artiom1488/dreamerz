"use client";

import MiniProfile from "./newsfeedcomp/MiniProfile";
import CompleteProfileCard from "./newsfeedcomp/CompleteProfileCard";
import WingDonations from "./newsfeedcomp/WingDonations";
import { FeedCard } from "./newsfeedcomp/FeedCard";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function NewsFeed() {
  return (
    <>
      {/* Mobile: CompleteProfileCard above feed */}
      <div className="md:hidden px-4 pb-4 bg-gray-100">
        <CompleteProfileCard />
      </div>

      {/* Desktop: Centered container with sidebar and feed */}
      <div className="hidden md:flex px-4 md:px-6 lg:px-8 justify-center bg-gray-100">
        <div className="flex h-[calc(100vh-4rem)] max-w-7xl">
          {/* Sidebar with MiniProfile, CompleteProfileCard, and WingDonations */}
          <ScrollArea className="w-72 lg:w-80 flex-shrink-0 h-full min-h-0">
            <div className="p-6 space-y-6">
              <MiniProfile />
              <CompleteProfileCard />
              <WingDonations />
            </div>
          </ScrollArea>

          {/* Main content area */}
          <ScrollArea className="w-[42rem] flex-shrink-0 h-full min-h-0">
            <div className="p-6">
              <FeedCard />
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Mobile feed */}
      <div className="md:hidden px-4">
        <FeedCard />
      </div>
    </>
  );
}
