import React from 'react';

/**
 * Spec: DESIGN.md > components.text-input / text-input-focused
 * bg canvas, teks ink, typography body-md, radius {rounded.md},
 * padding 10px 14px, height 40px, 1px hairline. Focus: border → ink.
 */
export function Input({ className = '', ...rest }: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            className={`w-full bg-canvas text-ink text-body-md font-body rounded-md px-3.5 h-10 border border-hairline focus:outline-none focus:border-ink transition-colors ${className}`}
            {...rest}
        />
    );
}

export function Textarea({
    className = '',
    ...rest
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <textarea
            className={`w-full bg-canvas text-ink text-body-md font-body rounded-md px-3.5 py-2.5 border border-hairline focus:outline-none focus:border-ink transition-colors resize-none ${className}`}
            {...rest}
        />
    );
}

/** Label form mengikuti caption token (13px / 500). */
export function FieldLabel({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
    return (
        <label htmlFor={htmlFor} className="block text-caption text-muted mb-1.5">
            {children}
        </label>
    );
}
