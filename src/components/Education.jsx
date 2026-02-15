"use client";

import React, { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Education() {
  const locale = useLocale();
  const [education, setEducation] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/education');
      if (res.ok) {
        setEducation(await res.json());
      }
    }
    load();
  }, []);

  const formatDate = (date) => {
    if (!date) return locale === 'fr' ? 'Present' : 'Present';
    return new Date(date).toLocaleDateString(locale === 'fr' ? 'fr-CA' : 'en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

  return (
    <section id="education" className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold">{locale === 'fr' ? 'Education' : 'Education'}</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {education.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle>{item.school}</CardTitle>
                <p className="text-sm text-muted-foreground">{item.location}</p>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{locale === 'fr' ? item.degree_fr : item.degree_en}</p>
                <p className="text-sm text-muted-foreground mt-1">{formatDate(item.startDate)} - {formatDate(item.endDate)}</p>
                <p className="text-sm text-muted-foreground mt-3">
                  {locale === 'fr' ? item.description_fr : item.description_en}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
