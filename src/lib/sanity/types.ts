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

export type SurftripDetail = SurftripListItem & {
  heroImage: SanityImage | null;
  heroKicker?: string;
  heroSubtitle: string;
  waveTitle: string;
  waveBody: string;
  waveImage: SanityImage | null;
  hotelTitle: string;
  hotelBody: string;
  hotelImage: SanityImage | null;
  itineraryTitle: string;
  itineraryBody: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
};
