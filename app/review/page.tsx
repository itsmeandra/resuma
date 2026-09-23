'use client';

import React, { useEffect, useState } from 'react';
import SiteHeader from '@/app/components/layout/SiteHeader';
import SiteFooter from '@/app/components/layout/SiteFooter';
import Stepper, { StepItem, StepStatus } from '@/app/components/ui/Stepper';
import Badge from '@/app/components/ui/Badge';
import StepSetup from '@/app/components/review/StepSetup';
import StepConfirm from '@/app/components/review/StepConfirm';
import StepAnalyzing from '@/app/components/review/StepAnalyzing';
import StepResult from '@/app/components/review/StepResult';
import { HistoryItem, useReviewHistory } from '@/app/lib/hooks/useReviewHistory';
import { useAnalysisStream } from '@/app/lib/hooks/useAnalysisStream';
import { useLocalStorage } from '@/app/lib/hooks/useLocalStorage';
import { OutputLanguage, ParsedFile, ResumeAnalysisResult, WizardStep } from '../types';

const STEP_ORDER: WizardStep[] = ['setup', 'confirm', 'analyzing', 'result'];
const STEP_LABELS: Record<WizardStep, string> = {
    setup: 'Upload & Opsi',
    confirm: 'Konfirmasi',
    analyzing: 'Analisis AI',
    result: 'Hasil',
};

/**
 * Halaman review sebagai wizard 4 langkah:
 *   1. Setup (upload + JD + bahasa) → 2. Konfirmasi → 3. Analisis (streaming) → 4. Hasil
 * Stepper nyata di header selalu mencerminkan posisi langkah; riwayat hanya bisa
 * dibuka dalam mode view-only dari Step 1 agar tidak tertukar dengan analisis live.
 */
