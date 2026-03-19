import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: 'nodas.lt — Web remontas ir IT paslaugos Lietuvoje',
  description: 'Web remontas, AI svetainės, WordPress, serverių diegimas. Profesionalus IT specialistas Lietuvoje. Nuo €39.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="lt">
      <body style={{ margin: 0, fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" }}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
