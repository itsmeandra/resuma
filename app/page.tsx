'use client';

import React, { useState } from 'react';
import ResumeUploader from '@/app/components/ResumeUploader';
import AnalysisResultView from './components/AnalysisResultView';
import { ResumeAnalysisResult } from './types';
import { safePartialJsonParse } from './lib/utils/json-parser';

export default function Home() {
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisData, setAnalysisData] = useState<Partial<ResumeAnalysisResult> | null>(null);
  const [language, setLanguage] = useState<'id' | 'en'>('id');
  const [jobDescription, setJobDescription] = useState<string>('');


  // const [analyzingData, setAnalyzingData] = useState<{ filename: string; text: string } | null>(null);

  // const handleParseSuccess = (filename: string, text: string) => {
  //   setAnalyzingData({ filename, text });
  //   alert(`SIAP MENGANALISIS: ${filename}\n\n(Lanjut ke Fase 2 untuk proses AI Prompt & Streaming)`);
  // };

  // Fungsi utama yang memicu Streaming API ke /api/analyze
  const handleStartAnalysis = async (filename: string, text: string) => {
    setIsAnalyzing(true);
    setAnalysisData(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: text,
          language: language,
          jobDescription: jobDescription,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Gagal memulai streaming dari server.');
      }

      // Membaca aliran stream dari API Route menggunakan ReadableStream Reader
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulatedJson = '';

      while (true) {
        const { done, value }
          = await reader.read();
        if (done) break;

        // Decode potongan bytes menjadi string teks
        const chunkText = decoder.decode(value, { stream: true });
        accumulatedJson += chunkText;

        // Coba parse secara best-effort dan update UI secara real-time![cite: 2, 3]
        const partialData = safePartialJsonParse(accumulatedJson);
        if (partialData) {
          setAnalysisData({ ...partialData });
        }
      }
    } catch (error) {
      console.error('Streaming error:', error);
      alert('Terjadi kesalahan saat menganalisis dokumen. Silakan coba lagi.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setAnalysisData(null);
    setIsAnalyzing(false);
  };

  return (
    <main className="min-h-screen bg-canvas text-ink font-body flex flex-col justify-between">
      <div>
        {/* TOP NAVIGATION (Top Nav: 64px, White Canvas) */}
        <header className="h-16 bg-canvas border-b border-hairline px-6 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-3">
            {/* Logo bergaya geometris  */}
            {/* <div className="w-8 h-8 rounded-full bg-primary text-white font-display font-bold flex items-center justify-center text-sm">
              AI
            </div> */}
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

          {/* <div className="flex items-center gap-3">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'id' | 'en')}
              disabled={isAnalyzing}
              className="bg-surface-soft border border-hairline text-ink text-[13px] font-medium px-3 py-1.5 rounded-md focus:outline-none focus:border-muted cursor-pointer"
            >
              <option value="id">Bahasa Indonesia</option>
              <option value="en">English</option>
            </select>
          </div> */}

          {/* Right Action */}
          <div className="flex items-center gap-3">
            <span className="text-[13px] font-medium text-muted hidden sm:inline">
              Powered by <strong className="text-ink">Gemini LLM</strong>
            </span>
          </div>
        </header>

        {/* HERO BAND (Generous Whitespace 96px rhythm) */}
        {!analysisData && !isAnalyzing && (
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

            {/* Input Opsional: Job Description Target[cite: 1, 2] */}
            <div className="max-w-xl mx-auto mt-6 text-left">
              <label className="text-[13px] font-semibold text-muted block mb-1.5">
                Job Description Target (Opsional):
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Tempelkan deskripsi lowongan kerja di sini agar AI bisa menilai relevansi resume Anda..."
                rows={2}
                className="w-full bg-surface-soft border border-hairline rounded-md p-3 text-[13px] text-ink focus:outline-none focus:border-muted transition-colors resize-none"
              />
            </div>
          </section>
        )}

        {/* MAIN CONTENT: RESUME UPLOADER CARD[ */}
        <section className="max-w-4xl mx-auto px-6 pb-24">
          {!analysisData && !isAnalyzing ? (
            <ResumeUploader onParseSuccess={handleStartAnalysis} />
          ) : (
            <AnalysisResultView
              data={analysisData}
              isStreaming={isAnalyzing}
              onReset={handleReset}
            />
          )}
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