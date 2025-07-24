import React from "react";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { ClientOnly } from "@/components/ClientOnly";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ClientOnly>{children}</ClientOnly>
        </ThemeProvider>
      </body>
    </html>
  );
}
