// src/app/layout.tsx
import type { Metadata } from "next";
import "leaflet/dist/leaflet.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "EXIF Viewer",
  description: "A base EXIF viewer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 在這裡加入 data-contrast="low" 來啟用 kawaii 模式
    <html lang="en" data-contrast="low">
      <body>{children}</body>
    </html>
  );
}
