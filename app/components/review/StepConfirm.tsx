'use client';

import React from 'react';
import { OutputLanguage, ParsedFile } from '@/app/types';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Badge from '@/app/components/ui/Badge';

interface StepConfirmProps {
    parsedFile: ParsedFile;
    jobDescription: string;
    language: OutputLanguage;
    onBack: () => void;
    onConfirm: () => void;
}

/**
 * Langkah 2 — konfirmasi terakhir SEBELUM analisis dipicu.
 * User memastikan file, JD, dan bahasa sudah benar di sini (satu pemicu analisis).
 */
export default function StepConfirm({ parsedFile, jobDescription, language, onBack, onConfirm }: StepConfirmProps) {
    const hasJd = jobDescription.trim().length > 0;

    return (
        <Card className="max-w-2xl mx-auto shadow-card">
            <div className="pb-6 mb-6 border-b border-hairline-soft">
                <h2 className="font-display text-title-lg text-ink leading-tight">
                    Konfirmasi Sebelum Analisis
                </h2>
                <p className="text-body-sm text-muted mt-1">
                    Periksa kembali ringkasan di bawah. Analisis AI dimulai setelah Anda menekan tombol
                    &quot;Mulai Analisis AI&quot;.
                </p>
            </div>

            {/* Ringkasan input */}
            <dl className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                    <dt className="text-caption text-muted uppercase tracking-wider pt-0.5 shrink-0">File Resume</dt>
                    <dd className="text-right min-w-0">
                        <p className="text-body-sm font-semibold text-ink break-all">{parsedFile.filename}</p>
                        <p className="text-caption text-muted mt-0.5">{parsedFile.text.length} karakter teks</p>
                    </dd>
                </div>

                <div className="flex items-start justify-between gap-4 pt-4 border-t border-hairline-soft">
                    <dt className="text-caption text-muted uppercase tracking-wider pt-0.5 shrink-0">Job Description</dt>
                    <dd className="text-right min-w-0">
                        {hasJd ? (
                            <>
                                <Badge tone="success">✓ Terisi ({jobDescription.trim().length} karakter)</Badge>
                                <p className="text-caption text-muted mt-1 line-clamp-2">
                                    {jobDescription.trim()}
                                </p>
                            </>
                        ) : (
                            <Badge tone="neutral">Tidak ada — evaluasi standar industri</Badge>
                        )}
                    </dd>
                </div>

                <div className="flex items-start justify-between gap-4 pt-4 border-t border-hairline-soft">
                    <dt className="text-caption text-muted uppercase tracking-wider pt-0.5 shrink-0">Bahasa Output</dt>
                    <dd>
                        <Badge tone="neutral">{language === 'id' ? '🇮🇩 Bahasa Indonesia' : '🇬🇧 English'}</Badge>
                    </dd>
                </div>
            </dl>

            {/* Preview teks singkat */}
            <div className="mt-6 pt-5 border-t border-hairline-soft">
                <p className="text-caption text-muted uppercase tracking-wider mb-2">Preview Teks Resume</p>
                <div className="bg-surface-soft p-3 border border-hairline rounded-md h-32 overflow-y-auto text-body-sm text-body font-mono leading-relaxed whitespace-pre-wrap select-all">
                    {parsedFile.text}
                </div>
            </div>

            {/* Aksi */}
            <div className="flex items-center justify-between gap-3 pt-6 mt-6 border-t border-hairline-soft">
                <Button variant="secondary" onClick={onBack}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Kembali
                </Button>
                <Button onClick={onConfirm}>
                    Mulai Analisis AI
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </Button>
            </div>
        </Card>
    );
}
