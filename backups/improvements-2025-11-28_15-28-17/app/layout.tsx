import type { Metadata, Viewport } from "next";
import { Inter, Roboto } from "next/font/google";
import "./globals.css";
import "./contrast-improvements.css";
import ClientIntlProvider from "../components/ClientIntlProvider";
import { AuthProvider } from "./providers/auth-provider";
import PWAInstallPrompt from "../components/PWAInstallPrompt";
import FontSizeControl from "../components/FontSizeControl";
import FontSizeProvider from "../components/FontSizeProvider";
import HighContrastToggle from "../components/HighContrastToggle";
import HighContrastProvider from "../components/HighContrastProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "ClaraMente - Terapia Online Inteligente",
  description: "Plataforma de terapia online com TCC, DBT e ACT integrados para bem-estar mental",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Claramente",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#3b82f6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className={`${inter.variable} ${roboto.variable} antialiased`}>
        <AuthProvider session={null}>
          <ClientIntlProvider>
            <FontSizeProvider />
            <HighContrastProvider />
            <PWAInstallPrompt />
            <FontSizeControl />
            <HighContrastToggle />
            {children}
          </ClientIntlProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
