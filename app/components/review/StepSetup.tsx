'use client';

import React from 'react';
import { OutputLanguage, ParsedFile } from '@/app/types';
import ResumeUploader from '@/app/components/ResumeUploader';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import { Textarea, FieldLabel } from '@/app/components/ui/Input';
import { NavPillGroup, NavPillItem } from '@/app/components/ui/NavPillGroup';

interface StepSetupProps {
    parsedFile: ParsedFile | null;
    onParsed: (file: ParsedFile) => void;
    onClear: () => void;
    jobDescription: string;
    onJobDescriptionChange: (value: string) => void;
    language: OutputLanguage;
    onLanguageChange: (lang: OutputLanguage) => void;
    onContinue: () => void;
}

/**
 * Langkah 1 — SEMUA input terkumpul di satu kartu:
 * upload file + Job Description + bahasa output, lalu lanjut ke konfirmasi.
 * Menutup pain point "lupa isi JD/bahasa sebelum analisis".
 */
export default function StepSetup({
    parsedFile,
    onParsed,
    onClear,
    jobDescription,
    onJobDescriptionChange,
    language,
    onLanguageChange,
    onContinue,
}: StepSetupProps) {
    const hasJd = jobDescription.trim().length > 0;

    return (
        <Card className="max-w-2xl mx-auto shadow-card">
            {/* Card Header */}
            <div className="flex items-start justify-between gap-4 pb-6 mb-6 border-b border-hairline-soft">
                <div>
                    <h2 className="font-display text-title-lg text-ink leading-tight">
                        Siapkan Analisis Resume
                    </h2>
                    <p className="text-body-sm text-muted mt-1">
                        Unggah file, atur opsi analisis, lalu lanjut ke konfirmasi.
                    </p>
                </div>
                <span className="bg-surface-card text-ink text-caption font-body px-3 py-1 rounded-pill border border-hairline shrink-0">
                    PDF / DOCX
                </span>
            </div>

            {/* 1. Upload */}
            <div className="space-y-6">
                <div>
                    <FieldLabel>1. File Resume</FieldLabel>
                    <ResumeUploader parsedFile={parsedFile} onParsed={onParsed} onClear={onClear} />
                </div>

                {/* 2. Job Description (opsional, tapi eksplisit) */}
                <div>
                    <FieldLabel htmlFor="job-description">
                        2. Job Description Target <span className="text-muted-soft">(Opsional)</span>
                    </FieldLabel>
                    <Textarea
                        id="job-description"
                        value={jobDescription}
                        onChange={(e) => onJobDescriptionChange(e.target.value)}
                        placeholder="Tempelkan deskripsi lowongan kerja di sini..."
                        rows={3}
                    />
                    <p className="text-caption text-muted mt-1.5">
                        {hasJd
                            ? '✓ Keyword Gap Analysis akan diaktifkan berdasarkan deskripsi ini.'
                            : 'Kosongkan untuk evaluasi standar industri universal (tanpa Keyword Gap Analysis).'}
                    </p>
                </div>

                {/* 3. Bahasa output (dipindahkan dari nav ke sini) */}
                <div>
                    <FieldLabel>3. Bahasa Output Analisis</FieldLabel>
                    <NavPillGroup>
                        <NavPillItem active={language === 'id'} onClick={() => onLanguageChange('id')}>
                            🇮🇩 Indonesia
                        </NavPillItem>
                        <NavPillItem active={language === 'en'} onClick={() => onLanguageChange('en')}>
                            🇬🇧 English
                        </NavPillItem>
                    </NavPillGroup>
                    <p className="text-caption text-muted mt-1.5">
                        Seluruh analisis, feedback, dan saran rewrite akan ditulis dalam bahasa ini.
                    </p>
                </div>

                {/* Lanjut ke Konfirmasi — aktif hanya setelah file ter-parse */}
                <div className="flex justify-end pt-4 border-t border-hairline-soft">
                    <Button onClick={onContinue} disabled={!parsedFile}>
                        Lanjut ke Konfirmasi
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </Button>
                </div>
            </div>
        </Card>
    );
}
