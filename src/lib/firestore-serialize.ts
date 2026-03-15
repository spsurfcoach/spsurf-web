type Serializable = Record<string, unknown> | unknown[] | Date | null | undefined;

function toPlainValue(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (Array.isArray(value)) return value.map(toPlainValue);
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "object") {
    const maybeTimestamp = value as { toDate?: () => Date };
    if (typeof maybeTimestamp.toDate === "function") {
      return maybeTimestamp.toDate().toISOString();
    }

    const out: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      out[key] = toPlainValue(nested);
    }
    return out;
  }
  return value;
}

export function serializeFirestore<T extends Serializable>(value: T): T {
  return toPlainValue(value) as T;
}
