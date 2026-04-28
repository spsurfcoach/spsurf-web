import type { ProductCategory, ProductDoc } from "./types";

export const PRODUCT_COLLECTION = "products";

export const DEFAULT_PRODUCT_IMAGES = {
  package: "/photos/servicios_paquete_starter.jpg",
  membership: "/photos/servicios_paquete_premium.jpg",
  videoanalysis: "/photos/DSC_5325 copia.jpg",
  surfskate: "/photos/DSC08741.JPG",
  surftrip: "/photos/surftrips/surftrips_hero.jpg",
} satisfies Record<ProductCategory, string>;

type SeedProduct = Omit<ProductDoc, "createdAt" | "updatedAt" | "sourceCollection" | "sourceId">;

export const DEFAULT_STANDALONE_PRODUCTS: Record<string, SeedProduct> = {
  videoanalysis: {
    slug: "videoanalisis",
    name: "Videoanalisis",
    shortDescription: "Compra una sesion individual de videoanalisis.",
    description: "Revision tecnica personalizada para acelerar tu progreso dentro y fuera del agua.",
    category: "videoanalysis",
    fulfillmentType: "direct_purchase",
    price: 100,
    currency: "PEN",
    isActive: true,
    image: DEFAULT_PRODUCT_IMAGES.videoanalysis,
    badge: "Analisis tecnico",
    features: ["Revision individual", "Feedback tecnico", "Entrega coordinada"],
    sortOrder: 30,
  },
  surfskate: {
    slug: "surfskate",
    name: "Clases de Surfskate",
    shortDescription: "Compra tus clases de surfskate sin pasar por reservas.",
    description: "Trabajo de tecnica, postura y fluidez para complementar tus sesiones en el agua.",
    category: "surfskate",
    fulfillmentType: "direct_purchase",
    price: 100,
    currency: "PEN",
    isActive: true,
    image: DEFAULT_PRODUCT_IMAGES.surfskate,
    badge: "Entrenamiento complementario",
    features: ["Compra directa", "Sin calendario de reservas", "Coordinacion posterior"],
    sortOrder: 40,
  },
};

export function buildPackageProductId(packageId: string) {
  return `package:${packageId}`;
}

export function buildSurftripProductId(surftripId: string) {
  return `surftrip:${surftripId}`;
}

export function parseSourceProductId(productId: string) {
  if (productId.startsWith("package:")) {
    return { kind: "package" as const, sourceId: productId.slice("package:".length) };
  }

  if (productId.startsWith("surftrip:")) {
    return { kind: "surftrip" as const, sourceId: productId.slice("surftrip:".length) };
  }

  return null;
}

export function productCategoryLabel(category: ProductCategory) {
  switch (category) {
    case "package":
      return "Paquete";
    case "membership":
      return "Membership";
    case "videoanalysis":
      return "Videoanalisis";
    case "surfskate":
      return "Surfskate";
    case "surftrip":
      return "Surfcamps";
    default:
      return "Producto";
  }
}

export function productCategoryOrder(category: ProductCategory) {
  switch (category) {
    case "membership":
      return 0;
    case "package":
      return 1;
    case "videoanalysis":
      return 2;
    case "surfskate":
      return 3;
    case "surftrip":
      return 4;
    default:
      return 99;
  }
}
