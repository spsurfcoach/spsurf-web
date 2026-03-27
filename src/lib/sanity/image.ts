import { createImageUrlBuilder } from "@sanity/image-url";
import type { Image } from "sanity";
import { sanityClient } from "./client";

const imageBuilder = createImageUrlBuilder(sanityClient);

export function urlForImage(source: Image) {
  return imageBuilder.image(source);
}
