import React from 'react';
import Link from 'next/link';
import Badge from '@/app/components/ui/Badge';

/**
 * Spec: DESIGN.md > hero-band
 * Headline memakai typography display (Cal Sans → substitusi Inter + tracking negatif).
 */
export default function Hero() {
    return (
        <section id="hero" className="flex flex-col items-center justify-center text-center px-6 pt-section pb-20">
            {/* Badge */}
            <Badge tone="emerald" className="mb-8 animate-fade-in-up">
                NEW: STAR METHOD ANALYSIS
            </Badge>

            {/* Headline */}
            <h1 className="font-display text-display-lg md:text-display-xl text-ink max-w-4xl mx-auto animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                Cara yang lebih baik untuk mengevaluasi resume Anda.
            </h1>

            {/* Subtitle */}
            <p className="text-body-md md:text-body-md text-muted max-w-2xl mx-auto mt-6 leading-relaxed animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                Review resume Anda dalam hitungan detik dengan feedback yang spesifik, jujur, dan siap ATS.
                Tingkatkan kualitas resume, optimalkan peluang lolos seleksi, dan raih kesempatan interview
                lebih cepat.
            </p>

            {/* CTA */}
            <div className="mt-10 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                <Link
                    href="/review"
                    className="bg-primary hover:bg-primary-active text-on-primary text-button font-body px-8 h-10 inline-flex items-center gap-2 rounded-md transition-colors shadow-subtle"
                >
                    Mulai Review
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </div>
        </section>
    );
}
