import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    start_url: '/',
    display: 'standalone',
    theme_color: '#10b981',
    short_name: 'Fruit Map',
    background_color: '#ffffff',
    orientation: 'portrait-primary',
    name: 'Карта фруктовых деревьев',
    description: 'Интерактивная карта фруктовых деревьев',
    icons: [
      {
        src: '/favicon/favicon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/favicon/favicon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
