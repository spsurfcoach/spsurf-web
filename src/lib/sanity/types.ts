export type SanityImageAssetRef = {
  _type: "reference";
  _ref: string;
};

export type SanityFileAssetRef = {
  _type: "reference";
  _ref: string;
};

export type SanityImage = {
  _type: "image";
  asset: SanityImageAssetRef;
  alt?: string;
};

export type SanityFile = {
  _type: "file";
  asset: SanityFileAssetRef;
};

export type SurftripScheduleItem = {
  _key?: string;
  time: string;
  label: string;
};

export type SurftripVideoSection = {
  title?: string;
  videoUrl: string;
  videoPoster: SanityImage | null;
};

export type SurftripDaySection = {
  title: string;
  scheduleItems: SurftripScheduleItem[];
  bodyLinkLabel?: string;
  bodyLinkHref?: string;
  downloadLabel?: string;
  downloadFile?: SanityFile | null;
  image: SanityImage | null;
};

export type SurftripFeatureSection = {
  eyebrow?: string;
  icon?: string;
  title: string;
  body: string;
  theme: "light" | "dark";
  image?: SanityImage | null;
  gallery?: SanityImage[];
  bullets?: string[];
};

export type SurftripPackageColumn = {
  _key?: string;
  title: string;
  items: string[];
};

export type SurftripPackageAddon = {
  _key?: string;
  label: string;
  priceLabel: string;
};

export type SurftripPackageSection = {
  title: string;
  subtitle?: string;
  priceLabel: string;
  priceSuffix?: string;
  depositNote?: string;
  columns: SurftripPackageColumn[];
  addons?: SurftripPackageAddon[];
  ctaLabel: string;
  ctaHref: string;
};

export type SurftripAdditionalInfoSection = {
  title: string;
  items: string[];
};

export type SurftripFaqItem = {
  _key?: string;
  question: string;
  answer: string;
};

export type SurftripCommerceState = {
  price: number;
  capacity: number;
  enrolledCount: number;
  availableSpots: number;
  isActive: boolean;
  storeProductId?: string;
  storeHref?: string;
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
  price: number;
  capacity: number;
  featured: boolean;
  isActive: boolean;
  enrolledCount: number;
  availableSpots: number;
  storeProductId?: string;
  storeHref?: string;
  cardImage: SanityImage | null;
};

export type SurftripDetail = SurftripListItem & {
  heroImage: SanityImage | null;
  heroKicker?: string;
  heroSubtitle: string;
  heroTitleSuffix?: string;
  heroLongDescription?: string;
  heroLocationLabel?: string;
  groupSizeLabel?: string;
  videoSection?: SurftripVideoSection | null;
  dayInTripSection?: SurftripDaySection | null;
  waveTitle: string;
  waveBody: string;
  waveImage: SanityImage | null;
  waveSection?: SurftripFeatureSection | null;
  hotelTitle: string;
  hotelBody: string;
  hotelImage: SanityImage | null;
  hotelSection?: SurftripFeatureSection | null;
  itineraryTitle: string;
  itineraryBody: string;
  experienceSections?: SurftripFeatureSection[];
  packageSection?: SurftripPackageSection | null;
  additionalInfoSection?: SurftripAdditionalInfoSection | null;
  faqItems?: SurftripFaqItem[];
  primaryCtaLabel: string;
  primaryCtaHref: string;
};
