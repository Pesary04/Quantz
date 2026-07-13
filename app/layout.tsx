import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Quantz Financial Services | Insurance, Pensions & Wealth in Namibia",
  description:
    "Quantz Financial Services is your trusted partner for life insurance, medical aid gap cover, pensions, retirement annuities, savings, investments and estate planning in Namibia.",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "Quantz Financial Services",
    description:
      "Your partner in financial confidence — insurance, pensions, investments and estate planning in Namibia.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${poppins.variable} bg-background`}>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
