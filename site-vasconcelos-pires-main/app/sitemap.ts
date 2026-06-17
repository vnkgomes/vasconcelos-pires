import type { MetadataRoute } from 'next';
import { partners } from '@/content/partners';
import { practiceAreas } from '@/content/practice-areas';
import { pareceres } from '@/content/pareceres';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://vasconcellospires.com.br';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['/', '/escritorio', '/areas-de-atuacao', '/equipe', '/pareceres', '/contato'];
  return [
    ...staticRoutes.map((r) => ({ url: `${BASE}${r}`, lastModified: new Date() })),
    ...practiceAreas.map((a) => ({ url: `${BASE}/areas-de-atuacao/${a.slug}`, lastModified: new Date() })),
    ...partners.map((p) => ({ url: `${BASE}/equipe/${p.slug}`, lastModified: new Date() })),
    ...pareceres.filter((p) => p.kind === 'full').map((p) => ({
      url: `${BASE}/pareceres/${p.slug}`,
      lastModified: new Date(p.date),
    })),
  ];
}
