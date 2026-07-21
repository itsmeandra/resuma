import { NextRequest, NextResponse } from 'next/server';
import { extractText } from 'unpdf';
import mammoth from 'mammoth';

// Node.js runtime, agar mammoth (DOCX) berjalan optimal
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    console.log('>>> [Server API] Menerima request di /api/parse-resume');
    try {
        const formData = await req.formData();
        const file = formData.get('resume') as File | null;

        // Validasi keberadaan file
        if (!file) {
            console.warn('>>> [Server API Error]: File tidak ditemukan dalam FormData');
            return NextResponse.json(
                { success: false, error: 'CARTRIDGE ERROR: Tidak ada file resume yang dimasukkan.' },
                { status: 400 }
            );
        }

        console.log(`>>> [Server API] Memproses file: "${file.name}" | Ukuran: ${file.size} bytes | Tipe: ${file.type}`);

        // Validasi ukuran file (Maksimal 5MB)
        const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { success: false, error: 'Ukuran file melebihi kapasitas (Maks. 5MB).' },
                { status: 400 }
            );
        }

        // Konversi File ke ArrayBuffer Web Standar
        const arrayBuffer = await file.arrayBuffer();

        let extractedText = '';
        const fileName = file.name.toLowerCase();

        // Proses Parsing berdasarkan Tipe File
        if (fileName.endsWith('.pdf') || file.type === 'application/pdf') {
            console.log('>>> [Server API] Memulai parsing PDF...');

            // Ubah ArrayBuffer menjadi Uint8Array standar Web API yang disukai unpdf
            const uint8Array = new Uint8Array(arrayBuffer);

            // extractText dari unpdf akan membaca seluruh halaman dokumen
            const { text } = await extractText(uint8Array, { mergePages: true });

            // Jaga-jaga: jika unpdf mengembalikan array (teks per halaman), kita gabungkan dengan spasi/baris baru
            extractedText = Array.isArray(text) ? text.join('\n\n') : text;
            console.log('>>> [Server API] PDF berhasil dibaca! Panjang teks:', extractedText.length);
        } else if (
            fileName.endsWith('.docx') ||
            file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ) {
            console.log('>>> [Server API] Memulai parsing DOCX...');
            const buffer = Buffer.from(arrayBuffer);
            const docxData = await mammoth.extractRawText({ buffer });
            extractedText = docxData.value;
            console.log('>>> [Server API] DOCX berhasil dibaca! Panjang teks:', extractedText.length);
        } else {
            return NextResponse.json(
                { success: false, error: 'FORMAT ERROR: Hanya menerima format cartridge .PDF atau .DOCX.' },
                { status: 400 }
            );
        }

        // Validasi hasil teks (Mendeteksi file gambar/scan tanpa OCR)
        const cleanText = extractedText.trim();
        if (!cleanText || cleanText.length < 50) {
            console.warn('>>> [Server API Error]: Teks hasil ekstraksi kosong atau terlalu pendek');
            return NextResponse.json(
                {
                    success: false,
                    error: 'SCAN ERROR: Teks tidak dapat dibaca. Pastikan resume berbasis teks (bukan hasil scan/gambar).',
                },
                { status: 422 }
            );
        }

        // Berhasil mengekstrak teks
        console.log('>>> [Server API] Sukses! Mengirim teks kembali ke client.');
        return NextResponse.json({
            success: true,
            filename: file.name,
            text: cleanText,
        });

    } catch (error: any) {
        console.error('>>> [Server API Exception FATAL]:', error);
        return NextResponse.json(
            { success: false, error: `SYSTEM FAULT: Gagal membaca file (${error.message || 'Unknown Error'}).` },
            { status: 500 }
        );
    }
}