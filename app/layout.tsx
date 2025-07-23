import './globals.css'
import { Inter } from 'next/font/google'
import { ToastProvider, ToastViewport } from '@/components/ui/toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'MrrKit - AI Destekli Uygulama Oluşturucu',
  description: 'Prompt ile uygulama oluşturan AI destekli web platformu',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={inter.className}>
        <ToastProvider>
          {children}
          <ToastViewport />
        </ToastProvider>
      </body>
    </html>
  )
}
