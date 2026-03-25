import { defineField, defineType } from "sanity";

export const surftripAdditionalInfoSection = defineType({
  name: "surftripAdditionalInfoSection",
  title: "Surftrip Additional Info Section",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      of: [{ type: "string" }],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: "title",
      items: "items",
    },
    prepare({ title, items }) {
      const count = Array.isArray(items) ? items.length : 0;
      return {
        title: title || "Additional info",
        subtitle: `${count} item${count === 1 ? "" : "s"}`,
      };
    },
  },
});
