import { defineField, defineType } from "sanity";

export const heroBlock = defineType({
  name: "heroBlock",
  title: "Hero Block",
  type: "object",
  fields: [
    defineField({
      name: "kicker",
      title: "Kicker",
      type: "string",
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (rule) => rule.required().max(140),
    }),
    defineField({
      name: "subheading",
      title: "Subheading",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "mediaType",
      title: "Media Type",
      type: "string",
      initialValue: "image",
      options: {
        list: [
          { title: "Image", value: "image" },
          { title: "Video URL", value: "video" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.mediaType === "video",
    }),
    defineField({
      name: "videoUrl",
      title: "Video URL",
      type: "url",
      hidden: ({ parent }) => parent?.mediaType !== "video",
    }),
    defineField({
      name: "ctaLabel",
      title: "CTA Label",
      type: "string",
    }),
    defineField({
      name: "ctaHref",
      title: "CTA Link",
      type: "string",
      description: "Use internal routes like /contacto or anchors like #reserva.",
    }),
  ],
  preview: {
    select: {
      title: "heading",
      subtitle: "kicker",
      media: "image",
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || "Hero Block",
        subtitle: subtitle || "Hero section",
        media,
      };
    },
  },
});
