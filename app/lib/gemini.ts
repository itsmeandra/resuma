import { GoogleGenAI } from '@google/genai';

// Pastikan API Key tersedia
if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY belum didefinisikan di environment variables (.env.local)');
}

// Inisialisasi client Google Gen AI
export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Kita tentukan model standar yang akan kita pakai sesuai request Anda
export const GEMINI_MODEL = 'gemini-2.5-flash';