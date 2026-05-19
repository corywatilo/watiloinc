import type { Metadata } from "next";
import "./globals.css";
import { PHProvider } from "./providers";
import { PostHogPageView } from "./PostHogPageView";

export const metadata: Metadata = {
  title: "Watilo Inc.",
  description: "The personal site of Cory Watilo.",
};

function preloadHref(file: string): string {
  const host = process.env.NEXT_PUBLIC_FONT_HOST ?? "";
  const key = process.env.FONT_ACCESS_KEY;
  const qs = key ? `?k=${encodeURIComponent(key)}` : "";
  return `${host}/${file}.woff2${qs}`;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        {/* /fonts.css is a dynamic route, not a static import-able file. */}
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="/fonts.css" />
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
          href={preloadHref("extraexpanded-regular")}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <PHProvider>
          <PostHogPageView />
          {children}
        </PHProvider>
      </body>
    </html>
  );
}
