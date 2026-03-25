import { defineField, defineType } from "sanity";

export const surftripPackageAddon = defineType({
  name: "surftripPackageAddon",
  title: "Surftrip Package Add-on",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "priceLabel",
      title: "Price Label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "label",
      subtitle: "priceLabel",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Add-on",
        subtitle: subtitle || "Price",
      };
    },
  },
});
