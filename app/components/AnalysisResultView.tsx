'use client';

import React from 'react';
import { ResumeAnalysisResult } from '@/app/types';

interface AnalysisResultViewProps {
    data: Partial<ResumeAnalysisResult> | null;
    isStreaming: boolean;
    onReset: () => void;
}

export default function AnalysisResultView({ data, isStreaming, onReset }: AnalysisResultViewProps) {
    if (!data && isStreaming) {
        // Tampilan Loading Awal (Sebelum chunk pertama berhasil di-parse)
        return (
            <div className="w-full max-w-4xl mx-auto bg-canvas border border-hairline rounded-xl p-12 text-center space-y-6 shadow-sm">
                <div className="inline-block w-10 h-10 border-3 border-muted border-t-primary rounded-full animate-spin"></div>
                <div className="space-y-2">
                    <h3 className="font-display font-semibold text-xl text-ink">
                        AI Sedang Membedah Resume Anda...
                    </h3>
                    <p className="text-[14px] text-muted max-w-md mx-auto">
                        Mengevaluasi kompetensi, mengecek kompatibilitas ATS, dan menyusun saran STAR.
                    </p>
                </div>
            </div>
        );
    }

    if (!data) return null;

    // Fungsi penentu warna skor (Hijau > 75, Kuning > 60, Merah < 60)
    const getScoreColor = (score?: number) => {
        if (score === undefined) return 'text-muted bg-surface-soft border-hairline';
        if (score >= 75) return 'text-success bg-success/10 border-success/30';
        if (score >= 60) return 'text-warning bg-warning/10 border-warning/30';
        return 'text-error bg-error/10 border-error/30';
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8 font-body text-ink animate-fadeIn">

            {/* HEADER & EXECUTIVE SUMMARY CARD (Cal.com SaaS Style) */}
            <div className="bg-canvas border border-hairline rounded-xl p-6 md:p-8 shadow-[0_4px_12px_rgba(0,0,0,0.05)] relative overflow-hidden">
                {isStreaming && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-surface-strong overflow-hidden">
                        <div className="w-1/3 h-full bg-primary animate-[pulse_1s_ease-in-out_infinite]"></div>
                    </div>
                )}

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-hairline-soft">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="bg-surface-card text-ink text-[12px] font-semibold px-3 py-1 rounded-full border border-hairline">
                                {data.detectedRole || 'Mendeteksi Profesi...'}
                            </span>
                            <span className="bg-canvas text-muted text-[12px] font-medium px-2.5 py-0.5 rounded-full border border-hairline uppercase">
                                LANG: {data.detectedLanguage || 'ID'}
                            </span>
                        </div>
                        <h2 className="font-display font-semibold text-2xl md:text-3xl text-ink mt-2">
                            Hasil Diagnostik Resume
                        </h2>
                    </div>

                    {/* OVERALL SCORE BADGE */}
                    <div className="flex items-center gap-4 bg-surface-soft p-4 rounded-xl border border-hairline">
                        <div className="text-right">
                            <p className="text-[12px] font-semibold text-muted uppercase">Skor Keseluruhan</p>
                            <p className="text-[11px] text-muted-soft">Standar Industri</p>
                        </div>
                        <div className={`w-16 h-16 rounded-xl flex items-center justify-center font-display font-bold text-2xl border ${getScoreColor(data.overallScore)}`}>
                            {data.overallScore !== undefined ? data.overallScore : '?'}
                        </div>
                    </div>
                </div>

                {/* Executive Summary */}
                <div className="mt-6">
                    <h4 className="text-[13px] font-semibold text-muted uppercase tracking-wider mb-2">
                        Ringkasan Eksekutif
                    </h4>
                    <p className="text-[15px] text-body leading-relaxed bg-surface-soft/60 p-4 rounded-lg border border-hairline-soft">
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
                        ].map((sec, idx) => (
                            <div key={idx} className="bg-canvas p-3 rounded-lg border border-hairline text-center">
                                <span className="text-[12px] text-muted font-medium block mb-1">{sec.label}</span>
                                <span className={`font-display font-bold text-lg inline-block px-2 py-0.5 rounded ${getScoreColor(sec.score)}`}>
                                    {sec.score !== undefined ? `${sec.score}/100` : '-'}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* REWRITE SUGGESTIONS (STAR METHOD) CARD */}
            <div className="bg-surface-card border border-hairline rounded-xl p-6 md:p-8 space-y-6">
                <div>
                    <h3 className="font-display font-semibold text-xl text-ink">
                        Saran Penulisan Ulang (Metode STAR)
                    </h3>
                    <p className="text-[14px] text-muted mt-1">
                        Poin pengalaman kerja Anda yang diubah agar berorientasi pada dampak nyata & angka (Action Verbs + Metrics).
                    </p>
                </div>

                <div className="space-y-4">
                    {!data.rewriteSuggestions || data.rewriteSuggestions.length === 0 ? (
                        <div className="p-8 text-center bg-canvas rounded-lg border border-hairline text-muted animate-pulse text-[14px]">
                            Sedang menganalisis kalimat pengalaman kerja Anda...
                        </div>
                    ) : (
                        data.rewriteSuggestions.map((item, idx) => (
                            <div key={idx} className="bg-canvas border border-hairline rounded-lg p-5 shadow-sm space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-error/5 p-3.5 rounded-md border border-error/15">
                                        <span className="text-[11px] font-bold text-error uppercase block mb-1">Versi Asli (Kurang Kuat):</span>
                                        <p className="text-[13px] text-body line-through decoration-error/50">{item.original}</p>
                                    </div>
                                    <div className="bg-success/5 p-3.5 rounded-md border border-success/20">
                                        <span className="text-[11px] font-bold text-success uppercase block mb-1">Versi STAR (Disarankan):</span>
                                        <p className="text-[13px] text-ink font-medium">{item.improved}</p>
                                    </div>
                                </div>
                                <div className="bg-surface-soft p-3 rounded text-[12px] text-muted flex items-start gap-2">
                                    <span className="font-bold text-ink shrink-0">Mengapa lebih baik?</span>
                                    <span>{item.reasoning}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* ATS ISSUES & GENERIC PHRASES GRID (2 Columns)*/}
            <div className="grid md:grid-cols-2 gap-6">

                {/* ATS Issues Card[cite: 1, 2] */}
                <div className="bg-canvas border border-hairline rounded-xl p-6 space-y-4">
                    <h3 className="font-display font-semibold text-lg text-ink">
                        Kompatibilitas ATS
                    </h3>
                    <div className="space-y-3">
                        {!data.atsIssues || data.atsIssues.length === 0 ? (
                            <p className="text-[13px] text-muted italic">Mengecek kelayakan format ATS...</p>
                        ) : (
                            data.atsIssues.map((ats, idx) => (
                                <div key={idx} className="p-3.5 rounded-lg border border-hairline bg-surface-soft space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[13px] font-semibold text-ink">{ats.issue}</span>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${ats.severity === 'high' ? 'bg-error text-white' :
                                            ats.severity === 'medium' ? 'bg-warning text-ink' : 'bg-surface-strong text-muted'
                                            }`}>
                                            {ats.severity}
                                        </span>
                                    </div>
                                    <p className="text-[12px] text-muted"><strong className="text-ink font-medium">Saran:</strong> {ats.recommendation}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Generic Phrases Card[cite: 1, 2] */}
                <div className="bg-canvas border border-hairline rounded-xl p-6 space-y-4">
                    <h3 className="font-display font-semibold text-lg text-ink">
                        Deteksi Frasa Klise
                    </h3>
                    <div className="space-y-3">
                        {!data.genericPhrases || data.genericPhrases.length === 0 ? (
                            <p className="text-[13px] text-muted italic">Mencari kata generic pemalas...</p>
                        ) : (
                            data.genericPhrases.map((phrase, idx) => (
                                <div key={idx} className="p-3.5 rounded-lg border border-hairline bg-surface-soft space-y-1">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[13px] font-semibold text-error">&quot;{phrase.text}&quot;</span>
                                        <span className="text-[11px] text-muted-soft">{phrase.location}</span>
                                    </div>
                                    <p className="text-[12px] text-body"><strong className="text-ink font-medium">Ganti dengan:</strong> {phrase.suggestion}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>

            {/* ACTION FOOTER */}
            <div className="flex justify-center pt-6">
                <button
                    onClick={onReset}
                    disabled={isStreaming}
                    className={`px-8 py-3 rounded-md font-semibold text-[14px] transition-all ${isStreaming
                        ? 'bg-primary-disabled text-muted cursor-not-allowed'
                        : 'bg-primary hover:bg-primary-active text-white shadow-md'
                        }`}
                >
                    {isStreaming ? 'Menunggu Streaming Selesai...' : 'Analisis Resume Lainnya'}
                </button>
            </div>

        </div>
    );
}