"use client";

import { useEffect, useState } from "react";
import { useCharities } from "@/api/queries";
import type { CharityDto } from "@/api/request-types";
import { Button } from "@/components/ui/button";

export default function WingDonations() {
  const { data: charitiesData, isLoading } = useCharities();
  const [wingDonations, setWingDonations] = useState<CharityDto[]>([]);

  useEffect(() => {
    if (charitiesData?.results) {
      setWingDonations(charitiesData.results);
    }
  }, [charitiesData]);

  if (isLoading) {
    return <div className="p-4 text-center text-gray-500">Loading...</div>;
  }

  if (wingDonations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-900">Wing Donations</h3>
      <div className="grid gap-4">
        {wingDonations.map((charity) => {
          const mainImage = charity.images?.[0];
          const imageUrl = mainImage?.url
            ? `${process.env.NEXT_PUBLIC_API_URL}${mainImage.url.startsWith("/") ? mainImage.url.slice(1) : mainImage.url}`
            : undefined;

          return (
            <div
              key={charity.id}
              className="w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-lg"
            >
              {/* Charity Image */}
              {imageUrl && (
                <div className="mb-4 h-40 w-full overflow-hidden rounded-xl">
                  <img
                    src={imageUrl}
                    alt={charity.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              {/* Title */}
              <h4 className="mb-2 text-lg font-semibold text-gray-900">
                {charity.title}
              </h4>

              {/* Description */}
              <p className="mb-4 text-sm text-gray-600 line-clamp-3">
                {charity.description}
              </p>

              {/* Donate Button */}
              <Button variant="gradient_outline" className="w-full">
                Donate
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
