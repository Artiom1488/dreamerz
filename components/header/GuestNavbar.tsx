
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoIconWhite } from "@/constants/social-icons";


const GuestNavbar = () => {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 w-full">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="font-heading text-2xl font-bold tracking-tight">
          <LogoIconWhite className="h-8 w-auto dark:invert"/>
        </Link>
        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <Button variant="gradient_outline" asChild className="h-11 px-7 text-base rounded-xl">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild variant="gradient_fill" className="h-11 px-7 text-base rounded-xl">
            <Link href="/register">Register</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default GuestNavbar;
