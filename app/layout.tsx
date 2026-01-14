import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hangul Amount Calculator",
  description: "Korean amount calculator MVP",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen font-sans">
        {children}
      </body>
    </html>
  );
}
