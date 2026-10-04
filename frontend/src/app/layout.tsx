import type { Metadata, Viewport } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Biokompetensiya — interaktiv biologiya platformasi",
    template: "%s · Biokompetensiya",
  },
  description:
    "5–6-sinf biologiyasi uchun interaktiv platforma: mavzular, virtual laboratoriyalar, 3D modellar, testlar, krossvordlar va o‘quv o‘yinlari.",
  applicationName: "Biokompetensiya",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f7f3" },
    { media: "(prefers-color-scheme: dark)", color: "#08110e" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uz"
      suppressHydrationWarning
      className={`${inter.variable} ${fraunces.variable} h-full`}
    >
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
