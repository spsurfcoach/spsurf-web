import type { MetadataRoute } from "next";
import { getSurftripSlugs } from "@/lib/sanity";
import { siteConfig } from "@/lib/seo/site";

const staticRoutes: MetadataRoute.Sitemap = [
  { url: siteConfig.url, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
  { url: `${siteConfig.url}/surfcamps`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
  { url: `${siteConfig.url}/servicios`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  { url: `${siteConfig.url}/clases`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  { url: `${siteConfig.url}/nosotros`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  { url: `${siteConfig.url}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let surftripEntries: MetadataRoute.Sitemap = [];

  try {
    const slugs = await getSurftripSlugs();
    surftripEntries = slugs.map((slug) => ({
      url: `${siteConfig.url}/surfcamps/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.85,
    }));
  } catch {
    // Sanity unavailable at build time — surfcamp entries omitted
  }

  return [...staticRoutes, ...surftripEntries];
}
