import { Inter } from "next/font/google"
import TopNav from "@/components/top-nav"
import "@/styles/globals.css"
import { Metadata } from "next"
import Footer from "@/components/footer"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "hisbaan • home",
  description: "Personal website of Hisbaan Noorani",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`m-auto flex h-dvh w-full max-w-2xl flex-col justify-between gap-5 bg-neutral-900 text-neutral-300 [&>*]:mx-10 ${inter.className}`}
        suppressHydrationWarning={true}
      >
        <div>
          <TopNav />
          {children}
        </div>
        <Footer/>
      </body>
    </html>
  )
}
