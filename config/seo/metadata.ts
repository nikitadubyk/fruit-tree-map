import { Metadata } from 'next';

export const defaultMetadata: Metadata = {
  title: {
    default: 'Карта фруктовых деревьев | Найди фрукты рядом с тобой',
    template: '%s | Карта фруктовых деревьев',
  },
  description:
    'Интерактивная карта фруктовых деревьев. Находите яблони, груши, сливы и другие плодовые деревья рядом с вами. Добавляйте новые находки и делитесь урожаем с сообществом.',
  keywords: [
    'фрукты рядом',
    'карта яблонь',
    'urban foraging',
    'яблони на карте',
    'плодовые деревья',
    'бесплатные фрукты',
    'где собрать фрукты',
    'городской сбор урожая',
    'карта фруктовых деревьев',
    'фруктовые деревья города',
  ],
  creator: 'Fruit Map',
  publisher: 'Fruit Map',
  authors: [{ name: 'Никита Дубык' }],
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || ''),
  alternates: {
    canonical: '/',
    languages: {
      'ru-RU': '/',
    },
  },
  openGraph: {
    url: '/',
    type: 'website',
    locale: 'ru_RU',
    siteName: 'Карта фруктовых деревьев',
    title: 'Карта фруктовых деревьев | Найди фрукты рядом с тобой',
    description:
      'Интерактивная карта фруктовых деревьев. Находите яблони, груши, сливы и другие плодовые деревья рядом с вами.',
    images: [
      {
        width: 1200,
        height: 630,
        type: 'image/jpeg',
        url: '/og-image.jpg',
        alt: 'Карта фруктовых деревьев - найди фрукты рядом',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-snippet': -1,
      'max-video-preview': -1,
      'max-image-preview': 'large',
    },
  },
  icons: {
    icon: [
      { url: '/favicon/favicon.ico' },
      { url: '/favicon/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      {
        url: '/favicon/favicon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
    ],
    shortcut: [{ url: '/favicon/favicon.ico' }],
    apple: [
      { url: '/favicon/favicon-57x57.png', sizes: '57x57', type: 'image/png' },
      { url: '/favicon/favicon-60x60.png', sizes: '60x60', type: 'image/png' },
      { url: '/favicon/favicon-72x72.png', sizes: '72x72', type: 'image/png' },
      { url: '/favicon/favicon-76x76.png', sizes: '76x76', type: 'image/png' },
      {
        url: '/favicon/favicon-114x114.png',
        sizes: '114x114',
        type: 'image/png',
      },
      {
        url: '/favicon/favicon-120x120.png',
        sizes: '120x120',
        type: 'image/png',
      },
      {
        url: '/favicon/favicon-144x144.png',
        sizes: '144x144',
        type: 'image/png',
      },
      {
        url: '/favicon/favicon-152x152.png',
        sizes: '152x152',
        type: 'image/png',
      },
      {
        url: '/favicon/favicon-180x180.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
  applicationName: 'Карта фруктовых деревьев',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Fruit Map',
  },
  category: 'technology',
};
