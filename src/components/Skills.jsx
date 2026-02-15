"use client";

import React, { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { Badge } from '@/components/ui/badge';

export default function Skills() {
  const locale = useLocale();
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/skills');
      if (res.ok) {
        setSkills(await res.json());
      }
    }
    load();
  }, []);

  return (
    <section id="skills" className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold">{locale === 'fr' ? 'Competences' : 'Skills'}</h2>
        <div className="mt-6 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Badge key={skill.id} variant="secondary" className="py-2 px-3">
              {locale === 'fr' ? skill.name_fr : skill.name_en}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  );
}
