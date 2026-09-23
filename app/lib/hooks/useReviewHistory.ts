import { useLocalStorage } from '@/app/lib/hooks/useLocalStorage';
import { OutputLanguage, ResumeAnalysisResult } from '@/app/types';

export interface HistoryItem {
    id: string;
    date: string;
    filename: string;
    originalText: string;
    data: ResumeAnalysisResult;
    /** Konteks analisis — opsional agar data riwayat lama (tanpa field ini) tetap aman dibaca */
    language?: OutputLanguage;
    jobDescription?: string;
}

export interface HistoryContext {
    language?: OutputLanguage;
    jobDescription?: string;
}

const STORAGE_KEY = 'resume_review_history';
const MAX_HISTORY = 10;
const EMPTY_HISTORY: HistoryItem[] = [];

export function useReviewHistory() {
    // Disimpan di localStorage (client-side, tanpa autentikasi) via useSyncExternalStore
    const [history, setHistory] = useLocalStorage<HistoryItem[]>(STORAGE_KEY, EMPTY_HISTORY);

    // Menyimpan hasil analisis baru (beserta konteks JD & bahasa agar tidak hilang)
    const saveToHistory = (
        filename: string,
        originalText: string,
        data: ResumeAnalysisResult,
        context: HistoryContext = {}
    ) => {
        const newItem: HistoryItem = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            filename,
            originalText,
            data,
            language: context.language,
            jobDescription: context.jobDescription,
        };

        // Simpan maksimal 10 riwayat terakhir agar tidak memenuhi storage
        setHistory((prev) => [newItem, ...prev].slice(0, MAX_HISTORY));
    };

    const clearHistory = () => {
        setHistory(EMPTY_HISTORY);
    };

    return { history, saveToHistory, clearHistory };
}
