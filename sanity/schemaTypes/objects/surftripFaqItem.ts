import { defineField, defineType } from "sanity";

export const surftripFaqItem = defineType({
  name: "surftripFaqItem",
  title: "Surftrip FAQ Item",
  type: "object",
  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "answer",
      title: "Answer",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "question",
      subtitle: "answer",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "FAQ item",
        subtitle: subtitle ? `${subtitle}`.slice(0, 80) : "Answer",
      };
    },
  },
});
