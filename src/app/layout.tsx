import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Agent Builder",
  description:
    "Build AI agents for your team — no coding required. Answer 6 questions, get a production-quality Claude Code prompt.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-950 text-gray-100 min-h-screen antialiased">
        <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
            <Link
              href="/"
              className="text-lg font-semibold text-white hover:text-primary-400 transition-colors"
            >
              Agent Builder
            </Link>
            <Link
              href="/builder"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Start Building
            </Link>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
