import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shop Builder - Create Beautiful Online Shops",
  description: "Build stunning online shops with customizable layouts, easy product management, and professional PDF catalogs. Perfect for showcasing your products.",
  keywords: ["Online Shop", "E-commerce", "Product Catalog", "Shop Builder", "PDF Export", "Next.js"],
  authors: [{ name: "Shop Builder" }],
  creator: "Shop Builder",
  metadataBase: new URL("https://shop-builder.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://shop-builder.vercel.app",
    title: "Shop Builder - Create Beautiful Online Shops",
    description: "Build stunning online shops with customizable layouts, easy product management, and professional PDF catalogs.",
    siteName: "Shop Builder",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop Builder - Create Beautiful Online Shops",
    description: "Build stunning online shops with customizable layouts, easy product management, and professional PDF catalogs.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 pt-16">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
