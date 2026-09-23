import React from 'react';

type CardVariant = 'product' | 'feature';

interface CardProps {
    variant?: CardVariant;
    className?: string;
    children: React.ReactNode;
}

/**
 * Spec: DESIGN.md > components.product-mockup-card / feature-card
 * - product: bg canvas + 1px hairline, radius {rounded.lg}, padding 24px — "lihat isi produk".
 * - feature: bg surface-card (tanpa border), radius {rounded.lg}, padding 32px — "klaim fitur".
 */
const variantClasses: Record<CardVariant, string> = {
    product: 'bg-canvas border border-hairline p-6',
    feature: 'bg-surface-card p-8',
};

export default function Card({ variant = 'product', className = '', children }: CardProps) {
    return (
        <div className={`rounded-lg ${variantClasses[variant]} ${className}`}>{children}</div>
    );
}
