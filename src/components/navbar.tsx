"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, Moon, Sun, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

const navLinks = [
  { href: "#home", label: "Home", isHash: true },
  { href: "#our-services", label: "Our Services", isHash: true },
];

const blogLinks = [
  { href: "/blog/news", label: "News" },
  { href: "/blog/opportunities", label: "Opportunities" },
];

const aboutLinks = [
  { href: "/about/who", label: "Who are we" },
  { href: "/about/partners", label: "Our partners" },
  { href: "/about/team", label: "Our team" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mediaMenuOpen, setMediaMenuOpen] = useState(false);
  const [aboutMenuOpen, setAboutMenuOpen] = useState(false);
  const [activeHref, setActiveHref] = useState("#home");
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

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
    if (pathname === "/") {
      setActiveHref("#home");
    } else if (pathname.startsWith("/blog")) {
      setActiveHref("/blog");
    } else if (pathname.startsWith("/about")) {
      setActiveHref("/about");
    } else if (pathname === "/membership") {
      setActiveHref("/membership");
    } else if (pathname === "/contact") {
      setActiveHref("/contact");
    }
  }, [pathname]);

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const navigateToHome = () => {
    setMobileMenuOpen(false);
    setMediaMenuOpen(false);
    setAboutMenuOpen(false);

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
    setMediaMenuOpen(false);
    setActiveHref(href);

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
      return;
    }

    router.push(href);
  };

  const isActiveLink = (href: string) => {
    if (href === "#home") return activeHref === "#home" && pathname === "/";
    if (href === "/membership") return activeHref === "/membership";
    if (href === "/blog") return pathname.startsWith("/blog");
    if (href === "/about") return pathname.startsWith("/about");
    return activeHref === href;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav
        className="mx-auto max-w-6xl px-2 sm:px-4 lg:px-8 py-4"
        aria-label="Main navigation"
      >
        <div className="flex h-14 items-center justify-between bg-background/70 backdrop-blur-xl border border-border/50 rounded-full px-4 sm:px-6 shadow-sm">
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
              className="font-(family-name:--font-pt-mono) font-bold text-sm sm:text-base text-foreground hidden sm:inline"
              style={{ letterSpacing: "-0.05em" }}
            >
              RSK
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className={`text-sm transition-colors cursor-pointer bg-none border-none p-0 ${isActiveLink(link.href) ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`}
              >
                {link.label}
              </button>
            ))}

            <div className="relative">
              <button
                type="button"
                onClick={() => setMediaMenuOpen((prev) => !prev)}
                className={`flex items-center gap-1 text-sm transition-colors ${isActiveLink("/blog") ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`}
              >
                Blog
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${mediaMenuOpen ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence>
                {mediaMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full mt-3 w-44 rounded-xl border border-border/60 bg-background/95 p-2 shadow-lg"
                  >
                    {blogLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => {
                          setActiveHref(link.href);
                          setMediaMenuOpen(false);
                        }}
                        className={`block rounded-lg px-3 py-2 text-sm transition-colors ${isActiveLink(link.href) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-foreground/10 hover:text-foreground"}`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setAboutMenuOpen((prev) => !prev)}
                className={`flex items-center gap-1 text-sm transition-colors ${isActiveLink("/about") ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`}
              >
                About
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${aboutMenuOpen ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence>
                {aboutMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full mt-3 w-56 rounded-xl border border-border/60 bg-background/95 p-2 shadow-lg"
                  >
                    {aboutLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => {
                          setActiveHref(link.href);
                          setAboutMenuOpen(false);
                        }}
                        className={`block rounded-lg px-3 py-2 text-sm transition-colors ${isActiveLink(link.href) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-foreground/10 hover:text-foreground"}`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/membership"
              onClick={() => setActiveHref("/membership")}
              className={`text-sm transition-colors ${isActiveLink("/membership") ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`}
            >
              Membership
            </Link>
          </div>

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
                    className="font-(family-name:--font-pt-mono) font-bold text-sm text-foreground"
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
                    className={`block w-full text-left px-4 py-3 text-base transition-colors rounded-lg bg-none border-none cursor-pointer ${isActiveLink(link.href) ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {link.label}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setMediaMenuOpen((prev) => !prev)}
                  className={`flex w-full items-center justify-between px-4 py-3 text-base rounded-lg transition-colors ${isActiveLink("/blog") ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <span>Blog</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${mediaMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {mediaMenuOpen && (
                  <div className="ml-2 space-y-1 px-2 py-2">
                    {blogLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => {
                          setActiveHref(link.href);
                          setMediaMenuOpen(false);
                          setMobileMenuOpen(false);
                        }}
                        className={`block rounded-lg px-3 py-2 text-sm transition-colors ${isActiveLink(link.href) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-foreground/10 hover:text-foreground"}`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setAboutMenuOpen((prev) => !prev)}
                  className={`flex w-full items-center justify-between px-4 py-3 text-base rounded-lg transition-colors ${isActiveLink("/about") ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <span>About</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${aboutMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {aboutMenuOpen && (
                  <div className="ml-2 space-y-1 px-2 py-2">
                    {aboutLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => {
                          setActiveHref(link.href);
                          setAboutMenuOpen(false);
                          setMobileMenuOpen(false);
                        }}
                        className={`block rounded-lg px-3 py-2 text-sm transition-colors ${isActiveLink(link.href) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-foreground/10 hover:text-foreground"}`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}

                <Link
                  href="/membership"
                  onClick={() => {
                    setActiveHref("/membership");
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full px-4 py-3 text-base rounded-lg transition-colors ${isActiveLink("/membership") ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Membership
                </Link>
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
