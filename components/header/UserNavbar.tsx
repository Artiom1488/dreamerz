
import Link from "next/link";
import { LogoIconBlack } from "@/constants/social-icons";
import SearchBar  from "@/components/core/SearchBar";
import { MessageCircle, Bell } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="grid h-16 w-full grid-cols-[auto_1fr_auto] items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/newsfeed" className="font-heading text-2xl font-bold tracking-tight">
          <LogoIconBlack className="h-8 w-auto dark:invert" />
        </Link>

        <div className="flex justify-center px-2">
          <div className="w-full max-w-[380px]">
            <SearchBar />
          </div>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center justify-end gap-2">
          <Link href="/messenger" className="rounded-full border border-border bg-muted px-1.5 py-1.5 text-sm font-medium text-foreground">
            <MessageCircle />
          </Link>
          <Link href="/messenger" className="rounded-full border border-border bg-muted px-1.5 py-1.5 text-sm font-medium text-foreground">
            <Bell />
          </Link>

          <div className="h-10 w-[118px] rounded-[12px] bg-[linear-gradient(135deg,#84FAD5_0%,#EBBFFF_50%,#F6EC85_100%)] p-[2.5px]">
            <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-[10px] bg-muted px-2 text-center">
              <span className="text-[11px] leading-none font-medium text-muted-foreground">
                Balance
              </span>
              <div className="mt-0.5 flex items-center gap-1 leading-none">
                <span className="text-[19px] leading-[0.9] font-semibold tracking-tight text-foreground">
                  0
                </span>
                <span className="bg-[linear-gradient(135deg,#84FAD5_0%,#EBBFFF_50%,#F6EC85_100%)] bg-clip-text text-base leading-none text-transparent">
                  ★
                </span>
              </div>
            </div>
          </div>

          <SidebarTrigger className="h-10 w-10 rounded-full border border-border bg-muted text-foreground hover:bg-muted/80 [&_svg]:size-5" />
          
        </div>
      </div>
    </header>
  );
};

export default Navbar;
