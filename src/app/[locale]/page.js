import React from 'react';
import ProfileHero from '@/components/ProfileHero';
import Skills from '@/components/Skills';
import Experience from '@/components/Experience';
import Education from '@/components/Education';
import Projects from '@/components/Projects';
import Hobbies from '@/components/Hobbies';
import Testimonials from '@/components/Testimonials';
import ContactSection from '@/components/ContactSection';

export default function Home() {
  return (
    <main>
      <ProfileHero />
      <Skills />
      <Projects />
      <Experience />
      <Education />
      <Hobbies />
      <Testimonials />
      <ContactSection />
    </main>
  );
}
