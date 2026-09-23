'use client';

import React, { useRef, useState } from 'react';
import { ResumeAnalysisResult } from '@/app/types';
import HighlightedResume from './HighlightedResume';
import { useReactToPrint } from 'react-to-print';
import Button from '@/app/components/ui/Button';
import Badge from '@/app/components/ui/Badge';

interface AnalysisResultViewProps {
    data: Partial<ResumeAnalysisResult> | null;
    isStreaming: boolean;
    onReset: () => void;
    originalText: string;
}

export default function AnalysisResultView({ data, isStreaming, onReset, originalText }: AnalysisResultViewProps) {
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    // Ref untuk target elemen yang akan di-export ke PDF
    const printRef = useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Resume_Analysis_${data?.detectedRole?.replace(/\s+/g, '_') || 'Report'}`,
    });

    if (!data && isStreaming) {
        // Tampilan loading awal (sebelum chunk pertama berhasil di-parse)
        return (
            <div className="w-full max-w-4xl mx-auto bg-canvas border border-hairline rounded-lg p-6 md:p-12 text-center space-y-6 shadow-card animate-fade-in-up">
                <div className="inline-block w-10 h-10 border-[3px] border-muted border-t-primary rounded-full animate-spin" />
                <div className="space-y-2">
                    <h3 className="font-display text-title-lg text-ink">
                        AI Sedang Membedah Resume Anda...
                    </h3>
                    <p className="text-body-sm text-muted max-w-md mx-auto">
                        Mengevaluasi kompetensi, mengecek kompatibilitas ATS, dan menyusun saran STAR.
                    </p>
                </div>
                {/* Progress bar tidak pasti — stream belum menghasilkan data */}
                <div className="max-w-xs mx-auto h-1 bg-surface-strong rounded-full overflow-hidden" aria-hidden>
                    <div className="w-1/3 h-full bg-primary rounded-full animate-[pulse_1.2s_ease-in-out_infinite]" />
                </div>
            </div>
        );
    }

    if (!data) return null;

    // Fungsi penentu warna skor (Hijau >= 75, Kuning >= 60, Merah < 60)
    const getScoreColor = (score?: number) => {
        if (score === undefined) return 'text-muted bg-surface-soft border-hairline';
        if (score >= 75) return 'text-success bg-success/10 border-success/30';
        if (score >= 60) return 'text-warning bg-warning/10 border-warning/30';
        return 'text-error bg-error/10 border-error/30';
    };

    const handleCopy = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div ref={printRef} className="w-full max-w-4xl mx-auto space-y-8 font-body text-ink animate-fade-in-up">
            {/* HEADER & EXECUTIVE SUMMARY */}
            <div className="bg-canvas border border-hairline rounded-lg p-6 md:p-8 shadow-card relative overflow-hidden">
                {isStreaming && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-surface-strong overflow-hidden">
                        <div className="w-1/3 h-full bg-primary animate-[pulse_1s_ease-in-out_infinite]" />
                    </div>
                )}

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-hairline-soft">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <Badge tone="neutral">{data.detectedRole || 'Mendeteksi Profesi...'}</Badge>
                            <span className="bg-canvas text-muted text-caption font-medium px-2.5 py-0.5 rounded-pill border border-hairline uppercase">
                                LANG: {data.detectedLanguage || 'ID'}
                            </span>
                        </div>
                        <h2 className="font-display text-display-sm md:text-display-md text-ink mt-2">
                            Hasil Diagnostik Resume
                        </h2>
                    </div>

                    {/* OVERALL SCORE BADGE */}
                    <div className="flex items-center gap-4 bg-surface-soft p-4 rounded-lg border border-hairline">
                        <div className="text-right">
                            <p className="text-caption text-muted uppercase">Skor Keseluruhan</p>
                            <p className="text-[11px] text-muted-soft">Standar Industri</p>
                        </div>
                        <div className={`w-16 h-16 rounded-lg flex items-center justify-center font-display text-display-sm border ${getScoreColor(data.overallScore)}`}>
                            {data.overallScore !== undefined ? data.overallScore : '?'}
                        </div>
                    </div>
                </div>

                {/* Executive Summary */}
                <div className="mt-6">
                    <h4 className="text-caption text-muted uppercase tracking-wider mb-2">
                        Ringkasan Eksekutif
                    </h4>
                    <p className="text-body-md text-body leading-relaxed bg-surface-soft/60 p-4 rounded-md border border-hairline-soft">
                        {data.executiveSummary || <span className="text-muted italic animate-pulse">Menulis ringkasan evaluasi...</span>}
                    </p>
                </div>

                {/* Breakdown Section Scores (4 Columns) */}
                {data.sectionScores && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-hairline-soft">
                        {[
                            { label: 'Profil / Summary', score: data.sectionScores.summary },
                            { label: 'Pengalaman', score: data.sectionScores.experience },
                            { label: 'Pendidikan', score: data.sectionScores.education },
                            { label: 'Keahlian / Skills', score: data.sectionScores.skills },
                        ].map((sec) => (
                            <div key={sec.label} className="bg-canvas p-3 rounded-md border border-hairline text-center">
                                <span className="text-caption text-muted block mb-1">{sec.label}</span>
                                <span className={`font-display text-title-md inline-block px-2 py-0.5 rounded ${getScoreColor(sec.score)}`}>
                                    {sec.score !== undefined ? `${sec.score}/100` : '-'}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* KEYWORD GAP ANALYSIS — hanya muncul jika Job Description diinputkan */}
            {data.keywordAnalysis && (
                <div className="bg-canvas border border-hairline rounded-lg p-6 md:p-8 space-y-6 shadow-card">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-hairline-soft pb-5">
                        <div>
                            <h3 className="font-display text-title-lg text-ink">Job Description Match</h3>
                            <p className="text-body-sm text-muted mt-1">
                                Analisis kecocokan keyword (ATS Scanner) antara resume Anda dan deskripsi lowongan.
                            </p>
                        </div>

                        {/* Match Score Indicator */}
                        <div className="flex items-center gap-4 bg-canvas p-3.5 rounded-lg border border-hairline shadow-subtle shrink-0">
                            <span className="text-caption text-muted uppercase">Kecocokan</span>
                            <span className={`font-display text-display-sm ${getScoreColor(data.keywordAnalysis.matchScore)}`}>
                                {data.keywordAnalysis.matchScore !== undefined ? `${data.keywordAnalysis.matchScore}%` : '?'}
                            </span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Matched Keywords */}
                        <div className="space-y-4">
                            <h4 className="text-body-sm font-semibold text-success flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-success shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                                Keyword Ditemukan
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {data.keywordAnalysis.matchedKeywords?.map((kw, i) => (
                                    <span key={i} className="bg-success/10 text-success border border-success/20 text-caption font-body px-3 py-1.5 rounded-pill">{kw}</span>
                                ))}
                            </div>
                        </div>

                        {/* Missing Keywords (Gap) */}
                        <div className="space-y-4">
                            <h4 className="text-body-sm font-semibold text-error flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-error shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
                                Keyword Hilang
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {data.keywordAnalysis.missingKeywords?.map((kw, i) => (
                                    <span key={i} className="bg-error/10 text-error border border-error/20 text-caption font-body px-3 py-1.5 rounded-pill">{kw}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-canvas border border-hairline p-4 rounded-md flex items-start gap-3 mt-4">
                        <p className="text-body-sm text-muted leading-relaxed">
                            <strong className="text-ink">Strategi:</strong> Pastikan untuk menyelipkan kata kunci yang berada di zona merah (hilang) ke dalam bagian &quot;Keahlian&quot; (Skills) atau secara natural ke dalam poin &quot;Pengalaman&quot; (Experience) pada resume Anda sebelum melamar posisi ini.
                        </p>
                    </div>
                </div>
            )}

            {/* REWRITE SUGGESTIONS (STAR METHOD) CARD */}
            <div className="bg-canvas border border-hairline rounded-lg p-6 md:p-8 space-y-6 shadow-card">
                <div>
                    <h3 className="font-display text-title-lg text-ink">
                        Saran Penulisan Ulang (Metode STAR)
                    </h3>
                    <p className="text-body-sm text-muted mt-1">
                        Poin pengalaman kerja Anda yang diubah agar berorientasi pada dampak nyata &amp; angka (Action Verbs + Metrics).
                    </p>
                </div>

                <div className="space-y-4">
                    {data.rewriteSuggestions?.map((item, idx) => (
                        <div key={idx} className="bg-canvas border border-hairline rounded-md p-5 shadow-subtle space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-error/5 p-3.5 rounded-md border border-error/15">
                                    <span className="text-[11px] font-bold text-error uppercase block mb-1">Versi Asli (Kurang Kuat):</span>
                                    <p className="text-body-sm text-body line-through decoration-error/50">{item.original}</p>
                                </div>
                                <div className="bg-success/5 p-3.5 rounded-md border border-success/20">
                                    <div className="flex justify-between items-center mb-1.5 gap-2">
                                        <span className="text-[11px] font-bold text-success uppercase">Versi STAR (Disarankan):</span>
                                        <button
                                            onClick={() => handleCopy(item.improved || '', idx)}
                                            className="text-[10px] text-ink font-semibold bg-canvas px-2 py-1 rounded border border-hairline shadow-subtle hover:bg-surface-soft transition-colors"
                                        >
                                            {copiedIndex === idx ? 'Tersalin' : 'Salin'}
                                        </button>
                                    </div>
                                    <p className="text-body-sm text-ink font-medium">{item.improved}</p>
                                </div>
                            </div>
                            <div className="bg-surface-soft p-3 rounded text-caption text-muted flex items-start gap-2">
                                <span className="font-semibold text-ink shrink-0">Mengapa lebih baik?</span>
                                <span>{item.reasoning}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* GRID ATS ISSUES & HIGHLIGHTED TEXT */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* ATS Issues Card */}
                <div className="bg-canvas border border-hairline rounded-lg p-6 space-y-4">
                    <h3 className="font-display text-title-md text-ink">
                        Kompatibilitas ATS
                    </h3>
                    <div className="space-y-3">
                        {data.atsIssues?.map((ats, idx) => (
                            <div key={idx} className="p-3.5 rounded-md border border-hairline bg-surface-soft space-y-1.5">
                                <div className="flex items-center justify-between gap-3">
                                    <span className="text-body-sm font-semibold text-ink">{ats.issue}</span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${ats.severity === 'high' ? 'bg-error text-white' :
                                        ats.severity === 'medium' ? 'bg-warning text-ink' : 'bg-surface-strong text-muted'
                                        }`}>
                                        {ats.severity}
                                    </span>
                                </div>
                                <p className="text-caption text-muted"><strong className="text-ink font-medium">Saran:</strong> {ats.recommendation}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Highlighted Original Text Card (interaktif) */}
                <div className="bg-canvas border border-hairline rounded-lg p-6 space-y-4">
                    <h3 className="font-display text-title-md text-ink">
                        Deteksi Frasa Klise
                    </h3>
                    <p className="text-caption text-muted mt-1">
                        Arahkan kursor (hover) pada <span className="bg-warning/20 text-warning px-1 rounded-sm font-semibold">teks yang disorot</span> di bawah untuk melihat saran.
                    </p>
                    <div className="grow">
                        <HighlightedResume text={originalText} genericPhrases={data.genericPhrases} />
                    </div>
                </div>
            </div>

            {/* ACTION FOOTER */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-8 print:hidden">
                <Button onClick={onReset} disabled={isStreaming} className="px-8">
                    {isStreaming ? 'Menunggu Streaming Selesai...' : 'Analisis Resume Lainnya'}
                </Button>

                {/* Tombol EXPORT PDF */}
                {!isStreaming && (
                    <Button variant="secondary" onClick={handlePrint} className="px-8">
                        Export PDF
                    </Button>
                )}
            </div>
        </div>
    );
}
