"use client";

import React from 'react';
import { useLocale } from 'next-intl';
import { usePathname } from '@/i18n/routing';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useTheme } from 'next-themes';
import { Switch } from '@/components/ui/switch';

export default function Header() {
  const locale = useLocale();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const basePath = `/${locale}`;

  if (pathname.includes('/admin')) {
    return null;
  }

  const links = [
    { href: `${basePath}#skills`, label: locale === 'fr' ? 'Competences' : 'Skills' },
    { href: `${basePath}#projects`, label: locale === 'fr' ? 'Projets' : 'Projects' },
    { href: `${basePath}#experience`, label: locale === 'fr' ? 'Experience' : 'Experience' },
    { href: `${basePath}#education`, label: locale === 'fr' ? 'Education' : 'Education' },
    { href: `${basePath}#hobbies`, label: locale === 'fr' ? 'Loisirs' : 'Hobbies' },
    { href: `${basePath}#testimonials`, label: locale === 'fr' ? 'Temoignages' : 'Testimonials' },
    { href: `${basePath}/contact`, label: locale === 'fr' ? 'Contact' : 'Contact' },
    { href: `${basePath}/admin`, label: 'Admin' },
  ];

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <a href={basePath} className="font-semibold">Portfolio</a>

        <nav className="hidden md:flex items-center gap-4 text-sm">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-primary">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Switch
            checked={theme === 'dark'}
            onCheckedChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
          />
        </div>
      </div>
    </header>
  );
}
