
import type { Metadata, Viewport } from "next";
import { Providers } from "../providers/providers";
import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
