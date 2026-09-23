import React from 'react';

type BadgeTone = 'neutral' | 'success' | 'warning' | 'error' | 'emerald';

interface BadgeProps {
    tone?: BadgeTone;
    className?: string;
    children: React.ReactNode;
}

/**
 * Spec: DESIGN.md > components.badge-pill
 * bg {colors.surface-card}, teks {colors.ink}, typography {typography.caption},
 * radius {rounded.pill}, padding 4px 12px. Tone semantic memakai token {colors.*}.
 */
const toneClasses: Record<BadgeTone, string> = {
    neutral: 'bg-surface-card text-ink border-hairline',
    success: 'bg-success/10 text-success border-success/30',
    warning: 'bg-warning/10 text-warning border-warning/30',
    error: 'bg-error/10 text-error border-error/30',
    emerald: 'bg-badge-emerald/10 text-ink border-badge-emerald/40',
};

export default function Badge({ tone = 'neutral', className = '', children }: BadgeProps) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 text-caption font-body px-3 py-1 rounded-pill border ${toneClasses[tone]} ${className}`}
        >
            {children}
        </span>
    );
}
