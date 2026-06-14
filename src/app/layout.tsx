import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LimbahProvider } from "@/context/LimbahContext";
import { AuthProvider } from "@/context/AuthContext";
import { TransaksiProvider } from "@/context/TransaksiContext";
import { EndpointProvider } from "@/context/EndpointContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AgroCircular",
  description: "Sinergi Agrikultur Sirkular",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <AuthProvider>
          <LimbahProvider>
            <EndpointProvider>
              <TransaksiProvider>
                {children}
              </TransaksiProvider>
            </EndpointProvider>
          </LimbahProvider>
        </AuthProvider>
      </body>
    </html>
  );
}