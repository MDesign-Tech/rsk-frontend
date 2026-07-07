"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "#home", label: "Home", isHash: true },
  { href: "#our-services", label: "Our Services", isHash: true },
  { href: "#about-us", label: "About Us", isHash: true },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const htmlElement = document.documentElement;
    if (htmlElement.classList.contains("dark")) {
      htmlElement.classList.remove("dark");
      setIsDark(false);
    } else {
      htmlElement.classList.add("dark");
      setIsDark(true);
    }
  };

  const navigateToHome = () => {
    setMobileMenuOpen(false);

    if (window.location.pathname === "/") {
      const homeSection = document.getElementById("home");
      if (homeSection) {
        homeSection.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    router.push("/#home");
  };

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    if (href === "#home") {
      navigateToHome();
      return;
    }

    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      } else {
        router.push("/" + href);
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav
        className="mx-auto max-w-6xl px-2 sm:px-4 lg:px-8 py-4"
        aria-label="Main navigation"
      >
        <div className="flex h-14 items-center justify-between bg-background/60 backdrop-blur-xl border border-border/50 rounded-full px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-3"
            aria-label="RSK Associates home"
            onClick={(event) => {
              event.preventDefault();
              navigateToHome();
            }}
          >
            <Image
              src="/rsk-logo.svg"
              alt="RSK Associates"
              width={64}
              height={64}
              className="w-16 sm:w-20 h-auto"
              priority
            />
            <span
              className="font-[family-name:var(--font-pt-mono)] font-bold text-sm sm:text-base text-foreground hidden sm:inline"
              style={{ letterSpacing: "-0.05em" }}
            >
              RSK
            </span>
          </Link>

          {/* Desktop Navigation - hidden below lg */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-none border-none p-0"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop Buttons - hidden below lg */}
          <div className="hidden lg:flex items-center gap-3">
            <Button asChild size="sm" rounded="full">
              <Link href="/contact">Contact Us</Link>
            </Button>
            <button
              onClick={toggleTheme}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-foreground/10"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Moon className="w-4 h-4" aria-hidden="true" />
              ) : (
                <Sun className="w-4 h-4" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Mobile Menu Button - visible below lg */}
          <button
            type="button"
            className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile Menu - visible below lg */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 top-0 left-0 w-dvw h-dvh bg-background z-40 flex flex-col"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation menu"
            >
              <div className="flex items-center justify-between px-6 py-4 bg-background border-b border-border/50">
                <Link
                  href="/"
                  className="flex items-center gap-3"
                  onClick={(event) => {
                    event.preventDefault();
                    navigateToHome();
                  }}
                >
                  <Image
                    src="/rsk-logo.svg"
                    alt="RSK Associates"
                    width={56}
                    height={56}
                    className="w-14 h-auto"
                  />
                  <span
                    className="font-[family-name:var(--font-pt-mono)] font-bold text-sm text-foreground"
                    style={{ letterSpacing: "-0.05em" }}
                  >
                    RSK
                  </span>
                </Link>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleTheme}
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-foreground/10"
                    aria-label="Toggle theme"
                  >
                    {isDark ? (
                      <Moon className="w-4 h-4" aria-hidden="true" />
                    ) : (
                      <Sun className="w-4 h-4" aria-hidden="true" />
                    )}
                  </button>
                  <button
                    type="button"
                    className="p-2 text-foreground hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close menu"
                  >
                    <X className="w-6 h-6" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-6 pt-4 pb-4">
                {navLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className="block w-full text-left px-4 py-3 text-base text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-foreground/10 bg-none border-none cursor-pointer"
                  >
                    {link.label}
                  </button>
                ))}
              </div>

              <div className="px-6 py-4 border-t border-border/50 bg-background flex flex-col gap-3">
                <Button
                  asChild
                  rounded="lg"
                  className="justify-center text-base py-6 w-full"
                >
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
