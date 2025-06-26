import "@/styles/globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";

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
