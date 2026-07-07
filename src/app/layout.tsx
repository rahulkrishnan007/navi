import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "AI Career Navigator — Your AI-Powered Career Growth Platform",
  description:
    "Plot your career trajectory: build an ATS-ready resume, close your skill gaps, and track every application in one place.",
};

// Inline, blocking script that reads the persisted theme before React
// hydrates. Without this, the page briefly flashes the wrong theme (light
// mode for a user who chose dark) before ThemeProvider's effect runs.
const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('cn-theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = stored || (prefersDark ? 'dark' : 'light');
    if (theme === 'dark') document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
