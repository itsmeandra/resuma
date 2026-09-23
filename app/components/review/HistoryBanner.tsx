'use client';

import React from 'react';
import { HistoryItem } from '@/app/lib/hooks/useReviewHistory';
import Badge from '@/app/components/ui/Badge';
import Button from '@/app/components/ui/Button';

interface HistoryBannerProps {
    item: HistoryItem;
    onNewAnalysis: () => void;
}

/**
 * Banner status saat Step Hasil menampilkan data dari riwayat (mode view-only),
 * agar hasil lama tidak tertukar dengan analisis baru yang sedang berjalan.
 */
export default function HistoryBanner({ item, onNewAnalysis }: HistoryBannerProps) {
    const formattedDate = new Date(item.date).toLocaleString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <div className="bg-surface-soft border border-hairline rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-subtle animate-fade-in-up">
            <div className="flex items-center gap-3 min-w-0">
                <Badge tone="warning" className="shrink-0">
                    Riwayat
                </Badge>
                <p className="text-body-sm text-muted min-w-0">
                    Menampilkan hasil dari riwayat —{' '}
                    <span className="text-ink font-semibold">{item.filename}</span>
                    <span className="hidden sm:inline"> · {formattedDate}</span>
                </p>
            </div>
            <Button variant="secondary" onClick={onNewAnalysis} className="shrink-0">
                Mulai Analisis Baru
            </Button>
        </div>
    );
}
