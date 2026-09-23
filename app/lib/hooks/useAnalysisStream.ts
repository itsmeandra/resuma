'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { OutputLanguage, ResumeAnalysisResult } from '@/app/types';
import { safePartialJsonParse } from '@/app/lib/utils/json-parser';

export interface AnalyzeInput {
    resumeText: string;
    language: OutputLanguage;
    jobDescription: string;
}

/**
 * Streaming analisis resume ke /api/analyze, dikelola TanStack Query
 * (useMutation untuk state loading/error, state partial via useState lokal).
 *
 * - `partialData`   : hasil parsial terbaru (di-update tiap chunk → UI progressive)
 * - `isStreaming`   : true selama stream berjalan (mutation pending)
 * - `streamError`   : Error bila stream gagal / hasil tidak valid
 * - `startStream`   : memulai analisis (otomatis me-reset partial sebelumnya)
 * - `resetStream`   : bersihkan semua state stream
 */
export function useAnalysisStream() {
    const [partialData, setPartialData] = useState<Partial<ResumeAnalysisResult> | null>(null);

    const mutation = useMutation({
        mutationFn: async ({ resumeText, language, jobDescription }: AnalyzeInput) => {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resumeText, language, jobDescription }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Server Error (${response.status})`);
            }
            if (!response.body) {
                throw new Error('Gagal memulai streaming dari server.');
            }

            // Baca aliran stream dari API Route menggunakan ReadableStream Reader
            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let accumulatedJson = '';
            let finalData: Partial<ResumeAnalysisResult> | null = null;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                accumulatedJson += decoder.decode(value, { stream: true });
                const partial = safePartialJsonParse(accumulatedJson);
                if (partial) {
                    finalData = partial;
                    setPartialData({ ...partial });
                }
            }

            if (!finalData || finalData.overallScore === undefined) {
                throw new Error('Analisis tidak lengkap (skor tidak diterima). Silakan coba lagi.');
            }
            return finalData as ResumeAnalysisResult;
        },
    });

    const startStream = (
        input: AnalyzeInput,
        callbacks?: { onSuccess?: (data: ResumeAnalysisResult) => void; onError?: (err: Error) => void }
    ) => {
        setPartialData(null);
        mutation.mutate(input, callbacks);
    };

    const resetStream = () => {
        setPartialData(null);
        mutation.reset();
    };

    return {
        partialData,
        isStreaming: mutation.isPending,
        streamError: mutation.isError ? (mutation.error as Error) : null,
        startStream,
        resetStream,
    };
}
