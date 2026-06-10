import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, Inter } from 'next/font/google'
import { AuthProvider } from '@/components/auth/auth-provider'
import { CurrencyBootstrap } from '@/components/shared/currency-bootstrap'
import { PwaProvider } from '@/components/shared/pwa-provider'
import './globals.css'

const spaceGrotesk = Space_Grotesk({ 
  variable: '--font-space-grotesk', 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700']
})

const inter = Inter({ 
  variable: '--font-inter', 
  subsets: ['latin'] 
})

export const metadata: Metadata = {
  title: 'MetaX - Advanced Ads Intelligence',
  description: 'Facebook Ads analytics dashboard powered by advanced AI',
  generator: 'v0.app',
  manifest: '/manifest.json',
  applicationName: 'MetaX',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'MetaX',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/icons/icon-180.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#050818',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} bg-background`}>
      <body className="font-sans antialiased">
        <PwaProvider />
        <AuthProvider>
          <CurrencyBootstrap>{children}</CurrencyBootstrap>
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
