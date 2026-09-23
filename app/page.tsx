import React from 'react';
import Navbar from '@/app/components/landing/Navbar';
import Hero from '@/app/components/landing/Hero';
import Features from '@/app/components/landing/Features';
import Faq from '@/app/components/landing/Faq';
import CtaSection from '@/app/components/landing/CtaSection';
import SiteFooter from '@/app/components/layout/SiteFooter';

/**
 * Landing page (Server Component — tanpa interaktifitas sendiri).
 * Ritme antar band: {spacing.section} = 96px (DESIGN.md > Whitespace Philosophy),
 * konten maksimal 1200px (DESIGN.md > Grid & Container).
 */
export default function LandingPage() {
    return (
        <main className="min-h-screen bg-canvas text-ink font-body flex flex-col">
            <Navbar />
            <Hero />
            <Features />
            <Faq />
            <CtaSection />
            <SiteFooter />
        </main>
    );
}
