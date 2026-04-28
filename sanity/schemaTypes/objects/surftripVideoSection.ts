import { defineField, defineType } from "sanity";

export const surftripVideoSection = defineType({
  name: "surftripVideoSection",
  title: "Surfcamp Video Section",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "videoUrl",
      title: "Video URL",
      type: "string",
      validation: (rule) => rule.required(),
      description: "Supports local paths, hosted mp4 links, or embeddable video URLs.",
    }),
    defineField({
      name: "videoPoster",
      title: "Video Poster",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "videoUrl",
      media: "videoPoster",
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || "Video section",
        subtitle: subtitle || "Video URL",
        media,
      };
    },
  },
});
