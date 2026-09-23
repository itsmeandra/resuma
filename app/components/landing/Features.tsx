import React from 'react';
import Card from '@/app/components/ui/Card';
import { BotMessageSquare, MessageSquare, Sparkle, Sparkles } from 'lucide-react';

/**
 * Spec: DESIGN.md > feature-card (bg surface-card, radius lg, padding 32px)
 * Grid 3-up desktop → 1-up mobile (DESIGN.md > Responsive).
 */
export default function Features() {
    const features = [
        {
            icon: <MessageSquare />,
            title: 'Feedback Spesifik',
            desc: 'Bukan sekadar skor angka yang samar. Kami memberikan saran konkret baris-per-baris untuk memperbaiki kalimat yang kurang lemah.',
        },
        {
            icon: <BotMessageSquare />,
            title: 'ATS-Friendly',
            desc: 'Cek kecocokan keyword secara otomatis dengan deskripsi pekerjaan yang Anda tuju agar lolos sistem filter otomatis.',
        },
        {
            icon: <Sparkles />,
            title: 'Analisis STAR',
            desc: 'Ubah poin pengalaman pasif menjadi poin hasil yang impactful menggunakan framework Situation, Task, Action, dan Result.',
        },
    ];

    return (
        <section id="fitur" className="max-w-6xl mx-auto px-6 pb-section">
            <div className="text-center mb-16 max-w-2xl mx-auto">
                <h2 className="font-display text-display-md text-ink">
                    Resume yang Lebih Kuat Dibantu AI dalam Hitungan Detik
                </h2>
                <p className="text-body-md text-muted mt-4">
                    Resuma menganalisis resume Anda, memberi feedback yang mudah dipahami dan rekomendasi
                    yang langsung bisa diterapkan membantu siapa pun tampil lebih siap di setiap tahap
                    seleksi kerja.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {features.map((feat) => (
                    <Card key={feat.title} variant="feature" className="hover:shadow-subtle transition-shadow">
                        <div className="w-10 h-10 bg-canvas border border-hairline rounded-md flex items-center justify-center mb-6 text-xl">
                            {feat.icon}
                        </div>
                        <h3 className="text-title-md text-ink mb-3">{feat.title}</h3>
                        <p className="text-body-sm text-muted leading-relaxed">{feat.desc}</p>
                    </Card>
                ))}
            </div>
        </section>
    );
}
