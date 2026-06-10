import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Space_Grotesk, Inter } from 'next/font/google'
import { AuthProvider } from '@/components/auth/auth-provider'
import { CurrencyBootstrap } from '@/components/shared/currency-bootstrap'
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
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} bg-background`}>
      <body className="font-sans antialiased">
        <AuthProvider>
          <CurrencyBootstrap>{children}</CurrencyBootstrap>
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
