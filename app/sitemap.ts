import type { MetadataRoute } from 'next';
import { CITIES, CITY_IDS, LISTINGS, cityHref, listingHref, type Kind } from '@/lib/data';
import { abs } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const kinds: Kind[] = ['cw', 'of'];
  const entries: MetadataRoute.Sitemap = [
    { url: abs('/'), lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: abs('/coworking'), lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: abs('/office'), lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
  ];
  for (const k of kinds) {
    for (const c of CITY_IDS) {
      entries.push({ url: abs(cityHref(k, c)), lastModified: now, changeFrequency: 'daily', priority: 0.8 });
      for (const l of CITIES[c].locs) entries.push({ url: abs(cityHref(k, c, l.slug)), lastModified: now, changeFrequency: 'daily', priority: 0.7 });
    }
  }
  for (const l of LISTINGS) entries.push({ url: abs(listingHref(l)), lastModified: now, changeFrequency: 'weekly', priority: 0.6 });
  return entries;
}
