"use client";

import React, { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function ContactSection() {
  const locale = useLocale();
  const [settings, setSettings] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/settings');
      if (res.ok) {
        setSettings(await res.json());
      }
    }
    load();
  }, []);

  async function submit(e) {
    e.preventDefault();
    setSending(true);

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setForm({ name: '', email: '', subject: '', message: '' });
        alert(locale === 'fr' ? 'Message envoye.' : 'Message sent.');
      } else {
        alert(locale === 'fr' ? 'Echec de l envoi du message.' : 'Failed to send message.');
      }
    } finally {
      setSending(false);
    }
  }

  return (
    <section id="contact" className="py-16">
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-3xl font-semibold">{locale === 'fr' ? 'Contact' : 'Contact'}</h2>
          <p className="mt-4 text-muted-foreground">{settings?.email}</p>
          <p className="text-muted-foreground">{settings?.phone}</p>
          <p className="text-muted-foreground">{settings?.location}</p>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <Input
            required
            placeholder={locale === 'fr' ? 'Nom' : 'Name'}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            required
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            required
            placeholder={locale === 'fr' ? 'Sujet' : 'Subject'}
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
          />
          <Textarea
            required
            placeholder={locale === 'fr' ? 'Votre message' : 'Your message'}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
          <Button disabled={sending} type="submit">
            {sending ? (locale === 'fr' ? 'Envoi...' : 'Sending...') : (locale === 'fr' ? 'Envoyer' : 'Send')}
          </Button>
        </form>
      </div>
    </section>
  );
}
