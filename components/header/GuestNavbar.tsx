"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogoIconBlack, LogoIconWhite } from "@/constants/social-icons";

const GuestNavbar = () => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isTransparentNavbar = isHomePage && !isScrolled;
  const LogoIcon = isTransparentNavbar ? LogoIconWhite : LogoIconBlack;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full border-b transition-colors duration-200 ${
        isTransparentNavbar
          ? "border-transparent bg-transparent"
          : "border-transparent bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85"
      }`}
    >
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:h-16 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="shrink-0 font-heading text-xl font-bold tracking-tight sm:text-2xl">
          <LogoIcon className="h-7 w-auto sm:h-8" />
        </Link>
        {/* Auth Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="gradient_outline"
            asChild
            className={`h-9 rounded-xl px-4 text-sm sm:h-11 sm:px-7 sm:text-base ${
              isTransparentNavbar ? "text-white hover:text-[#0a0a0f]" : "text-[#0a0a0f] hover:text-[#0a0a0f]"
            }`}
          >
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild variant="gradient_fill" className="h-9 rounded-xl px-4 text-sm sm:h-11 sm:px-7 sm:text-base">
            <Link href="/register">Register</Link>
          </Button>
        </div>
      </div>
      {!isTransparentNavbar && (
        <div className="h-0.5 w-full bg-[linear-gradient(135deg,#84FAD5_0%,#EBBFFF_50%,#F6EC85_100%)]" />
      )}
    </header>
  );
};

export default GuestNavbar;
