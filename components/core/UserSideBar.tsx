import {
  BadgeDollarSign,
  Bookmark,
  BookOpen,
  CircleUserRound,
  Compass,
  FileSignature,
  Info,
  Lock,
  LogOut,
  MessagesSquare,
  Send,
  SlidersHorizontal,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";

type MenuItem = {
  title: string;
  icon: React.ElementType;
  href: string;
  badge?: string;
};

const mainMenuItems: MenuItem[] = [
  { title: "Explore", icon: Compass, href: "/newsfeed" },
  { title: "Messenger", icon: Send, href: "/messenger", badge: "New" },
  { title: "Saved Posts", icon: Bookmark, href: "/saved-posts", badge: "New" },
  { title: "Dashboard", icon: SlidersHorizontal, href: "/dashboard" },
  { title: "My profile", icon: CircleUserRound, href: "/profile" },
  { title: "Pricing page", icon: BadgeDollarSign, href: "/pricing" },
];

const secondaryMenuItems: MenuItem[] = [
  { title: "About us", icon: Users, href: "/about-us" },
  { title: "How it works", icon: Info, href: "/how-it-works" },
  { title: "FAQ", icon: BookOpen, href: "/faq" },
  { title: "Leave Feedback", icon: MessagesSquare, href: "/feedback" },
  { title: "Terms and Conditions", icon: FileSignature, href: "/terms" },
  { title: "Privacy Policy", icon: Lock, href: "/privacy" },
];

const menuButtonClasses =
  "h-9 bg-white! font-normal! text-gray-800! hover:bg-gray-100! hover:text-gray-900! hover:font-bold!";

const logoutButtonClasses =
  "h-9 bg-white! font-normal! text-red-500! hover:bg-gray-100! hover:text-red-600! hover:font-bold!";

const Divider = () => <div className="mx-3 my-1 h-px shrink-0 bg-gray-200" />;

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export interface UserSideBarUser {
  name: string;
  avatarUrl?: string;
  balance?: number;
}

interface UserSideBarProps {
  /** User data coming from the backend — name, avatar and balance. */
  user?: UserSideBarUser;
  /** Called when the person clicks "Random Fulfill". */
  onRandomFulfill?: () => void;
  /** Called when the person clicks "Logout". */
  onLogout?: () => void;
}

const defaultUser: UserSideBarUser = {
  name: "Guest",
  avatarUrl: undefined,
  balance: 0,
};

const UserSideBar = ({
  user = defaultUser,
  onRandomFulfill,
  onLogout,
}: UserSideBarProps) => {
  const router = useRouter();
  const clearTokens = useAuthStore((state) => state.clearTokens);

  const handleLogout = (): void => {
    clearTokens();
    router.replace("/");
  };

  return (
    <Sidebar
      side="right"
      variant="floating"
      collapsible="offcanvas"
      style={{ "--sidebar-width": "20rem" } as React.CSSProperties}
      className="z-50 p-0 [&>[data-sidebar=sidebar]]:rounded-none [&>[data-sidebar=sidebar]]:shadow-none [&>[data-sidebar=sidebar]]:ring-0 [&>[data-sidebar=sidebar]]:border-l [&>[data-sidebar=sidebar]]:border-sidebar-border"
    >
      <SidebarHeader className="gap-3 px-4 pt-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2.5">
            <Avatar className="h-9 w-9 shrink-0">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback className="bg-muted text-sm">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <span className="truncate text-base font-semibold text-sidebar-foreground">
              {user.name}
            </span>
          </div>

          <div className="h-10 w-[118px] shrink-0 rounded-[12px] bg-[linear-gradient(135deg,#84FAD5_0%,#EBBFFF_50%,#F6EC85_100%)] p-[2.5px]">
            <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-[10px] bg-muted px-2 text-center">
              <span className="text-[11px] leading-none font-medium text-muted-foreground">
                Balance
              </span>
              <div className="mt-0.5 flex items-center gap-1 leading-none">
                <span className="text-[19px] leading-[0.9] font-semibold tracking-tight text-foreground">
                  {user.balance ?? 0}
                </span>
                <span className="bg-[linear-gradient(135deg,#84FAD5_0%,#EBBFFF_50%,#F6EC85_100%)] bg-clip-text text-base leading-none text-transparent">
                  ★
                </span>
              </div>
            </div>
          </div>
        </div>

        <Button
          type="button"
          onClick={onRandomFulfill}
          variant="gradient_fill"
          size="lg"
          className="w-full rounded-xl"
        >
          Random Fulfill
        </Button>
      </SidebarHeader>

      <Divider />

      <SidebarContent className="px-3 py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className={menuButtonClasses}>
                    <a href={item.href} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span className="truncate text-sm">{item.title}</span>
                      {item.badge && (
                        <Badge
                          variant="dreamangel"
                          className="ml-auto font-medium text-[10px]"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Divider />

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {secondaryMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className={menuButtonClasses}>
                    <a href={item.href} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span className="truncate text-sm">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Divider />

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={logoutButtonClasses}>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-3"
                  >
                    <LogOut className="h-4 w-4 shrink-0" />
                    <span className="text-sm">Logout</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default UserSideBar;
