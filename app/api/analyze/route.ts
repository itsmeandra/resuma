import { NextRequest } from "next/server";
import { ai, GEMINI_MODEL } from "@/app/lib/gemini";
import { buildResumeReviewPrompt, resumeAnalysisSchema } from "@/app/lib/prompts/resume-reviewer";

// Gunakan runtime nodejs untuk stabilitas stream
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { resumeText, language = 'id', jobDescription } = body;

        // Validasi Input
        if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length < 50) {
            return new Response(
                JSON.stringify({ error: 'Teks resume tidak valid atau terlalu pendek.' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Rakit Prompt menggunakan Helper dari FASE 2
        const prompt = buildResumeReviewPrompt(resumeText, language, jobDescription);
        console.log(`>>> [API Analyze] Memulai streaming Gemini (${GEMINI_MODEL}) | Lang: ${language}`);

        // Panggil Gemini API dengan fitur Streaming & Structured Output
        const responseStream = await ai.models.generateContentStream({
            model: GEMINI_MODEL,
            contents: prompt,
            config: {
                // Kunci skema output agar AI wajib membalas dengan format JSON yang ketat
                responseMimeType: 'application/json',
                responseSchema: resumeAnalysisSchema,
                temperature: 0.2, // Rendah agar analisisnya objektif dan konsisten
            }
        });

        // Buat ReadableStream untuk mengalirkan potongan teks (chunks) ke frontend
        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();
                try {
                    for await (const chunk of responseStream) {
                        const text = chunk.text;
                        if (text) {
                            // Kirim potongan JSON ke client setiap kali token baru keluar dari Gemini
                            controller.enqueue(encoder.encode(text));
                        }
                    }
                    console.log('>>> [API Analyze] Streaming selesai dengan sukses!');
                    controller.close();
                } catch (error: any) {
                    console.error('>>> [API Analyze Stream Error]:', error);
                    controller.error(error);
                }

            }
        });

        // Kembalikan Response Stream dengan header text/plain (karena berisi potongan teks JSON)
        return new Response(stream, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Cache-Control': 'no-cache, no-transform',
                'X-Content-Type-Options': 'nosniff',
            },
        });
    } catch (error: any) {
        console.error('>>> [API Analyze Fatal Error]:', error);
        return new Response(
            JSON.stringify({ error: `Gagal memproses analisis AI: ${error.message || 'Unknown Error'}` }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}