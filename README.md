# Resuma

**Resuma** adalah AI resume & cover letter reviewer yang dirancang khusus untuk konteks rekrutmen Indonesia. Bukan sekadar kasih skor angka, Resuma ngasih feedback yang spesifik, actionable, dan relevan sama gaya kerja lokal bilingual (ID/EN), paham budaya kerja Indonesia, dan nggak maksa format ala Amerika/Eropa yang kadang nggak cocok di sini.

Cocok buat fresh graduate yang bingung nulis pengalaman organisasi, career switcher yang mau reframe skill biar keliatan relevan, atau job seeker yang udah kirim puluhan lamaran tapi jarang dipanggil interview.

---

## Fitur

- **Upload & Parsing:** upload resume dalam format PDF/DOCX, langsung diekstrak jadi teks tanpa copy-paste manual.
- **Scoring Menyeluruh:** skor 0–100 berdasarkan kejelasan, relevansi, penggunaan angka/impact, ATS-compatibility, dan tata bahasa, lengkap dengan breakdown per section (Summary, Experience, Education, Skills).
- **Deteksi Kalimat Klise:** nyorot kalimat generic kayak "hardworking" atau "team player" yang nggak punya bukti konkret.
- **Rewrite Suggestion (STAR Method):** saran penulisan ulang poin pengalaman kerja pakai pendekatan Situation-Task-Action-Result.
- **Job Description Matching:** tempel Job Description target, sistem bakal cek kecocokan keyword dan kasih tau apa yang masih kurang.
- **Streaming Response:** hasil analisis muncul real-time, nggak perlu nunggu proses selesai baru keliatan.
- **Bilingual Output:** pilih bahasa hasil analisis, Indonesia atau Inggris.
- **Export ke PDF:** simpan atau bagikan hasil review dalam bentuk laporan PDF.
- **Riwayat Review:** bandingin progres revisi resume dari waktu ke waktu (disimpan di local storage).

---

## Tech Stack

**Frontend**
- [Next.js](https://nextjs.org/) (React)
- [TanStack Query](https://tanstack.com/query) buat handle streaming state (loading, partial data, error)
- [Tailwind CSS](https://tailwindcss.com/)

**Backend / API Layer**
- Next.js API Routes (Edge/Node.js Functions)
- [unpdf](https://www.npmjs.com/package/unpdf) parsing file PDF
- [mammoth](https://www.npmjs.com/package/mammoth) parsing file DOCX
- [Gemini API](https://aistudio.google.com/app/apikey) streaming response + structured output (JSON)

**Storage**
- MVP: `localStorage` / `IndexedDB` (client-side, tanpa autentikasi)
- Rencana lanjutan: PostgreSQL / Supabase (kalau ada fitur akun & riwayat lintas device)

---

## Arsitektur Singkat

```
Frontend (Next.js) → Backend API Route (parsing + prompt builder) → Gemini API (streaming + JSON)
                ↑                                                          ↓
                └────────────────── stream hasil kembali ke UI ───────────┘
```

Parsing file dan pemanggilan AI dijalankan di server (bukan client) supaya API key aman dan library parsing konsisten.

---

## Cara Install & Menjalankan

### Prasyarat
- Node.js ≥ 18
- API key dari [Gemini](https://aistudio.google.com/app/apikey)

### Langkah-langkah

```bash
# 1. Clone repository
git clone https://github.com/itsmeandra/resuma.git
cd resuma

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env.local
```

Isi `.env.local`:

```env
GEMINI_API_KEY=your_api_key_here
```

```bash
# 4. Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

---

<p align="center">
  Dibuat dengan ☕ dan sedikit overthinking soal ATS keyword.
</p>