"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import GuestNavbar from "@/components/header/GuestNavbar";
import { useAuthStore } from "@/stores/auth-store";

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  if (!hasHydrated || accessToken) {
    return null;
  }

  return (
    <>
      <GuestNavbar />
      <main className="flex-1">{children}</main>
    </>
  );
}
