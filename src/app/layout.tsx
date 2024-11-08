import "@/styles/globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Inter } from "next/font/google";
import Footer from "@/components/footer";
import TopNav from "@/components/top-nav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      {children}
      <GoogleAnalytics gaId="G-XLT0PE92JK" />
    </html>
  );
}
