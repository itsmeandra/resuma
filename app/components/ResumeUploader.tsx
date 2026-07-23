'use client';

import React, { useState, useRef } from 'react';
import { UploadState } from '@/app/types';

interface ResumeUploaderProps {
    onParseSuccess: (filename: string, text: string) => void;
}

export default function ResumeUploader({ onParseSuccess }: ResumeUploaderProps) {
    const [uploadState, setUploadState] = useState<UploadState>('idle');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [previewData, setPreviewData] = useState<{ filename: string; text: string } | null>(null);

    // State baru khusus untuk interaksi visual saat drag & drop
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (file: File) => {
        setErrorMessage('');
        setUploadState('parsing');

        // Validasi cepat di client-side sebelum dikirim ke API
        if (!file.name.endsWith('.pdf') && !file.name.endsWith('.docx')) {
            setErrorMessage('Format file tidak didukung. Harap unggah file .PDF atau .DOCX');
            setUploadState('error');
            return;
        }
        const MAX_FILE_SIZE = 5 * 1024 * 1024;
        if (file.size > MAX_FILE_SIZE) {
            setErrorMessage('Ukuran file melebihi batas maksimal 5MB.');
            setUploadState('error');
            return;
        }

        const formData = new FormData();
        formData.append('resume', file);

        try {
            const res = await fetch('/api/parse-resume', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Gagal mengekstrak teks dokumen.');
            }

            setPreviewData({ filename: data.filename, text: data.text });
            setUploadState('done');
        } catch (err: any) {
            setErrorMessage(err.message || 'Terjadi kesalahan sistem saat membaca file.');
            setUploadState('error');
        }
    };

    // Event handler Drag & Drop yang diperkuat agar browser tidak menolak file
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isDragging) setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleConfirmAnalyze = () => {
        if (previewData) {
            onParseSuccess(previewData.filename, previewData.text);
        }
    };

    const handleReset = () => {
        setPreviewData(null);
        setUploadState('idle');
        setErrorMessage('');
        setIsDragging(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="w-full max-w-2xl mx-auto font-body text-ink">
            {/* --- HERO APP MOCKUP CARD (Cal.com style) --- */}
            <div className="bg-canvas border border-hairline rounded-xl p-6 md:p-8 shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all">

                {/* Card Header */}
                <div className="flex items-center justify-between pb-6 mb-6 border-b border-hairline-soft">
                    <div>
                        <h3 className="font-display font-semibold text-[18px] text-ink leading-tight">
                            Upload Resume & Cover Letter
                        </h3>
                        <p className="text-[14px] text-muted mt-0.5">
                            Sistem akan mengekstrak dan mengevaluasi format dokumen Anda.
                        </p>
                    </div>
                    <span className="bg-surface-card text-ink text-[13px] font-medium px-3 py-1 rounded-full border border-hairline">
                        PDF / DOCX
                    </span>
                </div>

                {/* --- CONTENT AREA --- */}
                <div>
                    {/* STATE: IDLE & ERROR (Dropzone Area) */}
                    {(uploadState === 'idle' || uploadState === 'error' || uploadState === 'parsing') && (
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => uploadState !== 'parsing' && fileInputRef.current?.click()}
                            className={`border rounded-lg p-10 text-center transition-all cursor-pointer ${uploadState === 'parsing'
                                ? 'bg-surface-soft border-muted cursor-wait'
                                : isDragging
                                    ? 'bg-surface-soft border-primary border-2 border-dashed scale-[1.01]' // Efek visual saat file di-drag ke atas kotak
                                    : 'bg-surface-soft/50 border-hairline border-dashed hover:bg-surface-soft hover:border-muted'
                                }`}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                                accept=".pdf,.docx"
                                className="hidden"
                            />

                            {uploadState === 'parsing' ? (
                                <div className="space-y-3 py-4">
                                    <div className="inline-block w-6 h-6 border-2 border-muted border-t-primary rounded-full animate-spin"></div>
                                    <p className="text-[14px] font-medium text-ink animate-pulse">
                                        Mengekstrak teks dokumen...
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3 pointer-events-none"> {/* pointer-events-none agar tidak memblokir click ke div parent */}
                                    <div className={`w-12 h-12 mx-auto border flex items-center justify-center rounded-full shadow-sm transition-colors ${isDragging ? 'bg-primary text-on-primary border-primary' : 'bg-canvas text-ink border-hairline'
                                        }`}>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[14px] font-semibold text-ink">
                                            {isDragging ? 'Lepaskan file di sini...' : 'Klik untuk unggah atau drag and drop'}
                                        </p>
                                        <p className="text-[13px] text-muted">
                                            Mendukung format .PDF atau .DOCX (Maksimal 5MB)
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* STATE: ERROR MESSAGE */}
                    {errorMessage && (
                        <div className="mt-4 bg-error/10 border border-error/20 text-error p-3.5 rounded-md text-[14px] font-medium flex items-center justify-between">
                            <span>{errorMessage}</span>
                            <button
                                onClick={(e) => { e.stopPropagation(); handleReset(); }}
                                className="text-ink text-[13px] underline hover:text-muted ml-4"
                            >
                                Coba lagi
                            </button>
                        </div>
                    )}

                    {/* STATE: DONE / PREVIEW */}
                    {uploadState === 'done' && previewData && (
                        <div className="space-y-6">
                            <div className="bg-surface-soft border border-hairline rounded-lg p-4">
                                <div className="flex justify-between items-center pb-3 mb-3 border-b border-hairline">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-success"></span>
                                        <span className="text-[14px] font-medium text-ink">
                                            {previewData.filename}
                                        </span>
                                    </div>
                                    <span className="bg-canvas text-muted text-[12px] font-medium px-2.5 py-0.5 rounded-full border border-hairline">
                                        Siap dianalisis
                                    </span>
                                </div>

                                <p className="text-[12px] font-medium text-muted uppercase tracking-wider mb-2">
                                    Preview Teks Hasil Ekstraksi:
                                </p>
                                <div className="bg-canvas p-3 border border-hairline rounded-md h-44 overflow-y-auto text-[13px] text-body font-mono leading-relaxed whitespace-pre-wrap select-all">
                                    {previewData.text}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-end gap-3">
                                <button
                                    onClick={handleReset}
                                    className="bg-canvas text-ink border border-hairline hover:bg-surface-soft px-5 py-2.5 text-[14px] font-semibold rounded-md transition-colors"
                                >
                                    Ganti File
                                </button>
                                <button
                                    onClick={handleConfirmAnalyze}
                                    className="bg-primary hover:bg-primary-active text-white px-6 py-2.5 text-[14px] font-semibold rounded-md transition-colors shadow-sm flex items-center gap-2"
                                >
                                    <span>Mulai Analisis AI</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
