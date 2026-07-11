"use client";

import MainHero from "@/components/hero/MainHero";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (accessToken) {
      router.replace("/newsfeed");
    }
  }, [accessToken, hasHydrated, router]);

  return (
    <div className="relative">
      <MainHero />
    </div>
  );
}