export default function ReviewPage() {
    const [step, setStep] = useState<WizardStep>('setup');
    const [parsedFile, setParsedFile] = useState<ParsedFile | null>(null);
    const [jobDescription, setJobDescription] = useState<string>('');
    const [resultData, setResultData] = useState<Partial<ResumeAnalysisResult> | null>(null);
    const [viewingHistory, setViewingHistory] = useState<HistoryItem | null>(null);

    // Bahasa tersimpan di localStorage (selector dipindahkan dari nav ke Step Setup, persistensi tetap sama)
    const [storedLanguage, setStoredLanguage] = useLocalStorage<OutputLanguage>(
        'preferred_language',
        'id'
    );

    const { history, saveToHistory, clearHistory } = useReviewHistory();
    const { partialData, streamError, startStream, resetStream } = useAnalysisStream();

    // Normalisasi nilai legacy (data lama tersimpan tanpa JSON.stringify)
    const language: OutputLanguage = storedLanguage === 'en' ? 'en' : 'id';

    // Selalu mulai dari atas setiap pergantian langkah
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [step]);

    const handleLanguageChange = (lang: OutputLanguage) => {
        setStoredLanguage(lang);
    };

    const stepIndex = STEP_ORDER.indexOf(step);
    const originalText = viewingHistory ? viewingHistory.originalText : (parsedFile?.text ?? '');

    // Navigasi antar langkah via stepper — hanya mundur, dan hanya sebelum analisis berjalan
    const canNavigateFreely = step === 'setup' || step === 'confirm';
    const stepItems: StepItem[] = STEP_ORDER.map((key, idx) => {
        let status: StepStatus = 'upcoming';
        if (idx < stepIndex) status = 'done';
        else if (idx === stepIndex) status = 'current';

        return {
            label: STEP_LABELS[key],
            status,
            onClick: canNavigateFreely && status === 'done' ? () => setStep(key) : undefined,
        };
    });

    // Satu-satunya pemicu analisis — dipanggil dari Step Konfirmasi (dan retry saat gagal)
    const handleStartAnalysis = () => {
        if (!parsedFile) return;
        setViewingHistory(null);
        setResultData(null);
        setStep('analyzing');

        startStream(
            { resumeText: parsedFile.text, language, jobDescription },
            {
                onSuccess: (finalData) => {
                    setResultData(finalData);
                    setStep('result');
                    saveToHistory(parsedFile.filename, parsedFile.text, finalData, {
                        language,
                        jobDescription,
                    });
                },
            }
        );
    };

    // "Analisis Baru" — kembali ke Step 1 dalam keadaan bersih (JD & bahasa dipertahankan)
    const handleNewAnalysis = () => {
        resetStream();
        setResultData(null);
        setViewingHistory(null);
        setParsedFile(null);
        setStep('setup');
    };

    // Buka item riwayat — mode view-only di Step Hasil dengan banner jelas
    const handleOpenHistory = (item: HistoryItem) => {
        resetStream();
        setViewingHistory(item);
        setResultData(item.data);
        setStep('result');
    };

    return (
        <main className="min-h-screen bg-canvas text-ink font-body flex flex-col">
            <SiteHeader bordered>
                {/* Stepper nyata (desktop) — pengganti pill "palsu" lama */}
                <Stepper steps={stepItems} className="hidden md:inline-flex" />
                {/* Indikator ringkas (mobile) */}
                <span className="md:hidden text-caption text-muted whitespace-nowrap">
                    Langkah {stepIndex + 1}/4 · {STEP_LABELS[step]}
                </span>
            </SiteHeader>

            <div className="flex-1">
                {/* Hero/intro — hanya di Step Setup */}
                {step === 'setup' && (
                    <section className="max-w-3xl mx-auto px-4 md:px-8 pt-12 md:pt-16 pb-10 text-center">
                        <div className="inline-flex items-center gap-2 bg-surface-card border border-hairline px-3 py-1 rounded-pill text-caption text-ink mb-6">
                            <span className="w-2 h-2 rounded-full bg-badge-emerald" />
                            <span>Standar rekrutmen ATS &amp; Metode STAR</span>
                        </div>
                        <h1 className="font-display text-display-md sm:text-display-lg text-ink leading-tight">
                            Mulai diagnostik resume Anda.
                        </h1>
                        <p className="text-body-md text-muted max-w-2xl mx-auto mt-4 leading-relaxed">
                            Unggah file, tempel <i>Job Description</i> target (opsional), dan pilih bahasa
                            output — semua disiapkan di langkah pertama agar tidak ada yang terlewat.
                        </p>
                    </section>
                )}

                {/* Konten wizard */}
                <section className="px-4 md:px-8 pb-12">
                    {step === 'setup' && (
                        <StepSetup
                            parsedFile={parsedFile}
                            onParsed={setParsedFile}
                            onClear={() => setParsedFile(null)}
                            jobDescription={jobDescription}
                            onJobDescriptionChange={setJobDescription}
                            language={language}
                            onLanguageChange={handleLanguageChange}
                            onContinue={() => setStep('confirm')}
                        />
                    )}

                    {step === 'confirm' && parsedFile && (
                        <StepConfirm
                            parsedFile={parsedFile}
                            jobDescription={jobDescription}
                            language={language}
                            onBack={() => setStep('setup')}
                            onConfirm={handleStartAnalysis}
                        />
                    )}

                    {step === 'analyzing' && parsedFile && (
                        <StepAnalyzing
                            partialData={partialData}
                            originalText={parsedFile.text}
                            streamError={streamError}
                            onRetry={handleStartAnalysis}
                            onBack={() => setStep('confirm')}
                        />
                    )}

                    {step === 'result' && (
                        <StepResult
                            data={resultData}
                            originalText={originalText}
                            viewingHistory={viewingHistory}
                            onNewAnalysis={handleNewAnalysis}
                        />
                    )}

                    {/* Riwayat — hanya di Step Setup, terpisah dari hasil live */}
                    {step === 'setup' && history.length > 0 && (
                        <div className="max-w-2xl mx-auto mt-8">
                            <div className="border-t border-hairline-soft pt-6">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-caption text-muted">Riwayat Analisis Terakhir:</span>
                                    <button
                                        type="button"
                                        onClick={clearHistory}
                                        className="text-caption text-error hover:underline"
                                    >
                                        Hapus Semua
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {history.map((item) => (
                                        <button
                                            type="button"
                                            key={item.id}
                                            onClick={() => handleOpenHistory(item)}
                                            className="w-full text-left bg-canvas border border-hairline p-3 rounded-md hover:border-muted flex justify-between items-center gap-3 transition-colors shadow-subtle"
                                        >
                                            <span className="flex items-center gap-3 overflow-hidden min-w-0">
                                                <span className="text-body-sm font-semibold text-ink truncate">
                                                    {item.filename}
                                                </span>
                                                <Badge tone="neutral" className="shrink-0 hidden sm:inline-flex">
                                                    {new Date(item.date).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    })}
                                                </Badge>
                                            </span>
                                            <span className="text-caption text-muted font-semibold bg-surface-soft px-2 py-1 rounded shrink-0">
                                                Skor: {item.data.overallScore}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                                <p className="text-caption text-muted-soft mt-3">
                                    Klik item untuk melihat hasil kembali — mode lihat saja.
                                </p>
                            </div>
                        </div>
                    )}
                </section>
            </div>

            <SiteFooter />
        </main>
    );
}
