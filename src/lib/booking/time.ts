const LIMA_UTC_OFFSET_MS = 5 * 60 * 60 * 1000;

/**
 * Class slots created from the admin UI store `startsAt` as a naive local
 * datetime ("2026-07-14T06:00") in America/Lima (UTC-5, no DST). Parsing that
 * with `new Date()` on a UTC server shifts every rule (12h cancellation
 * window, upcoming filters) by 5 hours. Timezone-suffixed values pass through.
 */
export function parseSlotStartsAt(startsAt: string): Date {
  if (/Z$|[+-]\d{2}:?\d{2}$/.test(startsAt)) {
    return new Date(startsAt);
  }
  return new Date(new Date(`${startsAt}Z`).getTime() + LIMA_UTC_OFFSET_MS);
}
