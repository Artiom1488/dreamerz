import Link from "next/link";

import { LogoIconBlack } from "@/constants/social-icons";

import SearchBar from "@/components/core/SearchBar";

import { MessageCircle, Bell } from "lucide-react";

import { useSidebar } from "@/components/ui/sidebar";

import { useUserStore } from "@/stores/user-store";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  const user = useUserStore((state) => state.user);

  const { setOpen } = useSidebar();

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    if (!firstName && !lastName) return "?";

    const first = firstName?.[0] || "";

    const last = lastName?.[0] || "";

    return (first + last).toUpperCase() || "?";
  };

  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.email || "Guest";

  const avatarUrl =
    user?.mainImageUrl || user?.images?.[0]
      ? `${process.env.NEXT_PUBLIC_API_URL}${(user?.mainImageUrl || user?.images?.[0]).startsWith("/") ? (user?.mainImageUrl || user?.images?.[0]).slice(1) : user?.mainImageUrl || user?.images?.[0]}`
      : undefined;

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-background">
      <div className="grid h-16 w-full grid-cols-[auto_1fr_auto] items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}

        <Link
          href="/newsfeed"
          className="font-heading text-2xl font-bold tracking-tight"
        >
          <LogoIconBlack className="h-8 w-auto dark:invert" />
        </Link>

        <div className="flex justify-center px-2">
          <div className="w-full max-w-[380px]">
            <SearchBar />
          </div>
        </div>

        {/* Auth Buttons */}

        <div className="flex items-center justify-end gap-2">
          <Link
            href="/messenger"
            className="rounded-full border border-border bg-muted px-1.5 py-1.5 text-sm font-medium text-foreground"
          >
            <MessageCircle />
          </Link>

          <Link
            href="/messenger"
            className="rounded-full border border-border bg-muted px-1.5 py-1.5 text-sm font-medium text-foreground"
          >
            <Bell />
          </Link>

          <div className="h-10 w-[118px] rounded-[12px] bg-[linear-gradient(135deg,#84FAD5_0%,#EBBFFF_50%,#F6EC85_100%)] p-[2.5px]">
            <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-[10px] bg-muted px-2 text-center">
              <span className="text-[11px] leading-none font-medium text-muted-foreground">
                Balance
              </span>

              <div className="mt-0.5 flex items-center gap-1 leading-none">
                <span className="text-[19px] leading-[0.9] font-semibold tracking-tight text-foreground">
                  {user?.balance ?? 0}
                </span>

                <span className="bg-[linear-gradient(135deg,#84FAD5_0%,#EBBFFF_50%,#F6EC85_100%)] bg-clip-text text-base leading-none text-transparent">
                  ★
                </span>
              </div>
            </div>
          </div>

          <Avatar
            className="h-10 w-10 cursor-pointer rounded-full border border-border hover:bg-muted/80"
            onClick={() => setOpen(true)}
          >
            <AvatarImage src={avatarUrl} alt={displayName} />

            <AvatarFallback className="bg-muted">
              {getInitials(user?.firstName, user?.lastName)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      <div className="h-0.5 w-full bg-[linear-gradient(135deg,#84FAD5_0%,#EBBFFF_50%,#F6EC85_100%)]" />
    </header>
  );
};

export default Navbar;
