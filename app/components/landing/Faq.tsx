'use client';
import { Plus, X } from 'lucide-react';
import React, { useState } from 'react';

/**
 * FAQ accordion. Judul memakai title token, jawaban body-sm (spec DESIGN.md).
 */
export default function Faq() {
    const [openIndex, setOpenIndex] = useState<number>(0);

    const faqs = [
        {
            q: 'Apakah layanan Resuma ini 100% gratis?',
            a: 'Ya, sepenuhnya gratis. Aplikasi ini dibangun sebagai proyek portofolio tanpa adanya biaya tersembunyi, batasan penggunaan, atau kebutuhan untuk memasukkan kartu kredit.',
        },
        {
            q: 'Apakah data resume saya aman dan disimpan di server?',
            a: 'Kami tidak menyimpan data pribadi Anda. Seluruh proses analisis dilakukan secara langsung dan data dihapus setelah sesi Anda berakhir.',
        },
        {
            q: 'Bagaimana cara kerja fitur Job Description Match?',
            a: 'AI kami akan membandingkan kata kunci teknis dan soft skill dari lowongan kerja dengan isi resume Anda, lalu memunculkan persentase kecocokannya.',
        },
        {
            q: "Apa itu 'Saran Penulisan Ulang dengan Metode STAR'?",
            a: 'STAR (Situation, Task, Action, Result) adalah kerangka penulisan resume profesional. AI akan merombak kalimat Anda agar berfokus pada hasil dan angka.',
        },
    ];

    return (
        <section id="faq" className="max-w-3xl mx-auto px-6 pb-section">
            <div className="text-center mb-12">
                <h2 className="font-display text-display-md text-ink">Masih Ada Pertanyaan?</h2>
                <p className="text-body-sm text-muted mt-3">
                    Berikut jawaban untuk pertanyaan yang paling sering ditanyakan seputar Resuma.
                </p>
            </div>

            <div className="space-y-4">
                {faqs.map((faq, idx) => (
                    <div key={faq.q} className="border-b border-hairline pb-4">
                        <button
                            onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                            aria-expanded={openIndex === idx}
                            className="w-full flex justify-between items-center py-2 text-left gap-4"
                        >
                            <span className="text-title-sm text-ink">{faq.q}</span>
                            <span className="text-muted text-xl" aria-hidden>
                                {openIndex === idx ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                            </span>
                        </button>
                        {openIndex === idx && (
                            <p className="text-body-sm text-muted mt-2 leading-relaxed pr-8 animate-fade-in-up">
                                {faq.a}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
