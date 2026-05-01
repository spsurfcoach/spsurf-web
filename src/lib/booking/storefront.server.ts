import { adminDb } from "@/lib/firebase/admin";
import type { PackageDoc, ProductDoc, SurftripInventoryDoc } from "./types";
import {
  buildPackageProductId,
  buildSurftripProductId,
  DEFAULT_PRODUCT_IMAGES,
  DEFAULT_STANDALONE_PRODUCTS,
  PRODUCT_COLLECTION,
  productCategoryOrder,
} from "./storefront";
import { getSurftripAvailableSpots } from "./surftrip-sync";

export type StorefrontProduct = ProductDoc & { id: string };

type ProductOverride = ProductDoc & { id: string };

function sourceKey(sourceCollection: string, sourceId: string) {
  return `${sourceCollection}:${sourceId}`;
}

function mergeSourceProduct(base: ProductDoc, override?: Partial<ProductOverride>): ProductDoc {
  const next: ProductDoc = {
    ...base,
    ...override,
    sourceCollection: base.sourceCollection,
    sourceId: base.sourceId,
    createdAt: override?.createdAt ?? base.createdAt,
    updatedAt: override?.updatedAt ?? base.updatedAt,
  };

  if (!next.image) {
    next.image = DEFAULT_PRODUCT_IMAGES[next.category];
  }

  return next;
}

export async function ensureDefaultStandaloneProducts() {
  const collection = adminDb.collection(PRODUCT_COLLECTION);
  const entries = Object.entries(DEFAULT_STANDALONE_PRODUCTS);
  const snapshots = await Promise.all(entries.map(([id]) => collection.doc(id).get()));
  const batch = adminDb.batch();
  const now = new Date().toISOString();
  let hasWrites = false;

  snapshots.forEach((snapshot, index) => {
    if (snapshot.exists) return;

    const [id, data] = entries[index];
    batch.set(collection.doc(id), {
      ...data,
      createdAt: now,
      updatedAt: now,
    });
    hasWrites = true;
  });

  if (hasWrites) {
    await batch.commit();
  }
}

export async function listManagedProducts() {
  await ensureDefaultStandaloneProducts();
  const snapshot = await adminDb.collection(PRODUCT_COLLECTION).get();

  return snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...(doc.data() as ProductDoc),
    }))
    .sort((a, b) => {
      const sortDelta = (a.sortOrder ?? 999) - (b.sortOrder ?? 999);
      if (sortDelta !== 0) return sortDelta;
      return a.name.localeCompare(b.name);
    });
}

