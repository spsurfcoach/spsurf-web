import { defineField, defineType } from "sanity";

export const richTextBlock = defineType({
  name: "richTextBlock",
  title: "Rich Text Block",
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
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
      rows: 7,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "heading",
      subtitle: "body",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Rich Text Block",
        subtitle: subtitle ? `${subtitle}`.slice(0, 80) : "Body copy",
      };
    },
  },
});
