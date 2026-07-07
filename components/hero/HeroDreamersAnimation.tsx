"use client";

import Lottie from "lottie-react";
import { useEffect, useState } from "react";

type LottieAsset = {
  u?: string;
};

type LottieAnimation = {
  assets?: LottieAsset[];
};

const HeroDreamersAnimation = () => {
  const [animationData, setAnimationData] = useState<LottieAnimation | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadAnimation = async () => {
      const response = await fetch("/lottie/Dreamers.json", { cache: "force-cache" });
      if (!response.ok) {
        return;
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
    };

    void loadAnimation();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!animationData) {
    return <div className="h-full w-full" />;
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

export default HeroDreamersAnimation;