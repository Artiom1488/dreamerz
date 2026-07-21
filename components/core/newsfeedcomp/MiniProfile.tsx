"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@/api/queries";
import { useUserStore } from "@/stores/user-store";
import { useUserDreams } from "@/api/queries";

export default function MiniProfile() {
  const router = useRouter();
  const { data: user, isLoading: userLoading } = useUser();
  const { data: dreamsData } = useUserDreams();
  const { user: storeUser } = useUserStore();

  const currentUser = user || storeUser;

  const handleProfileClick = () => {
    if (currentUser?.id) {
      router.push(`/profile/${currentUser.id}`);
    }
  };

  if (userLoading) {
    return <div className="p-4 text-center text-gray-500">Loading...</div>;
  }

  if (!currentUser) {
    return <div className="p-4 text-center text-gray-500">No user data</div>;
  }

  // Calculate dream statistics
  const dreams = dreamsData?.results || [];
  const totalAmount = dreams.reduce(
    (sum, dream) => sum + (dream.amount || 0),
    0,
  );
  const totalReceived = dreams.reduce(
    (sum, dream) => sum + (dream.amountReceived || 0),
    0,
  );
  const fulfilledCount = dreams.filter(
    (dream) => dream.status === "COMPLETED",
  ).length;
  const progressPercentage =
    totalAmount > 0 ? Math.round((totalReceived / totalAmount) * 100) : 0;

  // Get avatar URL
  const avatarUrl =
    currentUser.mainImageUrl || currentUser.images?.[0]
      ? `${process.env.NEXT_PUBLIC_API_URL}${(currentUser.mainImageUrl || currentUser.images[0]).startsWith("/") ? (currentUser.mainImageUrl || currentUser.images[0]).slice(1) : currentUser.mainImageUrl || currentUser.images[0]}`
      : undefined;

  // Get cover image URL
  const coverUrl = currentUser.coverImage
    ? typeof currentUser.coverImage === "string"
      ? `${process.env.NEXT_PUBLIC_API_URL}${currentUser.coverImage.startsWith("/") ? currentUser.coverImage.slice(1) : currentUser.coverImage}`
      : currentUser.coverImage.url
        ? `${process.env.NEXT_PUBLIC_API_URL}${currentUser.coverImage.url.startsWith("/") ? currentUser.coverImage.url.slice(1) : currentUser.coverImage.url}`
        : currentUser.coverImage.name
          ? `/dreams-platform-bucket/${currentUser.coverImage.name}`
          : undefined
    : undefined;

  // Get display name
  const displayName =
    currentUser.firstName && currentUser.lastName
      ? `${currentUser.firstName} ${currentUser.lastName}`
      : currentUser.firstName || currentUser.lastName || "User";

  return (
    <div className="w-full max-w-sm rounded-2xl overflow-hidden bg-white shadow-lg">
      {/* Cover Image */}
      <div
        className="relative h-32 w-full bg-gradient-to-br from-purple-400 to-pink-500 cursor-pointer"
        onClick={handleProfileClick}
      >
        {coverUrl ? (
          <img
            src={coverUrl}
            alt="Cover"
            className="h-full w-full object-cover"
          />
        ) : null}
      </div>

      {/* Avatar */}
      <div className="relative">
        <div
          className="absolute left-1/2 -top-12 -translate-x-1/2 h-24 w-24 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-md cursor-pointer"
          onClick={handleProfileClick}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Avatar"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-300 text-gray-500">
              <svg
                className="h-12 w-12"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* User Info */}
      <div className="mt-14 px-4 pb-4 text-center">
        <h2
          className="text-xl font-bold text-gray-900 cursor-pointer hover:underline"
          onClick={handleProfileClick}
        >
          {displayName}
        </h2>
        {currentUser.description && (
          <p className="mt-1 text-sm text-gray-600">
            {currentUser.description}
          </p>
        )}

        {/* Scope Section */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700">Scope</span>
            <span className="font-semibold text-gray-900">
              {progressPercentage}%
            </span>
          </div>
          <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 flex justify-between text-sm">
          <div>
            <span className="text-gray-600">Received: </span>
            <span className="font-semibold text-gray-900">{totalReceived}</span>
          </div>
          <div>
            <span className="text-gray-600">Fulfilled: </span>
            <span className="font-semibold text-gray-900">
              {fulfilledCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
