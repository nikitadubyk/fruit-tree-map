import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || '';

  return {
    sitemap: `${baseUrl}/sitemap.xml`,
    rules: [
      {
        allow: '/',
        userAgent: '*',
        disallow: ['/admin/', '/api/'],
      },
    ],
  };
}
