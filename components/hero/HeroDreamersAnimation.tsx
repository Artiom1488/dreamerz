"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";

// Dynamically import Lottie to reduce initial bundle size
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

type LottieAsset = {
  u?: string;
};

type LottieAnimation = {
  assets?: LottieAsset[];
};

const HeroDreamersAnimationContent = () => {
  const [animationData, setAnimationData] = useState<LottieAnimation | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadAnimation = async () => {
      try {
        const response = await fetch("/lottie/Dreamers.json");
        if (!response.ok) {
          throw new Error("Failed to load animation");
        }

        const data = (await response.json()) as LottieAnimation;
        const normalizedAssets = data.assets?.map((asset) => ({
          ...asset,
          u: "/lottie/images/",
        }));

        if (isMounted) {
          setAnimationData({
            ...data,
            assets: normalizedAssets,
          });
        }
      } catch (error) {
        console.error("Failed to load Lottie animation:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadAnimation();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading || !animationData) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-white" />
      </div>
    );
  }

  return (
    <Lottie
      animationData={animationData}
      loop
      autoplay
      className="h-full w-full"
    />
  );
};

const HeroDreamersAnimation = () => {
  return (
    <Suspense
      fallback={
        <div className="flex h-full w-full items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-white" />
        </div>
      }
    >
      <HeroDreamersAnimationContent />
    </Suspense>
  );
};

export default HeroDreamersAnimation;
