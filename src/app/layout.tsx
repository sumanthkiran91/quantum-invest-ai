import type { Metadata } from "next";
import "./globals.css";
import { FeedbackWidget } from "@/components/feedback-widget";

export const metadata: Metadata = {
  title: "Quantum Invest AI",
  description: "Interactive prototype for a global AI investment intelligence platform."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}<FeedbackWidget /></body>
    </html>
  );
}

