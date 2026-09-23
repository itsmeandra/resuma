'use client';

import React from 'react';

export type StepStatus = 'done' | 'current' | 'upcoming' | 'error';

export interface StepItem {
    label: string;
    status: StepStatus;
    /** Jika diisi, langkah "done" dapat diklik untuk kembali (mis. dari Hasil ke Setup). */
    onClick?: () => void;
}

interface StepperProps {
    steps: StepItem[];
    className?: string;
}

/**
 * Stepper nyata (pengganti stepper "palsu" lama).
 * Membangun pola pill-in-pill dari DESIGN.md > nav-pill-group:
 * - done      : centang, teks muted, bisa diklik bila onClick tersedia
 * - current   : bg canvas + shadow-subtle (segmen aktif)
 * - upcoming  : teks muted, tidak interaktif
 * - error     : penanda error memakai token {colors.error}
 */
export default function Stepper({ steps, className = '' }: StepperProps) {
    return (
        <nav
            aria-label="Tahapan analisis"
            className={`inline-flex flex-wrap bg-surface-soft p-1 rounded-pill border border-hairline text-nav-link font-body ${className}`}
        >
            {steps.map((step, idx) => {
                const isActive = step.status === 'current';
                const isDone = step.status === 'done';
                const isError = step.status === 'error';

                const stateClasses = isActive
                    ? 'bg-canvas text-ink shadow-subtle'
                    : isError
                        ? 'text-error'
                        : isDone
                            ? step.onClick
                                ? 'text-muted hover:text-ink cursor-pointer'
                                : 'text-muted'
                            : 'text-muted-soft cursor-not-allowed';

                return (
                    <button
                        key={step.label}
                        type="button"
                        disabled={!isActive && !isDone}
                        onClick={step.onClick}
                        aria-current={isActive ? 'step' : undefined}
                        className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md transition-colors whitespace-nowrap ${stateClasses}`}
                    >
                        {isDone && !isActive && (
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                        <span className={`tabular-nums ${isActive ? 'font-semibold' : ''}`}>{idx + 1}.</span>
                        {step.label}
                    </button>
                );
            })}
        </nav>
    );
}
