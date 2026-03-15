export type SanityImageAssetRef = {
  _type: "reference";
  _ref: string;
};

export type SanityImage = {
  _type: "image";
  asset: SanityImageAssetRef;
  alt?: string;
};

export type SurftripListItem = {
  _id: string;
  title: string;
  slug: string;
  country: string;
  level: string;
  startDate: string;
  endDate: string;
  shortDescription: string;
  groupSize: string;
  hospedaje: string;
  duracion: string;
  aeropuerto: string;
  available: number;
  capacity: number;
  featured: boolean;
  cardImage: SanityImage | null;
};

export type HeroBlock = {
  _key: string;
  _type: "heroBlock";
  kicker?: string;
  heading: string;
  subheading?: string;
  mediaType: "image" | "video";
  image?: SanityImage;
  videoUrl?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export type RichTextBlock = {
  _key: string;
  _type: "richTextBlock";
  kicker?: string;
  heading?: string;
  body: string;
};

export type ImageBlock = {
  _key: string;
  _type: "imageBlock";
  heading?: string;
  image: SanityImage;
  alt: string;
  caption?: string;
};

export type GalleryImage = SanityImage & { alt?: string };

export type GalleryBlock = {
  _key: string;
  _type: "galleryBlock";
  heading?: string;
  images: GalleryImage[];
};

export type CtaBlock = {
  _key: string;
  _type: "ctaBlock";
  heading: string;
  body?: string;
  buttonLabel: string;
  buttonHref: string;
};

export type SurftripBlock = HeroBlock | RichTextBlock | ImageBlock | GalleryBlock | CtaBlock;

export type SurftripDetail = SurftripListItem & {
  contentBlocks: SurftripBlock[];
};
