import { defineField, defineType } from "sanity";

export const surftripScheduleItem = defineType({
  name: "surftripScheduleItem",
  title: "Surfcamp Schedule Item",
  type: "object",
  fields: [
    defineField({
      name: "time",
      title: "Time",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "time",
      subtitle: "label",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Schedule item",
        subtitle: subtitle || "Activity",
      };
    },
  },
});
