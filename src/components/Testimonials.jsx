"use client";

import React, { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function Testimonials() {
  const locale = useLocale();
  const [testimonials, setTestimonials] = useState([]);
  const [form, setForm] = useState({ name: '', company: '', position: '', content: '', rating: 5 });
  const [submitting, setSubmitting] = useState(false);

  async function loadTestimonials() {
    const res = await fetch('/api/testimonials');
    if (res.ok) {
      setTestimonials(await res.json());
    }
  }

  useEffect(() => {
    loadTestimonials();
  }, []);

  async function submit(e) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setForm({ name: '', company: '', position: '', content: '', rating: 5 });
        alert(locale === 'fr' ? 'Temoignage soumis pour approbation.' : 'Testimonial submitted for approval.');
      } else {
        alert(locale === 'fr' ? 'Impossible de soumettre le temoignage.' : 'Could not submit testimonial.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="testimonials" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold">{locale === 'fr' ? 'Temoignages' : 'Testimonials'}</h2>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <Card key={t.id}>
              <CardHeader>
                <CardTitle className="text-lg">{t.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{t.position} {t.company ? `- ${t.company}` : ''}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{t.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 max-w-2xl">
          <h3 className="text-xl font-semibold mb-3">{locale === 'fr' ? 'Soumettre un temoignage' : 'Submit a testimonial'}</h3>
          <form onSubmit={submit} className="space-y-3">
            <Input required placeholder={locale === 'fr' ? 'Nom' : 'Name'} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input placeholder={locale === 'fr' ? 'Entreprise' : 'Company'} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            <Input placeholder={locale === 'fr' ? 'Poste' : 'Position'} value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
            <Textarea required placeholder={locale === 'fr' ? 'Votre temoignage' : 'Your testimonial'} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
            <Input type="number" min="1" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) || 5 })} />
            <Button disabled={submitting} type="submit">{submitting ? (locale === 'fr' ? 'Envoi...' : 'Submitting...') : (locale === 'fr' ? 'Soumettre' : 'Submit')}</Button>
          </form>
        </div>
      </div>
    </section>
  );
}
