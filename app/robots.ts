import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/dashboard/', '/history/', '/favorites/'],
      },
    ],
    sitemap: 'https://prompt-finder.com/sitemap.xml',
  };
}

