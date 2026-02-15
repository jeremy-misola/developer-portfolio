"use client";

import React, { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';

export default function ProfileHero() {
  const locale = useLocale();
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/settings');
      if (res.ok) {
        setSettings(await res.json());
      }
    }
    load();
  }, []);

  const headline = locale === 'fr'
    ? settings?.headline_fr || settings?.headline_en
    : settings?.headline_en || settings?.headline_fr;

  const bio = locale === 'fr'
    ? settings?.bio_fr || settings?.bio_en
    : settings?.bio_en || settings?.bio_fr;

  return (
    <section id="hero" className="py-20 sm:py-28">
      <div className="container mx-auto px-4 text-center">
        <p className="text-muted-foreground uppercase tracking-[0.3em] text-sm">
          {settings?.fullName || 'Portfolio'}
        </p>
        <h1 className="mt-4 text-4xl sm:text-6xl font-bold tracking-tight">{headline || 'Professional Portfolio'}</h1>
        <p className="max-w-3xl mx-auto mt-6 text-lg text-muted-foreground">{bio || 'Manage your profile content from the admin panel.'}</p>

        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          {settings?.resumeUrl && (
            <Button asChild>
              <a href={settings.resumeUrl} target="_blank" rel="noreferrer">
                {locale === 'fr' ? 'Telecharger le CV' : 'Download Resume'}
              </a>
            </Button>
          )}
          {settings?.linkedinUrl && (
            <Button variant="outline" asChild>
              <a href={settings.linkedinUrl} target="_blank" rel="noreferrer">LinkedIn</a>
            </Button>
          )}
          {settings?.githubUrl && (
            <Button variant="outline" asChild>
              <a href={settings.githubUrl} target="_blank" rel="noreferrer">GitHub</a>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
