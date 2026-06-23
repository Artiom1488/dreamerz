
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoIconBlack } from "@/constants/social-icons";
import SearchBar  from "@/components/core/SearchBar";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="font-heading text-2xl font-bold tracking-tight">
          <LogoIconBlack className="h-8 w-auto dark:invert" />
        </Link>

        <SearchBar />

        {/* Auth Buttons */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Register</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
