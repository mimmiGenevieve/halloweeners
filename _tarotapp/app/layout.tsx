import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Halloweeners",
  description: "The truth will be revealed",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
