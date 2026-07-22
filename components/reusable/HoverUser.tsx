"use client";

import { useState } from "react";
import { Globe, Sparkles } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { resolveAssetUrl } from "@/components/core/newsfeedcomp/postUtils";
import type { User, SummaryUserDto } from "@/api/request-types";
import { useUserById } from "@/api/queries";

interface HoverUserProps {
  user: User | SummaryUserDto;
  children: React.ReactNode;
}

export function HoverUser({ user, children }: HoverUserProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Fetch full user data when hover card opens and we only have summary data
  const isSummaryUser = !("email" in user);
  const { data: fullUser } = useUserById(
    isSummaryUser && isOpen ? user.id : "",
  );

  // Use full user data if available, otherwise use the provided user
  const userData = fullUser || user;

  const displayName =
    userData.firstName && userData.lastName
      ? `${userData.firstName} ${userData.lastName}`
      : "email" in userData && userData.email
        ? userData.email
        : "User";

  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();

  const avatarUrl = resolveAssetUrl(
    userData.mainImageUrl ||
      ("images" in userData ? userData.images?.[0] : undefined),
  );

  const city = "city" in userData ? userData.city : null;
  const country = "country" in userData ? userData.country : null;
  const description = "description" in userData ? userData.description : null;

  const location =
    city && country
      ? `${city}, ${country}`
      : city || country || "Location not specified";

  return (
    <HoverCard open={isOpen} onOpenChange={setIsOpen} openDelay={100}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-80 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={avatarUrl || undefined} alt={displayName} />
            <AvatarFallback className="text-lg font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <div className="space-y-1">
              <h4 className="text-base font-bold">{displayName}</h4>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Globe className="h-3.5 w-3.5 shrink-0" />
                <span>
                  Lives in{" "}
                  <strong className="font-semibold text-foreground">
                    {location}
                  </strong>
                </span>
              </p>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 shrink-0" />
                <span>
                  Fulfilled{" "}
                  <strong className="font-semibold text-foreground">0</strong>{" "}
                  Dreams
                </span>
              </p>
            </div>
            {description ? (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {description}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground italic">no bio yet</p>
            )}
          </div>
        </div>
        <div className="flex gap-2 pt-3">
          <Button variant="gradient_fill" size="default" className="flex-1">
            Fulfill
          </Button>
          <Button variant="gradient_outline" size="default" className="flex-1">
            Message
          </Button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
