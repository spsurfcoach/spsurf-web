import { defineField, defineType } from "sanity";

export const ctaBlock = defineType({
  name: "ctaBlock",
  title: "CTA Block",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "buttonLabel",
      title: "Button Label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "buttonHref",
      title: "Button Link",
      type: "string",
      validation: (rule) => rule.required(),
      description: "Use internal routes like /contacto or anchors like #reserva.",
    }),
  ],
  preview: {
    select: {
      title: "heading",
      subtitle: "buttonLabel",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "CTA Block",
        subtitle: subtitle || "Call to action",
      };
    },
  },
});
