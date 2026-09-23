import React from 'react';
import Link from 'next/link';

interface SiteHeaderProps {
    /** Slot tengah/kanan — mis. stepper wizard atau nav links. */
    children?: React.ReactNode;
    bordered?: boolean;
}

/**
 * Spec: DESIGN.md > components.top-nav
 * {colors.canvas}, tinggi 64px, wordmark di kiri, konten di kanan.
 * Dipakai bersama oleh landing page (/) dan halaman review (/review).
 */
export default function SiteHeader({ children, bordered = false }: SiteHeaderProps) {
    return (
        <header
            className={`h-16 bg-canvas px-4 md:px-8 flex items-center justify-between gap-4 sticky top-0 z-50 ${
                bordered ? 'border-b border-hairline' : ''
            }`}
        >
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity shrink-0">
                <span className="w-8 h-8 rounded-full bg-primary text-on-primary font-display font-semibold text-caption flex items-center justify-center">
                    AI
                </span>
                <span className="font-display font-semibold text-title-md text-ink">
                    Resum<span className="text-muted-soft">ai</span>
                </span>
            </Link>
            {children && <div className="flex items-center gap-3 min-w-0">{children}</div>}
        </header>
    );
}
