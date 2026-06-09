import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LifeSpan",
  description: "A premium life timeline experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
