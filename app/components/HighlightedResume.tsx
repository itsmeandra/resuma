'use client';

import React, { useState } from 'react';
import { GenericPhrase } from '@/app/types';

interface HighlightedResumeProps {
    text: string;
    genericPhrases?: GenericPhrase[];
}

export default function HighlightedResume({ text, genericPhrases = [] }: HighlightedResumeProps) {
    const [activeTooltip, setActiveTooltip] = useState<number | null>(null);

    // Jika belum ada frasa klise yang terdeteksi, tampilkan teks biasa
    if (!genericPhrases || genericPhrases.length === 0) {
        return (
            <div className="bg-canvas p-4 border border-hairline rounded-lg h-64 overflow-y-auto text-[13px] text-body font-mono leading-relaxed whitespace-pre-wrap">
                {text}
            </div>
        );
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
                                    {/* Tooltip bergaya Cal.com */}
                                    {activeTooltip === index && (
                                        <span className="absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-surface-dark text-on-dark text-[11px] font-body font-normal rounded-md shadow-lg leading-tight pointer-events-none">
                                            <strong className="block text-warning mb-1">Ganti dengan:</strong>
                                            {phrase.suggestion}
                                            <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-surface-dark"></span>
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

    return (
        <div className="bg-canvas p-4 border border-hairline rounded-lg h-64 overflow-y-auto text-[13px] text-body font-mono leading-relaxed whitespace-pre-wrap">
            {renderHighlightedText()}
        </div>
    );
}