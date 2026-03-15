import { defineField, defineType } from "sanity";

export const galleryBlock = defineType({
  name: "galleryBlock",
  title: "Gallery Block",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      validation: (rule) => rule.required().min(2).max(8),
      of: [
        defineField({
          name: "item",
          title: "Gallery Image",
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "heading",
      images: "images",
    },
    prepare({ title, images }) {
      const count = Array.isArray(images) ? images.length : 0;
      return {
        title: title || "Gallery Block",
        subtitle: `${count} image${count === 1 ? "" : "s"}`,
      };
    },
  },
});
