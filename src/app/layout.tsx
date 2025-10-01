import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react";
import { Providers } from "./StoreProvider";
import ClientWrapper from "@/components/general/ClientWrapper";
import { AuthProvider } from "@/context/AuthProvider";
import { ThemeProvider } from "@/context/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Keysaria",
  description: `Where Tradition Meets Timeless Style`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <AuthProvider>
            <Providers>
              <ClientWrapper>
                {/* <CustomerPersist> */}
                {/* <CustomerRequireAuth> */}
                <main>{children}</main>
                {/* </CustomerRequireAuth> */}
                {/* </CustomerPersist> */}
              </ClientWrapper>
            </Providers>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
