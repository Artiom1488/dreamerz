"use client";

import { useState } from "react";
import { useUser } from "@/api/queries";
import { useUserDreams } from "@/api/queries";
import { useUserStore } from "@/stores/user-store";
import { Check, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";

type CompletionStep = {
  id: string;
  label: string;
  completed: boolean;
};

export default function CompleteProfileCard() {
  const [isHidden, setIsHidden] = useState(false);
  const { data: user, isLoading: userLoading } = useUser();
  const { data: dreamsData } = useUserDreams();
  const { user: storeUser } = useUserStore();

  const currentUser = user || storeUser;

  if (userLoading || !currentUser || isHidden) {
    return null;
  }

  const handleCompleteLater = () => {
    setIsHidden(true);
  };

  // Calculate completion steps based on null checks
  const steps: CompletionStep[] = [
    {
      id: "profile-picture",
      label: "Add profile picture",
      completed: !!currentUser.mainImageUrl && currentUser.images?.length > 0,
    },
    {
      id: "cover-photo",
      label: "Add profile background photo",
      completed: !!currentUser.coverImage,
    },
    {
      id: "create-dream",
      label: "Create a dream",
      completed: (dreamsData?.results?.length || 0) > 0,
    },
    {
      id: "dream-pictures",
      label: "Add dream pictures",
      completed: (dreamsData?.results || []).some(
        (dream) => dream.images && dream.images.length > 0,
      ),
    },
    {
      id: "fulfill-dreams",
      label: "Start fulfilling others' dreams to realize yours",
      completed: false, // TODO: Add donation tracking when API supports it
    },
  ];

  const completedCount = steps.filter((step) => step.completed).length;
  const progressPercentage = Math.round((completedCount / steps.length) * 100);

  const isComplete = completedCount === steps.length;

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
      <h3 className="text-lg font-bold text-gray-900">Complete your profile</h3>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Progress</span>
          <span className="font-semibold text-gray-900">
            {progressPercentage}%
          </span>
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${progressPercentage}%`,
              background:
                "linear-gradient(135deg, #84fad5 0%, #ebbfff 50%, #f6ec85 100%)",
            }}
          />
        </div>
      </div>

      {/* Checklist */}
      <div className="mt-6 space-y-3">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`flex items-start gap-3 rounded-lg p-2 ${
              step.completed
                ? "opacity-50"
                : "bg-gradient-to-r from-purple-50 to-pink-50"
            }`}
          >
            {step.completed ? (
              <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
                <Check className="h-3 w-3 text-white" />
              </div>
            ) : (
              <Circle className="mt-0.5 h-5 w-5 text-gray-300" />
            )}
            <span
              className={`text-sm font-medium ${
                step.completed ? "text-gray-900" : "text-gray-900"
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>

      {/* Complete Later Button */}
      {!isComplete && (
        <Button
          variant="gradient_outline"
          className="mt-6 w-full"
          onClick={handleCompleteLater}
        >
          Complete Later
        </Button>
      )}
    </div>
  );
}
