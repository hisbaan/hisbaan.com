import { GoogleAnalytics } from "@next/third-parties/google";
import Footer from "./footer";
import TopNav from "./top-nav";
import { Inter } from "next/font/google";
import { Metadata } from "next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "hisbaan • home",
  description: "Personal website of Hisbaan Noorani",
};

export default function WideLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`m-auto flex min-h-dvh w-full max-w-6xl flex-col justify-between gap-5 bg-neutral-900 px-3 text-neutral-300 ${inter.className}`}
        suppressHydrationWarning={true}
      >
        <div className="flex flex-grow flex-col">
          <TopNav />
          {children}
        </div>
        <Footer />
      </body>
      <GoogleAnalytics gaId="G-XLT0PE92JK" />
    </html>
  );
}
