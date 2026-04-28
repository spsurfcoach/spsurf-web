import { defineField, defineType } from "sanity";

export const surftripPackageColumn = defineType({
  name: "surftripPackageColumn",
  title: "Surfcamp Package Column",
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
        title: title || "Package column",
        subtitle: `${count} item${count === 1 ? "" : "s"}`,
      };
    },
  },
});
