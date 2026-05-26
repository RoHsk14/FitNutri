import type { Metadata, Viewport } from "next"
import "./globals.css"
import { Poppins } from "next/font/google"
import { ThemeProvider } from "@/components/layout/ThemeProvider"

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "FitNutri - Programme fitness & nutrition personnalisé",
  description:
    "Recevez un programme d'entraînement et un plan nutritionnel adaptés à vos objectifs.",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${poppins.className} min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
