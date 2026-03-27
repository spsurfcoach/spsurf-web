import { defineField, defineType } from "sanity";

export const surftripDaySection = defineType({
  name: "surftripDaySection",
  title: "Surftrip Day Section",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "scheduleItems",
      title: "Schedule Items",
      type: "array",
      of: [{ type: "surftripScheduleItem" }],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "bodyLinkLabel",
      title: "Body Link Label",
      type: "string",
    }),
    defineField({
      name: "bodyLinkHref",
      title: "Body Link URL",
      type: "string",
      description: "Use a route, anchor, or full URL.",
    }),
    defineField({
      name: "downloadLabel",
      title: "Download Label",
      type: "string",
    }),
    defineField({
      name: "downloadFile",
      title: "Download File",
      type: "file",
      options: {
        accept: ".pdf,.doc,.docx",
      },
    }),
    defineField({
      name: "image",
      title: "Supporting Image",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      items: "scheduleItems",
      media: "image",
    },
    prepare({ title, items, media }) {
      const count = Array.isArray(items) ? items.length : 0;
      return {
        title: title || "Day section",
        subtitle: `${count} schedule item${count === 1 ? "" : "s"}`,
        media,
      };
    },
  },
});
