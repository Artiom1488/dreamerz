"use client";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";

const NewsfeedPage = () => {
  const router = useRouter();
  const clearTokens = useAuthStore((state) => state.clearTokens);

  const handleLogout = (): void => {
    clearTokens();
    router.replace("/");
  };

  return (
    <section className="flex-1 p-6 sm:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-4xl font-bold tracking-tight text-gradient-2">
          Newsfeed
        </h1>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </section>
  );
};

export default NewsfeedPage;