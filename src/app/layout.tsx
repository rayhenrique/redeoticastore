import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { PwaRegister } from "@/components/shared/pwa-register";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Rede Ótica Store",
  description: "Catálogo digital com checkout via WhatsApp e mini-CRM.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Rede Ótica Store",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: [
      {
        url: "/icons/apple-touch-icon.png",
        sizes: "180x180",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${poppins.variable} antialiased`}
      >
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
