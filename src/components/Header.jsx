"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { SunIcon, MoonIcon } from "@radix-ui/react-icons";
import { Menu, X, ChevronDown, User, Layers, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "./LanguageSwitcher";

function Header() {
  const t = useTranslations("Header");
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Handle mount state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigation Data
  const navGroups = [
    {
      title: t("profile"),
      icon: <User className="w-4 h-4 mr-1" />,
      items: [
        { name: t("about"), href: "#about" },
        { name: t("experience"), href: "#experience" },
        { name: t("education"), href: "#education" },
        { name: t("projects"), href: "#projects" },
        { name: t("hackathons"), href: "#hackathons" },
      ]
    },
    {
      title: t("platform"),
      icon: <Layers className="w-4 h-4 mr-1" />,
      items: [
        { name: t("cluster"), href: "#cluster" },
        { name: t("monitoring"), href: "#monitoring" },
        { name: t("gitops"), href: "#gitops" },
        { name: t("provisioning"), href: "#provisioning" },
      ]
    }
  ];

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled
        ? "border-b bg-background/80 backdrop-blur-md shadow-sm"
        : "bg-transparent border-transparent"
        }`}
    >
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <a href="#hero" className="font-bold tracking-tight text-xl flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-mono">JM</span>
          </div>
          <span className="hidden sm:inline-block">DevOps<span className="text-primary">Portfolio</span></span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navGroups.map((group) => (
            <div key={group.title} className="relative group">
              <button className="flex items-center text-sm font-medium hover:text-primary transition-colors py-2">
                {group.icon}
                {group.title}
                <ChevronDown className="ml-1 w-3 h-3 group-hover:rotate-180 transition-transform duration-200" />
              </button>

              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 w-48 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                <div className="bg-popover border border-border rounded-lg shadow-lg overflow-hidden p-1">
                  {group.items.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="block px-4 py-2 text-sm text-popover-foreground hover:bg-muted hover:text-primary rounded-md transition-colors"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <a href="#testimonials" className="flex items-center text-sm font-medium hover:text-primary transition-colors">
            <MessageSquare className="w-4 h-4 mr-1" />
            {t("testimonials")}
          </a>

          <div className="h-6 w-px bg-border mx-2" />

          <div className="flex items-center gap-4">
            <LanguageSwitcher />

            <div className="flex items-center gap-2">
              {mounted ? (
                <>
                  <SunIcon className="h-4 w-4 text-muted-foreground" />
                  <Switch
                    id="theme-switch-desktop"
                    checked={theme === "dark"}
                    onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
                    aria-label="Toggle theme"
                  />
                  <MoonIcon className="h-4 w-4 text-muted-foreground" />
                </>
              ) : (
                <div className="w-20 h-6" /> // Placeholder to prevent layout shift
              )}
            </div>
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <LanguageSwitcher />
          <div className="flex items-center gap-2">
            {mounted ? (
              <Switch
                id="theme-switch-mobile"
                checked={theme === "dark"}
                onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
              />
            ) : (
              <div className="w-10 h-6" /> // Placeholder
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Toggle Menu">
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b bg-background px-4 pb-6 shadow-xl"
          >
            <nav className="flex flex-col gap-6 pt-4">
              {navGroups.map((group) => (
                <div key={group.title} className="space-y-3">
                  <h3 className="font-semibold text-primary flex items-center gap-2">
                    {group.icon} {group.title}
                  </h3>
                  <div className="grid grid-cols-2 gap-2 pl-4 border-l-2 border-muted">
                    {group.items.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-sm text-muted-foreground hover:text-foreground py-1 block"
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
              <div className="space-y-3">
                <h3 className="font-semibold text-primary flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> {t("more")}
                </h3>
                <div className="pl-4 border-l-2 border-muted">
                  <a
                    href="#testimonials"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-sm text-muted-foreground hover:text-foreground py-1 block"
                  >
                    {t("testimonials")}
                  </a>
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;