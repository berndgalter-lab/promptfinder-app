import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthButton } from "@/components/auth/AuthButton";
import { Toaster } from "@/components/ui/toaster";
import { AchievementDebugger } from "@/components/debug/AchievementDebugger";
import { NavLinks } from "@/components/nav/NavLinks";
import { Footer } from "@/components/footer/Footer";
import { getUserWithAdminStatus } from "@/lib/auth";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PromptFinder",
  description: "Build AI Workflows in Minutes",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, isAdmin } = await getUserWithAdminStatus();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-950`}
      >
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4">
            <Link href="/">
              <h1 className="text-xl font-bold text-white hover:text-zinc-300 transition-colors cursor-pointer">
                PromptFinder
              </h1>
            </Link>
            <div className="flex items-center gap-4 md:gap-6">
              <NavLinks isLoggedIn={!!user} isAdmin={isAdmin} />
              {/* AuthButton nur auf Desktop im Header, auf Mobile im Sheet */}
              <div className="hidden md:block">
                <AuthButton />
              </div>
            </div>
          </div>
        </header>
        <main className="pt-16">
          {children}
        </main>
        <Footer />
        <Toaster />
        <AchievementDebugger />
        <Analytics />
      </body>
    </html>
  );
}
