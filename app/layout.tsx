import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Indie_Flower } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const indieFlower = Indie_Flower({
  variable: "--font-indie-flower",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Dreamerz",
  description: "Dream Big",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${indieFlower.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden overflow-y-auto">
        {children}
      </body>
    </html>
  );
}
