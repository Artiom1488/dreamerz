"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/user-store";

const ProfileRedirect = () => {
  const router = useRouter();
  const currentUser = useUserStore((state) => state.user);

  useEffect(() => {
    if (currentUser?.id) {
      router.replace(`/profile/${currentUser.id}`);
    }
  }, [currentUser, router]);

  return (
    <div className="flex min-h-screen items-center justify-center text-muted-foreground">
      Loading...
    </div>
  );
};

export default ProfileRedirect;
