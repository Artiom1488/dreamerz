"use client";

import UserNavbar from "@/components/header/UserNavbar";
import { useAuthStore } from "@/stores/auth-store";
import { useUserStore } from "@/stores/user-store";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  SidebarInset,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";
import UserSideBar from "@/components/core/UserSideBar";
import { useUser } from "@/api/queries";

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
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);

  // Use React Query for user data fetching
  const { data: user, isLoading: isLoadingUser, error } = useUser();

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (!accessToken) {
      router.replace("/login");
      return;
    }

    // If 401 error, clear tokens and redirect to login
    if (error) {
      console.error("Failed to fetch user data:", error);
      clearTokens();
      clearUser();
      router.replace("/login");
    }

    // Update user store when React Query data changes
    if (user) {
      setUser(user);
    }
  }, [accessToken, hasHydrated, user, error]);

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
          <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
