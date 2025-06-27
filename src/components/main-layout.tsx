import "@/styles/globals.css";
import { Inter } from "next/font/google";
import Footer from "@/components/footer";
import TopNav from "@/components/top-nav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <body
      className={`m-auto flex min-h-dvh w-full max-w-2xl flex-col justify-between gap-5 bg-neutral-900 px-3 text-neutral-300 ${inter.className}`}
      suppressHydrationWarning={true}
    >
      <div className="flex grow flex-col">
        <TopNav />
        <main className="flex grow flex-col items-center gap-10">
          {children}
        </main>
      </div>
      <Footer />
    </body>
  );
}
