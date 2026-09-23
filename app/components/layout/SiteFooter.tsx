import React from 'react';

/**
 * Spec: DESIGN.md > components.footer
 * Satu-satunya surface gelap di setiap halaman:
 * bg {colors.surface-dark}, teks {colors.on-dark-soft}, padding vertikal 64px.
 * Dipakai bersama oleh landing page dan halaman review.
 */
export default function SiteFooter() {
    return (
        <footer className="bg-surface-dark text-on-dark-soft py-16 px-6 mt-auto">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <div>
                    <div className="flex items-center gap-2 text-on-dark font-display font-semibold text-title-md mb-4">
                        <span className="w-6 h-6 rounded-full bg-on-dark text-surface-dark flex items-center justify-center text-xs font-semibold">
                            AI
                        </span>
                        Resum<span className="text-on-dark-soft">ai</span>
                    </div>
                    <p className="text-body-sm text-on-dark-soft">
                        © {new Date().getFullYear()} Resuma — AI Resume Reviewer.
                        <br />
                        AI powered recruitment tools for the modern workforce.
                    </p>
                </div>
                <p className="text-caption text-on-dark-soft/70">
                    Created by Andra while enjoying a cup of coffee.
                </p>
            </div>
        </footer>
    );
}
