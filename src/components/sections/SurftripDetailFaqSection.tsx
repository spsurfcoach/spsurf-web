import { FaqsSection } from "@/components/sections/FaqsSection";
import type { SurftripFaqItem } from "@/lib/sanity";

type SurftripDetailFaqSectionProps = {
  items: SurftripFaqItem[];
};

export function SurftripDetailFaqSection({ items }: SurftripDetailFaqSectionProps) {
  if (!items.length) {
    return null;
  }

  return <FaqsSection items={items} />;
}
