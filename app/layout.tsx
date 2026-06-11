import type { Metadata } from "next";
import { getAbsoluteUrl, siteConfig } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "LifeSpan | Know Your Time",
    template: "%s | LifeSpan",
  },
  description: siteConfig.description,
  alternates: {
    canonical: getAbsoluteUrl("/"),
  },
  openGraph: {
    title: "LifeSpan | Know Your Time",
    description: siteConfig.description,
    url: getAbsoluteUrl("/"),
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LifeSpan | Know Your Time",
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
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
