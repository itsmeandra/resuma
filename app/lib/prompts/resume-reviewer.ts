import { Type, Schema } from '@google/genai';

/**
 * 1. SKEMA OUTPUT JSON (Gemini Structured Output)
 * Mengunci struktur balasan AI agar TIDAK PERNAH meleset atau rusak formatnya.
 */
export const resumeAnalysisSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        detectedRole: {
            type: Type.STRING,
            description: 'Profesi atau posisi target yang terdeteksi dari CV (misal: Frontend Developer, Akuntan, Marketing Manager, Fresh Graduate).'
        },
        detectedLanguage: {
            type: Type.STRING,
            description: 'Bahasa dominan yang digunakan dalam CV (id atau en).'
        },
        executiveSummary: {
            type: Type.STRING,
            description: 'Ringkasan eksekutif 2-3 kalimat mengenai kondisi keseluruhan resume, kekuatan utama, dan kelemahan fatal.'
        },
        overallScore: {
            type: Type.INTEGER,
            description: 'Skor keseluruhan resume dari skala 0 sampai 100 berdasarkan kejelasan, dampak, ATS, dan tata bahasa.'
        },
        sectionScores: {
            type: Type.OBJECT,
            description: 'Breakdown skor per bagian resume (skala 0-100)',
            properties: {
                summary: { type: Type.INTEGER, description: 'Skor bagian Profil/Summary' },
                experience: { type: Type.INTEGER, description: 'Skor bagian Pengalaman Kerja/Organisasi' },
                education: { type: Type.INTEGER, description: 'Skor bagian Pendidikan' },
                skills: { type: Type.INTEGER, description: 'Skor relevansi dan penulisan Keahlian/Skills' },
            },
            required: ['summary', 'experience', 'education', 'skills'],
        },
        genericPhrases: {
            type: Type.ARRAY,
            description: 'Daftar frasa klise/generic yang tidak memiliki bukti konkret (maksimal 5 item)',
            items: {
                type: Type.OBJECT,
                properties: {
                    text: { type: Type.STRING, description: 'Kalimat/frasa klise yang ditemukan di resume' },
                    location: { type: Type.STRING, description: 'Lokasi frasa tersebut (misal: Summary, Experience PT X)' },
                    suggestion: { type: Type.STRING, description: 'Saran singkat cara mengganti frasa tersebut agar lebih berdampak' },
                },
                required: ['text', 'location', 'suggestion'],
            },
        },
        rewriteSuggestions: {
            type: Type.ARRAY,
            description: 'Saran penulisan ulang poin pengalaman kerja menggunakan metode STAR (Situation, Task, Action, Result) - maksimal 4 item',
            items: {
                type: Type.OBJECT,
                properties: {
                    original: { type: Type.STRING, description: 'Poin pengalaman asli dari resume yang kurang kuat' },
                    improved: { type: Type.STRING, description: 'Hasil penulisan ulang dengan metode STAR dan berorientasi pada dampak (action verbs + metrics)' },
                    reasoning: { type: Type.STRING, description: 'Penjelasan mengapa versi baru lebih baik dan apa elemen STAR yang ditambahkan' },
                },
                required: ['original', 'improved', 'reasoning'],
            },
        },
        atsIssues: {
            type: Type.ARRAY,
            description: 'Masalah kompatibilitas ATS (Applicant Tracking System) yang ditemukan',
            items: {
                type: Type.OBJECT,
                properties: {
                    issue: { type: Type.STRING, description: 'Masalah format atau konten yang merugikan di mata ATS' },
                    severity: { type: Type.STRING, description: 'Tingkat keparahan: low, medium, atau high' },
                    recommendation: { type: Type.STRING, description: 'Cara praktis memperbaiki masalah ATS tersebut' },
                },
                required: ['issue', 'severity', 'recommendation'],
            },
        },
    },
    required: [
        'detectedRole',
        'detectedLanguage',
        'executiveSummary',
        'overallScore',
        'sectionScores',
        'genericPhrases',
        'rewriteSuggestions',
        'atsIssues',
    ],
};

/**
 * 2. PROMPT BUILDER FUNCTION
 * Merakit instruksi sistem (Persona AI + Kriteria Multi-Profesi + Instruksi Bahasa)
 */
export function buildResumeReviewPrompt(
    resumeText: string,
    outputLanguage: 'id' | 'en' = 'id',
    jobDescription?: string
): string {
    const langInstruction = outputLanguage === 'id'
        ? 'ATURAN MUTLAK: TULIS SELURUH ANALISIS, FEEDBACK, DAN SARAN (TERMASUK REWRITE) FULL DALAM BAHASA INDONESIA YANG PROFESIONAL. Jika CV asli berbahasa Inggris, Anda WAJIB menerjemahkan saran perbaikannya ke Bahasa Indonesia.'
        : 'STRICT RULE: WRITE THE ENTIRE ANALYSIS, FEEDBACK, AND SUGGESTIONS (INCLUDING REWRITES) FULLY IN PROFESSIONAL ENGLISH. If the original CV is in Indonesian, you MUST translate the suggestions into English.';

    const jdContext = jobDescription && jobDescription.trim() !== ''
        ? `\n[TARGET JOB DESCRIPTION]:\n${jobDescription}\n(Evaluasi resume ini BERDASARKAN relevansinya dengan Job Description di atas! Cek keyword yang hilang atau kurang ditekankan).`
        : '\n[TARGET JOB DESCRIPTION]: Tidak disediakan. Evaluasi berdasarkan standar industri universal untuk profesi yang Anda deteksi dari resume.';

    return `
PERAN ANDA:
Anda adalah seorang Ahli Rekrutmen Senior, Career Coach Eksekutif, dan Spesialis Sistem ATS (Applicant Tracking System) kelas dunia dengan pengalaman 15+ tahun merekrut, Anda mahir mengevaluasi SEMUA JENIS POSISI (IT, Finance, Marketing, Sales, Healthcare, Fresh Graduate, dll).

${langInstruction}
KODE ETIK EVALUASI (MULTI-PROFESI):
1. DETEKSI PROFESI OTOMATIS: Identifikasi bidang dan level senioritas kandidat dari teks resume.
2. STANDAR EVALUASI DINAMIS: Sesuaikan kritik Anda dengan profesi tersebut. 
   - Tech: Cari efisiensi, stack, skala sistem.
   - Sales/Marketing: Cari metrik ROI, konversi, target penjualan.
   - Finance/Ops: Cari efisiensi budget, akurasi, kepatuhan.
   - Design/Kreatif: Cari dampak proyek, konversi UX, portofolio.
3. METODE STAR: Saat memberikan saran penulisan ulang (rewriteSuggestions), gunakan kerangka STAR (Situation, Task, Action, Result) yang relevan dengan profesi kandidat.
4. DETEKSI FRASA KLISE: Cari kata sifat pemalas (misal: "hardworking", "teliti") dan sarankan metrik pengganti.
5. ATS COMPATIBILITY: Evaluasi format teks yang merugikan di mata software ATS.

[TEKS RESUME KANDIDAT]:
"""
${resumeText}
"""

PENTING:
Kembalikan HANYA objek JSON yang valid sesuai skema yang telah ditentukan. Jangan menambahkan teks pembuka, penutup, atau blok markdown apa pun di luar JSON tersebut.
`.trim();
}