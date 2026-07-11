"use client";

import UserNavbar from "@/components/header/UserNavbar";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SidebarInset, SidebarProvider, useSidebar } from "@/components/ui/sidebar"
import UserSideBar  from "@/components/core/UserSideBar"

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
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (!accessToken) {
      router.replace("/login");
    }
  }, [accessToken, hasHydrated, router]);

  if (!hasHydrated) {
    return null;
  }

  if (!accessToken) {
    return null;
  }

  return (
    <>
    <SidebarProvider defaultOpen={false}>
      <UserSideBar />
      <SidebarBackdrop />
      <SidebarInset>
        <UserNavbar />
        <main className="flex-1">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
    </>
  );
}
