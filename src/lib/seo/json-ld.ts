import { siteConfig } from "./site";

type WithContext<T extends object> = T & { "@context": "https://schema.org" };

export type OrganizationSchema = {
  "@type": "Organization" | "SportsActivityLocation";
  name: string;
  url: string;
  logo: string;
  telephone: string;
  email: string;
  address: {
    "@type": "PostalAddress";
    addressLocality: string;
    addressCountry: string;
  };
  areaServed: string[];
  sameAs: string[];
};

export type FAQPageSchema = {
  "@type": "FAQPage";
  mainEntity: {
    "@type": "Question";
    name: string;
    acceptedAnswer: { "@type": "Answer"; text: string };
  }[];
};

export type EventSchema = {
  "@type": "Event";
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: {
    "@type": "Place";
    name: string;
    address: { "@type": "PostalAddress"; addressCountry: string };
  };
  organizer: { "@type": "Organization"; name: string; url: string };
  offers?: {
    "@type": "Offer";
    price: string;
    priceCurrency: string;
    availability: string;
    url: string;
  };
  image?: string;
};

export type BreadcrumbListSchema = {
  "@type": "BreadcrumbList";
  itemListElement: {
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }[];
};

export type WebSiteSchema = {
  "@type": "WebSite";
  name: string;
  url: string;
  inLanguage: string;
  description: string;
};

export type JsonLdSchema =
  | OrganizationSchema
  | FAQPageSchema
  | EventSchema
  | BreadcrumbListSchema
  | WebSiteSchema;

export function buildOrganizationSchema(): WithContext<OrganizationSchema> {
  return {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/photos/logosp%20-%20copia.png`,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.contact.addressLocality,
      addressCountry: siteConfig.contact.addressCountry,
    },
    areaServed: ["Lima", "Perú"],
    sameAs: [
      siteConfig.social.instagram,
      siteConfig.social.substack,
      siteConfig.social.whatsapp,
    ],
  };
}

export function buildWebSiteSchema(): WithContext<WebSiteSchema> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: "es-PE",
    description: siteConfig.defaultDescription,
  };
}

export function buildFaqSchema(
  items: { question: string; answer: string }[],
): WithContext<FAQPageSchema> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function buildEventSchema(params: {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  country: string;
  price: number;
  slug: string;
  heroImageUrl?: string;
}): WithContext<EventSchema> {
  const { title, description, startDate, endDate, country, price, slug, heroImageUrl } = params;
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: title,
    description,
    startDate,
    endDate,
    location: {
      "@type": "Place",
      name: country,
      address: { "@type": "PostalAddress", addressCountry: country === "Perú" || country === "Peru" ? "PE" : country },
    },
    organizer: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
    offers: {
      "@type": "Offer",
      price: String(price),
      priceCurrency: "PEN",
      availability: "https://schema.org/InStock",
      url: `${siteConfig.url}/surfcamps/${slug}`,
    },
    ...(heroImageUrl ? { image: heroImageUrl } : {}),
  };
}

export function buildBreadcrumbSchema(
  items: { name: string; href: string }[],
): WithContext<BreadcrumbListSchema> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.href}`,
    })),
  };
}
