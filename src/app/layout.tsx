import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react"
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { auth } from "../../auth"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bulk Email Sender",
  description: "Bulk Email Sender helps you send your emails to multiple recipients just in seconds",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth()
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider session={session}>
          <Navbar />
          <Sidebar />
          <main className="ml-[200px]">{children}</main>
          </SessionProvider>
      </body>
    </html>
  );
}
