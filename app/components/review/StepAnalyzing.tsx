'use client';

import React from 'react';
import { ResumeAnalysisResult } from '@/app/types';
import AnalysisResultView from '@/app/components/AnalysisResultView';
import Alert from '@/app/components/ui/Alert';
import Button from '@/app/components/ui/Button';

interface StepAnalyzingProps {
    partialData: Partial<ResumeAnalysisResult> | null;
    originalText: string;
    streamError: Error | null;
    onRetry: () => void;
    onBack: () => void;
}

/**
 * Langkah 3 — analisis berjalan (streaming).
 * Hasil tampil progresif; bila stream gagal, tampilkan error + jalan kembali
 * (bukan banner global yang bisa tertukar dengan konteks lain).
 */
export default function StepAnalyzing({ partialData, originalText, streamError, onRetry, onBack }: StepAnalyzingProps) {
    if (streamError) {
        return (
            <div className="max-w-4xl mx-auto space-y-4 animate-fade-in-up">
                <Alert title="Analisis gagal dijalankan">{streamError.message}</Alert>
                <div className="flex items-center justify-center gap-3">
                    <Button variant="secondary" onClick={onBack}>
                        Kembali ke Konfirmasi
                    </Button>
                    <Button onClick={onRetry}>Coba Lagi</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-4">
            <AnalysisResultView data={partialData} isStreaming onReset={onBack} originalText={originalText} />
        </div>
    );
}
