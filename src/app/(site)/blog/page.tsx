import { BlogHero } from "@/components/sections/BlogHero";
import { BlogSubstackSection } from "@/components/sections/BlogSubstackSection";
import { getSubstackPosts } from "@/lib/substack-feed";

export default async function BlogPage() {
  const posts = await getSubstackPosts(10);

  return (
    <>
      <BlogHero />
      <BlogSubstackSection posts={posts} />
    </>
  );
}
