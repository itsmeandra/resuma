import React from 'react';

type AlertTone = 'error' | 'success' | 'warning';

interface AlertProps {
    tone?: AlertTone;
    title?: string;
    action?: React.ReactNode;
    children?: React.ReactNode;
}

/**
 * Banner status memakai token semantic {colors.error|success|warning}
 * dengan surface tint (bg-{tone}/10) — konsisten dengan gaya app saat ini.
 */
const toneClasses: Record<AlertTone, string> = {
    error: 'bg-error/10 border-error/20 text-error',
    success: 'bg-success/10 border-success/20 text-success',
    warning: 'bg-warning/10 border-warning/30 text-warning',
};

const toneIcons: Record<AlertTone, string> = {
    error: '⚠️',
    success: '✓',
    warning: '⚠️',
};

export default function Alert({ tone = 'error', title, action, children }: AlertProps) {
    return (
        <div
            className={`border p-4 rounded-lg text-body-sm font-medium flex items-center justify-between gap-3 shadow-subtle ${toneClasses[tone]}`}
            role="alert"
        >
            <div className="flex items-center gap-3 min-w-0">
                <span aria-hidden className="text-lg shrink-0">
                    {toneIcons[tone]}
                </span>
                <div className="min-w-0">
                    {title && <p className="font-semibold">{title}</p>}
                    {children && <p className="text-body-sm opacity-90">{children}</p>}
                </div>
            </div>
            {action}
        </div>
    );
}
