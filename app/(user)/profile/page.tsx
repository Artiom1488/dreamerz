"use client";

import { useEffect, useState } from "react";
import { getUser } from "@/api/requests";
import { User } from "@/api/request-types";
import { Button } from "@/components/ui/button";

const UserProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUser();
        setUser(response.data);
      } catch (error) {
        setError("Failed to fetch user data");
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return <div>No user data found</div>;

  const displayName =
    user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.email || "User";

  const avatarUrl =
    user.mainImageUrl || user.images?.[0]
      ? `${process.env.NEXT_PUBLIC_API_URL}${(user.mainImageUrl || user.images[0]).startsWith("/") ? (user.mainImageUrl || user.images[0]).slice(1) : user.mainImageUrl || user.images[0]}`
      : undefined;

  const coverUrl = user.coverImage
    ? `${process.env.NEXT_PUBLIC_API_URL}${user.coverImage.startsWith("/") ? user.coverImage.slice(1) : user.coverImage}`
    : "/hero-background.webp";

  const navItems = [
    { id: "dream", label: "Her Dream" },
    { id: "activity", label: "Activity" },
    { id: "about", label: "About Her" },
    { id: "fulfilled", label: "Fulfilled" },
    { id: "received", label: "Received" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="relative">
        {/* Cover Image */}
        <div className="h-[400px] w-full overflow-hidden">
          <img
            src={coverUrl}
            alt="Cover"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Profile Info */}
        <div className="relative -mt-24 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center">
            {/* Profile Picture */}
            <div className="h-32 w-32 rounded-full border-4 border-background overflow-hidden bg-muted">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted">
                  <span className="text-2xl font-medium">
                    {displayName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Name */}
            <h1 className="mt-4 text-2xl font-bold">{displayName}</h1>

            {/* Action Buttons */}
            <div className="mt-4 flex gap-3">
              <Button
                variant="gradient_fill"
                size="lg"
                className="rounded-full px-8"
              >
                Fulfill Her Dream
              </Button>
              <Button
                variant="gradient_outline"
                size="lg"
                className="rounded-full px-8"
              >
                Message
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-6 flex gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-muted-foreground">Fulfilled</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-muted-foreground">Received</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-8 border-t border-border">
          <div className="flex justify-center gap-8 py-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Compartment Placeholder */}
        {activeTab && (
          <div className="px-4 sm:px-6 lg:px-8 py-8 border-t border-border">
            <div className="text-center text-muted-foreground">
              <p>
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} content
                will be implemented here
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
