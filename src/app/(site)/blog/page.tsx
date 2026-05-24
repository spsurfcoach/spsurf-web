import type { Metadata } from "next";
import { BlogHero } from "@/components/sections/BlogHero";
import { BlogSubstackSection } from "@/components/sections/BlogSubstackSection";
import { getSubstackPosts } from "@/lib/substack-feed";

export const metadata: Metadata = {
  title: "Blog de Surf — Consejos, Técnica y Cultura",
  description:
    "El blog de SP Surf Coach: artículos sobre técnica de surf, lectura de olas, cultura del mar y lifestyle para surfistas en Lima y Perú.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog de Surf — SP Surf Coach",
    description:
      "Artículos sobre técnica de surf, cultura del mar y lifestyle para surfistas en Lima y Perú.",
    url: "/blog",
  },
};

export default async function BlogPage() {
  const posts = await getSubstackPosts(10);

  return (
    <>
      <BlogHero />
      <BlogSubstackSection posts={posts} />
    </>
  );
}
