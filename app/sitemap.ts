import { MetadataRoute } from 'next';

import { ROUTES } from '@/config';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || '';

  return [
    {
      priority: 1,
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
    },
    {
      priority: 0.5,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      url: `${baseUrl}${ROUTES.AUTH.LOGIN}`,
    },
    {
      priority: 0.5,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      url: `${baseUrl}${ROUTES.PROFILE.HOME}`,
    },
  ];
}
