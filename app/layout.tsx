import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, JetBrains_Mono, Syne } from "next/font/google";
import NavBar from "@/components/NavBar";
import SiteFooter from "@/components/SiteFooter";
import PageTransitions from "@/components/PageTransitions";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Observer",
  description:
    "A computational scientific instrument exploring compressibility, prediction horizons, and emergent symbolic laws.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${syne.variable} ${cormorant.variable} ${inter.variable} ${jetBrainsMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-[100dvh] flex-col font-[family-name:var(--font-inter),ui-sans-serif,system-ui]">
        <NavBar />
        <main className="flex-1">
          <PageTransitions>{children}</PageTransitions>
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
