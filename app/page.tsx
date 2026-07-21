'use client';

import React, { useState } from 'react';
import ResumeUploader from '@/app/components/ResumeUploader';

export default function Home() {
  const [analyzingData, setAnalyzingData] = useState<{ filename: string; text: string } | null>(null);

  const handleParseSuccess = (filename: string, text: string) => {
    setAnalyzingData({ filename, text });
    alert(`SIAP MENGANALISIS: ${filename}\n\n(Lanjut ke Fase 2 untuk proses AI Prompt & Streaming)`);
  };

  return (
    <main className="min-h-screen bg-canvas text-ink font-body flex flex-col justify-between">
      <div>
        {/* TOP NAVIGATION (Top Nav: 64px, White Canvas) */}
        <header className="h-16 bg-canvas border-b border-hairline px-6 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-3">
            {/* Logo bergaya geometris  */}
            <div className="w-8 h-8 rounded-full bg-primary text-on-primary font-display font-bold flex items-center justify-center text-sm">
              AI
            </div>
            <span className="font-display font-semibold text-[18px] tracking-tight text-ink">
              Resum<span className="text-muted-soft">ai</span>
            </span>
          </div>

          {/* Nav Pill Group (Signature Cal.com Interactive Switcher) */}
          <div className="hidden md:flex bg-surface-soft p-1 rounded-full border border-hairline text-[14px] font-medium">
            <span className="bg-canvas text-ink px-4 py-1.5 rounded-full shadow-sm cursor-pointer">
              1. Upload Resume
            </span>
            <span className="text-muted px-4 py-1.5 cursor-not-allowed">
              2. AI Diagnostic
            </span>
            <span className="text-muted px-4 py-1.5 cursor-not-allowed">
              3. ATS Scoring
            </span>
          </div>

          {/* Right Action */}
          <div className="flex items-center gap-3">
            <span className="text-[13px] font-medium text-muted hidden sm:inline">
              Powered by <strong className="text-ink">Gemini 2.5 Flash</strong>
            </span>
          </div>
        </header>

        {/* HERO BAND (Generous Whitespace 96px rhythm) */}
        <section className="max-w-4xl mx-auto px-6 pt-16 md:pt-24 pb-12 text-center">
          {/* Badge Pill Pastel Accent */}
          <div className="inline-flex items-center gap-2 bg-surface-card border border-hairline px-3 py-1 rounded-full text-[13px] font-medium text-ink mb-6">
            <span className="w-2 h-2 rounded-full bg-badge-emerald"></span>
            <span>Standar rekrutmen ATS & Metode STAR</span>
          </div>

          {/* Display Headline (Cal Sans 600, negative tracking) */}
          <h1 className="font-display font-semibold text-4xl sm:text-5xl md:text-[56px] text-ink leading-[1.08] tracking-tight max-w-3xl mx-auto">
            Cara yang lebih baik untuk mengevaluasi resume Anda.
          </h1>

          <p className="text-body text-[16px] md:text-[18px] max-w-2xl mx-auto mt-6 leading-relaxed">
            Dapatkan diagnostik mendalam, skor kompatibilitas ATS, serta saran penulisan ulang berbasis kalimat konkret dalam hitungan detik.
          </p>
        </section>

        {/* MAIN CONTENT: RESUME UPLOADER CARD[ */}
        <section className="max-w-4xl mx-auto px-6 pb-24">
          <ResumeUploader onParseSuccess={handleParseSuccess} />
        </section>
      </div>

      {/* FOOTER (Dark Navy closing surface) */}
      <footer className="bg-surface-dark text-on-dark-soft py-8 px-6 border-t border-surface-dark-elevated mt-12">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[13px] text-muted-soft">
            © {new Date().getFullYear()} Resuma. AI Resume Reviewer, created by Andra while enjoying a cup of coffee.
          </p>
        </div>
      </footer>
    </main>
  );
}