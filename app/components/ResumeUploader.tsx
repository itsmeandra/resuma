'use client';

import React, { useState, useRef } from 'react';
import { ParsedFile, UploadState } from '@/app/types';
import Button from '@/app/components/ui/Button';
import Badge from '@/app/components/ui/Badge';

interface ResumeUploaderProps {
    /** File hasil parse yang dipegang oleh parent (Step Setup). */
    parsedFile: ParsedFile | null;
    /** Dipanggil saat ekstraksi teks berhasil. */
    onParsed: (file: ParsedFile) => void;
    /** Dipanggil saat user memilih ganti file. */
    onClear: () => void;
}

/**
 * Zona upload + preview teks hasil ekstraksi (PDF/DOCX, maks 5MB).
 * Tombol lanjut analisis TIDAK di sini — alur dikendalikan wizard (Step Setup → Konfirmasi).
 */
export default function ResumeUploader({ parsedFile, onParsed, onClear }: ResumeUploaderProps) {
    const [uploadState, setUploadState] = useState<UploadState>('idle');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isDone = parsedFile !== null;

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

            onParsed({ filename: data.filename, text: data.text });
            setUploadState('done');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Terjadi kesalahan sistem saat membaca file.';
            setErrorMessage(message);
            setUploadState('error');
        }
    };

    // Event handler Drag & Drop agar browser tidak menolak file
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

    const handleClear = () => {
        onClear();
        setUploadState('idle');
        setErrorMessage('');
        setIsDragging(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="font-body text-ink">
            {/* STATE: IDLE & ERROR & PARSING (Dropzone) */}
            {!isDone && (
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => uploadState !== 'parsing' && fileInputRef.current?.click()}
                    className={`border rounded-lg p-10 text-center transition-all cursor-pointer ${
                        uploadState === 'parsing'
                            ? 'bg-surface-soft border-muted cursor-wait'
                            : isDragging
                                ? 'bg-surface-soft border-primary border-2 border-dashed scale-[1.01]'
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
                            <div className="inline-block w-6 h-6 border-2 border-muted border-t-primary rounded-full animate-spin" />
                            <p className="text-body-sm font-semibold text-ink animate-pulse">
                                Mengekstrak teks dokumen...
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3 pointer-events-none">
                            <div
                                className={`w-12 h-12 mx-auto border flex items-center justify-center rounded-full shadow-subtle transition-colors ${
                                    isDragging ? 'bg-primary text-on-primary border-primary' : 'bg-canvas text-ink border-hairline'
                                }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.5"
                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                    />
                                </svg>
                            </div>
                            <div className="space-y-1">
                                <p className="text-body-sm font-semibold text-ink">
                                    {isDragging ? 'Lepaskan file di sini...' : 'Klik untuk unggah atau drag and drop'}
                                </p>
                                <p className="text-caption text-muted">
                                    Mendukung format .PDF atau .DOCX (Maksimal 5MB)
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* STATE: ERROR */}
            {errorMessage && !isDone && (
                <div className="mt-4 bg-error/10 border border-error/20 text-error p-3.5 rounded-md text-body-sm font-medium flex items-center justify-between">
                    <span>{errorMessage}</span>
                    <Button variant="textLink" onClick={handleClear} className="text-caption underline shrink-0">
                        Coba lagi
                    </Button>
                </div>
            )}

            {/* STATE: DONE / PREVIEW */}
            {isDone && parsedFile && (
                <div className="bg-surface-soft border border-hairline rounded-lg p-4">
                    <div className="flex justify-between items-center pb-3 mb-3 border-b border-hairline">
                        <div className="flex items-center gap-2 min-w-0">
                            <span className="w-2 h-2 rounded-full bg-success shrink-0" />
                            <span className="text-body-sm font-semibold text-ink truncate">{parsedFile.filename}</span>
                        </div>
                        <Badge tone="success">Siap dianalisis</Badge>
                    </div>

                    <div className="flex items-center justify-between mb-2 gap-3">
                        <p className="text-caption text-muted uppercase tracking-wider">
                            Preview Teks Hasil Ekstraksi:
                        </p>
                        <Button variant="secondary" onClick={handleClear} className="h-8 px-3 text-caption shrink-0">
                            Ganti File
                        </Button>
                    </div>
                    <div className="bg-canvas p-3 border border-hairline rounded-md h-44 overflow-y-auto text-body-sm text-body font-mono leading-relaxed whitespace-pre-wrap select-all">
                        {parsedFile.text}
                    </div>
                </div>
            )}
        </div>
    );
}
