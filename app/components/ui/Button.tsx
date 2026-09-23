import React from 'react';
import Link from 'next/link';

type ButtonVariant = 'primary' | 'secondary' | 'textLink';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
}

/**
 * Spec: DESIGN.md > components.button-primary / button-secondary / button-text-link
 * - primary: bg {colors.primary}, teks {colors.on-primary}, typography {typography.button},
 *   radius {rounded.md}, padding 12px 20px, height 40px. Press → {colors.primary-active}.
 * - secondary: bg {colors.canvas}, teks {colors.ink}, 1px hairline, dimensi sama.
 * - textLink: transparan, teks {colors.ink}.
 */
const variantClasses: Record<ButtonVariant, string> = {
    primary:
        'bg-primary text-on-primary hover:bg-primary-active active:bg-primary-active disabled:bg-primary-disabled disabled:text-muted',
    secondary:
        'bg-canvas text-ink border border-hairline hover:bg-surface-soft active:bg-surface-soft disabled:text-muted-soft disabled:border-hairline-soft',
    textLink: 'bg-transparent text-ink hover:text-muted active:text-muted disabled:text-muted-soft',
};

export default function Button({
    variant = 'primary',
    className = '',
    type = 'button',
    disabled,
    children,
    ...rest
}: ButtonProps) {
    return (
        <button
            type={type}
            disabled={disabled}
            className={`inline-flex items-center justify-center gap-2 text-button font-body rounded-md px-5 h-10 transition-colors ${
                disabled ? 'cursor-not-allowed' : 'cursor-pointer'
            } ${variantClasses[variant]} ${className}`}
            {...rest}
        >
            {children}
        </button>
    );
}

/** Varian link agar CTA navigasi tidak menaruh <button> di dalam <Link>. */
export function ButtonLink({
    href,
    variant = 'primary',
    className = '',
    children,
}: {
    href: string;
    variant?: ButtonVariant;
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <Link
            href={href}
            className={`inline-flex items-center justify-center gap-2 text-button font-body rounded-md px-5 h-10 transition-colors cursor-pointer ${variantClasses[variant]} ${className}`}
        >
            {children}
        </Link>
    );
}
