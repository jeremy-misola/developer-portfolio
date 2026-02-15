"use client";

import React, { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Hobbies() {
  const locale = useLocale();
  const [hobbies, setHobbies] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/hobbies');
      if (res.ok) {
        setHobbies(await res.json());
      }
    }
    load();
  }, []);

  return (
    <section id="hobbies" className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold">{locale === 'fr' ? 'Loisirs' : 'Hobbies'}</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {hobbies.map((hobby) => (
            <Card key={hobby.id}>
              <CardHeader>
                <CardTitle>{locale === 'fr' ? hobby.name_fr : hobby.name_en}</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                {locale === 'fr' ? hobby.description_fr : hobby.description_en}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
