// Tipe untuk state upload file di UI
export type UploadState = 'idle' | 'parsing' | 'analyzing' | 'done' | 'error';

// Tipe untuk sub-skor per section resume
export interface SectionScores {
    summary: number;
    experience: number;
    education: number;
    skills: number;
}

// Tipe untuk deteksi frasa klise/generic
export interface GenericPhrase {
    text: string;
    location: string;
    suggestion: string;
}

// Tipe untuk saran penulisan ulang berbasis STAR
export interface RewriteSuggestion {
    original: string;
    improved: string;
    reasoning: string;
}

// Tipe untuk isu kompatibilitas ATS
export interface AtsIssue {
    issue: string;
    severity: 'low' | 'medium' | 'high';
    recommendation: string;
}

// Skema utama JSON output dari AI
export interface ResumeAnalysisResult {
    detectedRole: string;
    detectedLanguage: string;
    executiveSummary: string;
    overallScore: number;
    sectionScores: SectionScores;
    genericPhrases: GenericPhrase[];
    rewriteSuggestions: RewriteSuggestion[];
    atsIssues: AtsIssue[];
}