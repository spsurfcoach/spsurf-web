import { groq } from "next-sanity";

export const SURFTRIP_LIST_QUERY = groq`*[_type == "surftrip"] | order(startDate asc) {
  _id,
  title,
  "slug": slug.current,
  country,
  level,
  startDate,
  endDate,
  shortDescription,
  groupSize,
  hospedaje,
  duracion,
  aeropuerto,
  available,
  capacity,
  featured,
  cardImage
}`;

export const SURFTRIP_SLUGS_QUERY = groq`*[_type == "surftrip" && defined(slug.current)][].slug.current`;

export const SURFTRIP_BY_SLUG_QUERY = groq`*[_type == "surftrip" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  country,
  level,
  startDate,
  endDate,
  shortDescription,
  groupSize,
  hospedaje,
  duracion,
  aeropuerto,
  available,
  capacity,
  featured,
  cardImage,
  heroImage,
  heroKicker,
  heroSubtitle,
  waveTitle,
  waveBody,
  waveImage,
  hotelTitle,
  hotelBody,
  hotelImage,
  itineraryTitle,
  itineraryBody,
  primaryCtaLabel,
  primaryCtaHref
}`;
