import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "./components/providers/QueryProvider";

// DESIGN.md: Inter sebagai body/UI, JetBrains Mono untuk code.
// Cal Sans tidak tersedia publik — substitusi resmi: Inter (lihat DESIGN.md).
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Resuma - AI Resume Reviewer",
  description:
    "Resuma membantu Anda lolos filter ATS dan mendapatkan panggilan wawancara dengan evaluasi resume berbasis AI: skor menyeluruh, deteksi frasa klise, rewrite metode STAR, dan keyword gap analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
