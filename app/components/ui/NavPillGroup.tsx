import React from 'react';

/**
 * Spec: DESIGN.md > components.nav-pill-group + category-tab(-active)
 * Signature "pill-in-pill": wrapper {colors.surface-soft} radius pill padding 6px,
 * segmen aktif = {colors.canvas} + shadow {shadow-subtle}.
 */
export function NavPillGroup({ className = '', children }: { className?: string; children: React.ReactNode }) {
    return (
        <div
            className={`inline-flex bg-surface-soft p-1 rounded-pill border border-hairline text-nav-link font-body ${className}`}
        >
            {children}
        </div>
    );
}

interface NavPillItemProps {
    active?: boolean;
    disabled?: boolean;
    onClick?: () => void;
    className?: string;
    children: React.ReactNode;
}

export function NavPillItem({
    active = false,
    disabled = false,
    onClick,
    className = '',
    children,
}: NavPillItemProps) {
    const base = 'px-4 py-1.5 rounded-md transition-colors whitespace-nowrap';
    const state = active
        ? 'bg-canvas text-ink shadow-subtle cursor-pointer'
        : disabled
            ? 'text-muted cursor-not-allowed'
            : 'text-muted hover:text-ink cursor-pointer';

    return (
        <button type="button" disabled={disabled} onClick={onClick} className={`${base} ${state} ${className}`}>
            {children}
        </button>
    );
}
