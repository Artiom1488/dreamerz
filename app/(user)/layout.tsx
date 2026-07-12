"use client";

import UserNavbar from "@/components/header/UserNavbar";
import { useAuthStore } from "@/stores/auth-store";
import { useUserStore } from "@/stores/user-store";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  SidebarInset,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";
import UserSideBar from "@/components/core/UserSideBar";
import { getUser } from "@/api/requests";

function SidebarBackdrop() {
  const { open, isMobile, setOpen } = useSidebar();

  if (isMobile || !open) {
    return null;
  }

  return (
    <button
      aria-label="Close sidebar"
      className="fixed inset-0 z-40 bg-black/45 backdrop-blur-[1px]"
      onClick={() => setOpen(false)}
      type="button"
    />
  );
}

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const accessToken = useAuthStore((state) => state.accessToken);
  const clearTokens = useAuthStore((state) => state.clearTokens);
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [hasTriedFetch, setHasTriedFetch] = useState(false);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (!accessToken) {
      router.replace("/login");
      return;
    }

    // Fetch user data only once if not already in store
    if (!user && !isLoadingUser && !hasTriedFetch) {
      setIsLoadingUser(true);
      setHasTriedFetch(true);
      getUser()
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          console.error("Failed to fetch user data:", error);
          // If 401, clear tokens and redirect to login
          if (error?.response?.status === 401) {
            clearTokens();
            router.replace("/login");
          }
        })
        .finally(() => {
          setIsLoadingUser(false);
        });
    }
  }, [
    accessToken,
    hasHydrated,
    user,
    isLoadingUser,
    hasTriedFetch,
    router,
    setUser,
    clearTokens,
  ]);

  useEffect(() => {
    // Check onboarding status and redirect if not completed
    // Only redirect if we have user data and not already on edit-form page
    if (
      user &&
      user.onboardingStatus !== "COMPLETED" &&
      !pathname.includes("/profile/edit-form")
    ) {
      router.replace("/profile/edit-form");
    }
  }, [user, pathname, router]);

  if (!hasHydrated) {
    return null;
  }

  if (!accessToken) {
    return null;
  }

  if (isLoadingUser) {
    return null;
  }

  const isOnboardingPage = pathname.includes("/profile/edit-form");

  return (
    <>
      <SidebarProvider defaultOpen={false}>
        {!isOnboardingPage && <UserSideBar />}
        {!isOnboardingPage && <SidebarBackdrop />}
        <SidebarInset>
          {!isOnboardingPage && <UserNavbar />}
          <main className="flex-1">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
