import type React from "react"
import { Layout } from "@/components/layout/layout"
import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "MAFI4",
  description: "MAFI4 게임 커뮤니티",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}



import './globals.css'