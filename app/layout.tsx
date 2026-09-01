import type { Metadata, Viewport } from "next";
import { Comfortaa, Rubik } from "next/font/google";
import "./globals.css";

const comfortaa = Comfortaa({
  variable: "--font-comfortaa",
  subsets: ["cyrillic", "latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Мануу — гэрийн даалгаврын найз",
  description:
    "1–5-р ангийн монгол хүүхдэд зориулсан AI найз. Хариу хэлдэггүй, хамт боддог.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#BFE6F8" },
    { media: "(prefers-color-scheme: dark)", color: "#101A24" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="mn"
      className={`${comfortaa.variable} ${rubik.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
