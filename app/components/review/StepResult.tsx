'use client';

import React from 'react';
import { ResumeAnalysisResult } from '@/app/types';
import { HistoryItem } from '@/app/lib/hooks/useReviewHistory';
import AnalysisResultView from '@/app/components/AnalysisResultView';
import HistoryBanner from '@/app/components/review/HistoryBanner';

interface StepResultProps {
    data: Partial<ResumeAnalysisResult> | null;
    originalText: string;
    /** Diisi bila Step Hasil membuka data riwayat (mode view-only). */
    viewingHistory: HistoryItem | null;
    onNewAnalysis: () => void;
}

/**
 * Langkah 4 — hasil final.
 * Bila dibuka dari riwayat, tampilkan banner jelas + jalur kembali ke analisis baru.
 */
export default function StepResult({ data, originalText, viewingHistory, onNewAnalysis }: StepResultProps) {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {viewingHistory && <HistoryBanner item={viewingHistory} onNewAnalysis={onNewAnalysis} />}
            <AnalysisResultView data={data} isStreaming={false} onReset={onNewAnalysis} originalText={originalText} />
        </div>
    );
}
