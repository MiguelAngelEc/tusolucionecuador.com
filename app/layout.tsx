import type React from "react"
import type { Metadata } from "next"
import { Inter, Merriweather } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ClerkProvider } from "@clerk/nextjs"
import { esES } from '@clerk/localizations'
import { ChatProvider, ChatWidget } from "@/components/chat"
import "./globals.css"

const _inter = Inter({ subsets: ["latin"] })
const _merriweather = Merriweather({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Trámites Ecuador | Servicios SRI, Tributarios y Legales",
  description:
    "Servicios profesionales de trámites en Ecuador: SRI, asesoría tributaria, servicios legales y más. Expertos en gestión de documentos oficiales.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider
      localization={esES}
      appearance={{
        variables: {
          colorPrimary: '#652382',
          colorTextOnPrimaryBackground: '#ffffff',
        },
        elements: {
          formButtonPrimary: 'bg-gradient-to-r from-purple-600 via-purple-500 to-orange-500 hover:opacity-90 transition-opacity',
          card: 'shadow-xl border border-gray-100',
          headerTitle: 'text-[#652382] font-bold',
          headerSubtitle: 'text-gray-600',
        }
      }}
    >
      <html lang="es">
        <body className={`font-sans antialiased`}>
          <ChatProvider>
            {children}
            <ChatWidget />
          </ChatProvider>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}

