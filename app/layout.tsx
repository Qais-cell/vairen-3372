import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Manrope, Geist_Mono, IBM_Plex_Sans_Arabic } from 'next/font/google'
import './globals.css'

const geist = Manrope({ subsets: ['latin'], variable: '--font-geist' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })
const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600'],
  variable: '--font-arabic',
})

export const metadata: Metadata = {
  title: 'Vairen — Careers, Courses and AI Guidance',
  description:
    'Explore career paths, discover original courses from global institutions and plan your next step with Vairen, your AI career mentor.',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: '#101b18',
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
    <html
      suppressHydrationWarning
      lang="en"
      dir="ltr"
      className={`${geist.variable} ${geistMono.variable} ${plexArabic.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=document.cookie.match(/(?:^|; )vairen-display=([^;]+)/);var v=p?p[1].split('.'):[];var r=document.documentElement;var t=v[0]==='light'||v[0]==='dark'?v[0]:(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');r.dataset.theme=t;r.classList.toggle('dark',t==='dark');r.lang=v[1]==='ar'?'ar':'en';r.dir=r.lang==='ar'?'rtl':'ltr';r.dataset.motion=(v.length?v[2]==='1':matchMedia('(prefers-reduced-motion: reduce)').matches)?'reduced':'full';}catch(e){}})();`,
          }}
        />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
