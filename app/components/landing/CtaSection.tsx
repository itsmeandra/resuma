import React from 'react';
import Link from 'next/link';

/**
 * CTA band sebelum footer.
 * Radius mengikuti batas DESIGN.md (maks {rounded.xl} = 16px — dulu rounded-[2rem]/32px melanggar).
 * Padding mengikuti spec cta-band (48px), headline display-sm, aksi button-primary.
 */
export default function CtaSection() {
    return (
        <section className="max-w-5xl mx-auto px-6 pb-section w-full">
            <div className="bg-primary rounded-xl p-12 md:p-16 text-center relative overflow-hidden">
                {/* Dekorasi lingkaran (putih/5 di atas surface gelap) */}
                <div className="absolute -left-16 -bottom-24 w-64 h-64 border-[30px] border-on-primary/5 rounded-full pointer-events-none" aria-hidden></div>
                <div className="absolute -right-20 top-10 w-72 h-72 border-[40px] border-on-primary/5 rounded-full pointer-events-none" aria-hidden></div>

                <div className="relative z-10">
                    <h2 className="font-display text-display-sm md:text-display-md text-on-primary mb-4">
                        Siap meningkatkan peluang <br className="hidden md:block" /> interview Anda?
                    </h2>
                    <p className="text-body-md text-on-primary/80 mb-10 max-w-lg mx-auto">
                        Dapatkan analisis mendalam dalam hitungan detik. Gratis untuk review resume Anda.
                    </p>
                    <Link
                        href="/review"
                        className="bg-canvas hover:bg-surface-soft text-ink text-button font-body px-8 h-10 inline-flex items-center rounded-md transition-colors shadow-subtle"
                    >
                        Mulai Review Sekarang
                    </Link>
                </div>
            </div>
        </section>
    );
}
