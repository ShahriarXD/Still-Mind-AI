import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SteelMind AI – Smart Assistant for Small Wholesalers",
  description:
    "Turn messy customer notes into clear actions, follow-ups, and insights. AI-powered CRM for small wholesalers.",
  keywords: ["wholesale", "CRM", "AI assistant", "steel", "B2B", "follow-ups"],
  openGraph: {
    title: "SteelMind AI",
    description: "AI-powered assistant for small wholesalers",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <body className={`${inter.className} min-h-full bg-[#0f172a] text-slate-200 antialiased`}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
