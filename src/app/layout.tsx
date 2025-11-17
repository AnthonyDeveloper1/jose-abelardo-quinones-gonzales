import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Colegio - Sistema de Gestión',
  description: 'Sistema de gestión web para instituciones educativas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <meta name="google-site-verification" content="googlec49694f2a6707675.html" />
      </head>
      <body className={inter.variable}>{children}</body>
    </html>
  )
}
