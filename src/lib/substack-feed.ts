import Parser from "rss-parser";

export type SubstackPostItem = {
  title: string;
  link: string;
  pubDate?: string;
  excerpt: string;
};

const DEFAULT_RSS = "https://spsurfcoach.substack.com/feed";

const parser = new Parser();

function stripToExcerpt(raw: string, max = 200) {
  const text = raw
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}…`;
}

export const SUBSTACK_PUBLIC_URL =
  process.env.NEXT_PUBLIC_SUBSTACK_URL ?? "https://substack.com/@spsurfcoach";

export async function getSubstackPosts(limit = 12): Promise<SubstackPostItem[]> {
  const feedUrl = process.env.SUBSTACK_RSS_URL ?? DEFAULT_RSS;
  try {
    const res = await fetch(feedUrl, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const xml = await res.text();
    const feed = await parser.parseString(xml);
    const items = (feed.items ?? []).slice(0, limit);
    return items.map((item) => {
      const snippet = item.contentSnippet as string | undefined;
      const content = item.content as string | undefined;
      const base = (snippet && snippet.length > 0 ? snippet : content) ?? "";
      return {
        title: String(item.title ?? "Artículo"),
        link: String(item.link ?? SUBSTACK_PUBLIC_URL),
        pubDate: item.pubDate ?? item.isoDate,
        excerpt: stripToExcerpt(base),
      };
    });
  } catch {
    return [];
  }
}

export function formatPostDate(pubDate: string | undefined) {
  if (!pubDate) return "";
  const d = new Date(pubDate);
  if (Number.isNaN(d.getTime())) return pubDate;
  return new Intl.DateTimeFormat("es", { dateStyle: "medium" }).format(d);
}
