import { useState, useEffect } from 'react';
import { ResumeAnalysisResult } from '@/app/types';

export interface HistoryItem {
    id: string;
    date: string;
    filename: string;
    originalText: string;
    data: ResumeAnalysisResult;
}

export function useReviewHistory() {
    const [history, setHistory] = useState<HistoryItem[]>([]);

    // Load history dari localStorage saat komponen pertama kali di-render
    useEffect(() => {
        const stored = localStorage.getItem('resume_review_history');
        if (stored) {
            try {
                setHistory(JSON.parse(stored));
            } catch (e) {
                console.error('Gagal memuat riwayat:', e);
            }
        }
    }, []);

    // Menyimpan hasil analisis baru
    const saveToHistory = (filename: string, originalText: string, data: ResumeAnalysisResult) => {
        const newItem: HistoryItem = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            filename,
            originalText,
            data,
        };

        // Simpan maksimal 10 riwayat terakhir agar tidak memenuhi storage
        const updatedHistory = [newItem, ...history].slice(0, 10);
        setHistory(updatedHistory);
        localStorage.setItem('resume_review_history', JSON.stringify(updatedHistory));
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem('resume_review_history');
    };

    return { history, saveToHistory, clearHistory };
}