import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import "./globals.css";
import "./contrast-improvements.css";
import ClientIntlProvider from "../components/ClientIntlProvider";
import { AuthProvider } from "./providers/auth-provider";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${roboto.variable} antialiased`}>
        <AuthProvider session={null}>
          <ClientIntlProvider>
            {children}
          </ClientIntlProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
