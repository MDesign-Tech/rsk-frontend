import type React from "react";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, PT_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { WebsiteInitializer } from "@/providers/WebsiteInitializer";
import { WebsiteProvider } from "@/providers/website-provider";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const _ptMono = PT_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pt-mono",
});

export const metadata: Metadata = {
  title: "RSK Associates",
  description: "Professional services and consulting for your business needs.",
  generator: "v0.app",
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#141414",
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={_ptMono.variable}
      data-scroll-behavior="smooth"
    >
      <body className="font-sans antialiased min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <WebsiteProvider>
            <WebsiteInitializer />
            {children}
            <Toaster />
            <Analytics />
          </WebsiteProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
