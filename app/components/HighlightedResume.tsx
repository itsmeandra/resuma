'use client';

import React, { useState } from 'react';
import { GenericPhrase } from '@/app/types';

interface HighlightedResumeProps {
    text: string;
    genericPhrases?: GenericPhrase[];
}

export default function HighlightedResume({ text, genericPhrases = [] }: HighlightedResumeProps) {
    const [activeTooltip, setActiveTooltip] = useState<number | null>(null);

    const containerClass =
        'bg-canvas p-4 border border-hairline rounded-md h-64 overflow-y-auto text-body-sm text-body font-mono leading-relaxed whitespace-pre-wrap';

    // Jika belum ada frasa klise yang terdeteksi, tampilkan teks biasa
    if (!genericPhrases || genericPhrases.length === 0) {
        return <div className={containerClass}>{text}</div>;
    }

    // Fungsi untuk memecah teks dan menyisipkan highlight
    const renderHighlightedText = () => {
        let result: React.ReactNode[] = [text];

        genericPhrases.forEach((phrase, index) => {
            if (!phrase.text) return;

            const newResult: React.ReactNode[] = [];
            // Gunakan regex case-insensitive untuk berjaga-jaga AI mengubah kapitalisasi
            const regex = new RegExp(`(${phrase.text})`, 'gi');

            result.forEach((part) => {
                if (typeof part === 'string') {
                    const splitText = part.split(regex);
                    splitText.forEach((fragment) => {
                        if (fragment.toLowerCase() === phrase.text.toLowerCase()) {
                            newResult.push(
                                <span
                                    key={`${index}-${fragment}`}
                                    className="relative inline-block bg-warning/20 text-warning border-b border-warning/50 cursor-pointer rounded-sm px-0.5 mx-0.5 font-semibold transition-colors hover:bg-warning/30"
                                    onMouseEnter={() => setActiveTooltip(index)}
                                    onMouseLeave={() => setActiveTooltip(null)}
                                    onClick={() => setActiveTooltip(activeTooltip === index ? null : index)}
                                >
                                    {fragment}
                                    {activeTooltip === index && (
                                        <span className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 sm:w-64 p-3 bg-surface-dark text-on-dark text-caption font-body rounded-lg shadow-card leading-relaxed pointer-events-none">
                                            <strong className="block text-warning mb-1">Ganti dengan:</strong>
                                            {phrase.suggestion}
                                            <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-surface-dark" />
                                        </span>
                                    )}
                                </span>
                            );
                        } else {
                            newResult.push(fragment);
                        }
                    });
                } else {
                    newResult.push(part);
                }
            });
            result = newResult;
        });

        return result;
    };

    return <div className={containerClass}>{renderHighlightedText()}</div>;
}
