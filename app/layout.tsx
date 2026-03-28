
import type { Metadata, Viewport } from "next";
import { Providers } from "../providers/providers";
import "./globals.css";
import localFont from "next/font/local";

export const metadata: Metadata = {
  title: "캣타운",
  description: "집사들의 커뮤니티",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
}

const pretendard = localFont({
  src: '../public/fonts/PretendardVariable.woff2',
  weight: "45 920",
  style: 'normal',
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`antialiased ${pretendard.className}`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
