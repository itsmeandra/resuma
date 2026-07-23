import { ResumeAnalysisResult } from '@/app/types';

/**
 * Mencoba memparsing string JSON yang mungkin masih belum lengkap (parsial) akibat streaming.
 * Jika gagal di-parse biasa, fungsi ini akan mencoba menutup bracket/brace yang terbuka secara best-effort.
 */
export function safePartialJsonParse(jsonString: string): Partial<ResumeAnalysisResult> | null {
    if (!jsonString || jsonString.trim() === '') return null;

    // Coba parse normal terlebih dahulu (jika stream sudah selesai 100%)
    try {
        return JSON.parse(jsonString) as ResumeAnalysisResult;
    } catch (e) {
        // Lanjut ke best-effort parsing jika masih parsial
    }

    // Teknik Best-Effort: Hitung kurung kurawal & siku yang belum tutup, lalu tutup secara manual
    let cleaned = jsonString.trim();

    // Jika diakhiri dengan koma atau titik dua yang gantung, hapus dulu
    cleaned = cleaned.replace(/,\s*$/, '').replace(/:\s*$/, '');

    let openBraces = 0;
    let openBrackets = 0;
    let inString = false;
    let escapeNext = false;

    for (let i = 0; i < cleaned.length; i++) {
        const char = cleaned[i];
        if (escapeNext) {
            escapeNext = false;
            continue;
        }
        if (char === '\\') {
            escapeNext = true;
            continue;
        }
        if (char === '"') {
            inString = !inString;
            continue;
        }
        if (!inString) {
            if (char === '{') openBraces++;
            else if (char === '}') openBraces--;
            else if (char === '[') openBrackets++;
            else if (char === ']') openBrackets--;
        }
    }

    // Jika string terputus di tengah kutipan teks, tutup kutipannya
    if (inString) cleaned += '"';

    // Tutup array yang masih terbuka
    while (openBrackets > 0) {
        cleaned += ']';
        openBrackets--;
    }

    // Tutup object yang masih terbuka
    while (openBraces > 0) {
        cleaned += '}';
        openBraces--;
    }

    // Coba parse kembali string yang sudah "diperbaiki"
    try {
        return JSON.parse(cleaned) as Partial<ResumeAnalysisResult>;
    } catch (e) {
        // Jika masih gagal (karena potongannya terlalu awal), kembalikan null
        return null;
    }
}