export async function listStorefrontProducts(): Promise<StorefrontProduct[]> {
  await ensureDefaultStandaloneProducts();

  const [managedProducts, packageSnapshot, surftripSnapshot] = await Promise.all([
    listManagedProducts(),
    adminDb.collection("packages").get(),
    adminDb.collection("surftripInventory").get(),
  ]);

  const overrides = new Map<string, ProductOverride>();
  const standaloneProducts: StorefrontProduct[] = [];

  for (const product of managedProducts) {
    if (product.sourceCollection && product.sourceId) {
      overrides.set(sourceKey(product.sourceCollection, product.sourceId), product);
      continue;
    }

    if (product.isActive === false) continue;

    standaloneProducts.push({
      ...product,
      sourceCollection: "products",
      sourceId: product.id,
      image: product.image ?? DEFAULT_PRODUCT_IMAGES[product.category],
    });
  }

  const packageProducts = packageSnapshot.docs
    .map((doc) => {
      const sourceId = doc.id;
      const packageData = doc.data() as PackageDoc;
      if (packageData.isActive === false) return null;

      const category = packageData.type === "unlimited" ? "membership" : "package";
      const base: ProductDoc = {
        slug: `package-${sourceId}`,
        name: packageData.name,
        shortDescription:
          packageData.type === "credits"
            ? `${packageData.classCount ?? 0} clases para reservar cuando quieras.`
            : `Acceso ilimitado por ${packageData.durationDays ?? 30} dias.`,
        description:
          packageData.type === "credits"
            ? "Compra tus clases y reserva tus sesiones desde el calendario."
            : "Activa tu membership y reserva tus clases dentro de la vigencia del plan.",
        category,
        fulfillmentType: "class_booking",
        price: packageData.price,
        currency: packageData.currency,
        isActive: packageData.isActive,
        image: DEFAULT_PRODUCT_IMAGES[category],
        badge: category === "membership" ? "Clases ilimitadas" : "Reserva por creditos",
        features:
          packageData.type === "credits"
            ? [`${packageData.classCount ?? 0} clases`, "Reserva flexible", "Acceso al calendario"]
            : [`${packageData.durationDays ?? 30} dias`, "Reservas ilimitadas", "Acceso al calendario"],
        sortOrder: category === "membership" ? 0 : 10,
        sourceCollection: "packages",
        sourceId,
        packageType: packageData.type,
        classCount: packageData.classCount,
        durationDays: packageData.durationDays,
        createdAt: packageData.createdAt,
        updatedAt: packageData.updatedAt,
      };

      const merged = {
        id: buildPackageProductId(sourceId),
        ...mergeSourceProduct(base, overrides.get(sourceKey("packages", sourceId))),
      };
      return merged.isActive === false ? null : merged;
    })
    .filter((item): item is StorefrontProduct => item !== null);

  const surftripProducts = surftripSnapshot.docs
    .map((doc) => {
      const sourceId = doc.id;
      const surftrip = doc.data() as SurftripInventoryDoc;
      if (
        surftrip.isActive === false ||
        !surftrip.sanityDocumentId ||
        !surftrip.sanitySlug ||
        !surftrip.title ||
        !Number.isFinite(surftrip.price) ||
        surftrip.price <= 0 ||
        !Number.isFinite(surftrip.capacity) ||
        surftrip.capacity <= 0
      ) {
        return null;
      }

      const availableSpots = getSurftripAvailableSpots(surftrip.capacity, surftrip.enrolledCount);

      const base: ProductDoc = {
        slug: surftrip.sanitySlug,
        name: surftrip.title,
        shortDescription:
          surftrip.shortDescription ?? "Reserva tu cupo para el siguiente surfcamp desde tu area de clases.",
        description: surftrip.country
          ? `${surftrip.country} · ${availableSpots} cupos disponibles actualmente.`
          : `${availableSpots} cupos disponibles actualmente.`,
        category: "surftrip",
        fulfillmentType: "surftrip_booking",
        price: surftrip.price,
        currency: surftrip.currency,
        isActive: surftrip.isActive,
        image: surftrip.cardImageUrl ?? surftrip.heroImageUrl ?? DEFAULT_PRODUCT_IMAGES.surftrip,
        badge: surftrip.country ? `Surfcamp ${surftrip.country}` : "Viajes SP",
        features: [
          surftrip.level ? `Nivel ${surftrip.level}` : null,
          `${surftrip.capacity} cupos totales`,
          `${availableSpots} cupos disponibles`,
        ].filter((item): item is string => Boolean(item)),
        sortOrder: 50,
        sourceCollection: "surftripInventory",
        sourceId,
        capacity: surftrip.capacity,
        enrolledCount: surftrip.enrolledCount,
        startDate: surftrip.startDate,
        endDate: surftrip.endDate,
        createdAt: surftrip.createdAt,
        updatedAt: surftrip.updatedAt,
      };

      const merged = {
        id: buildSurftripProductId(sourceId),
        ...mergeSourceProduct(base, overrides.get(sourceKey("surftripInventory", sourceId))),
      };
      return merged.isActive === false ? null : merged;
    })
    .filter((item): item is StorefrontProduct => item !== null);

  return [...packageProducts, ...standaloneProducts, ...surftripProducts].sort((a, b) => {
    const sortDelta = (a.sortOrder ?? productCategoryOrder(a.category)) - (b.sortOrder ?? productCategoryOrder(b.category));
    if (sortDelta !== 0) return sortDelta;
    if (a.category === "surftrip" && b.category === "surftrip") {
      return new Date(a.startDate ?? "").getTime() - new Date(b.startDate ?? "").getTime();
    }
    return a.name.localeCompare(b.name);
  });
}

export async function getStorefrontProductById(productId: string): Promise<StorefrontProduct | null> {
  const sourceProduct = productId.startsWith("package:")
    ? { sourceCollection: "packages" as const, sourceId: productId.slice("package:".length) }
    : productId.startsWith("surftrip:")
      ? { sourceCollection: "surftripInventory" as const, sourceId: productId.slice("surftrip:".length) }
      : null;

  if (!sourceProduct) {
    await ensureDefaultStandaloneProducts();
    const snapshot = await adminDb.collection(PRODUCT_COLLECTION).doc(productId).get();
    if (!snapshot.exists) return null;

    const product = snapshot.data() as ProductDoc;
    if (product.isActive === false) return null;

    return {
      id: snapshot.id,
      ...product,
      sourceCollection: "products",
      sourceId: snapshot.id,
      image: product.image ?? DEFAULT_PRODUCT_IMAGES[product.category],
    };
  }

  const products = await listStorefrontProducts();
  return products.find((item) => item.id === productId) ?? null;
}
