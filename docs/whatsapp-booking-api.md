# WhatsApp Booking API (Jelou AI Workflow Builder)

Machine-to-machine API so a Jelou WhatsApp workflow can let students book classes from chat.

## How it works

1. Every endpoint lives under `/api/whatsapp/*` and requires the header `x-api-key: <WHATSAPP_API_KEY>` (set in `.env` / Vercel env vars). Keep this key server-side inside the Jelou HTTP node — never expose it to the chat.
2. Identity = the WhatsApp sender's phone number. The API looks the phone up in the `whatsappContacts` Firestore collection (phone → signup email), then resolves that email to the Firebase Auth account. A phone can only ever act on behalf of the email it is mapped to.
3. Booking/cancellation reuse the exact same transactions as the website (credit consumption, capacity checks, 12-hour cancellation window, credit refunds).

Phone matching is digits-only and tolerant of country codes: `+51 987 654 321`, `51987654321` and `987654321` all resolve to the same contact (9-digit numbers are assumed Peruvian, `51` prefix).

## Managing the phone → email list (your spreadsheet)

Bulk upsert (paste rows from the spreadsheet as JSON):

```bash
curl -X POST https://<site>/api/whatsapp/contacts \
  -H "x-api-key: $WHATSAPP_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contacts": [
      { "phone": "987654321", "email": "example@gmail.com" },
      { "phone": "+51 912 345 678", "email": "other@gmail.com" }
    ]
  }'
```

- `GET /api/whatsapp/contacts` — list all mappings.
- `DELETE /api/whatsapp/contacts?phone=987654321` — remove one.
- Re-posting a phone overwrites its email (safe to re-import the whole spreadsheet).

## Endpoints for the workflow

All responses are JSON with `ok: true|false`. On failure, `error` is a stable machine code the workflow can branch on.

### 1. `GET /api/whatsapp/class-slots`

Upcoming classes with available spots.

```json
{ "ok": true, "items": [
  { "id": "abc123", "startsAt": "2026-07-15T08:00:00.000Z", "capacity": 6, "enrolledCount": 2, "spotsLeft": 4, "isActive": true }
] }
```

### 2. `GET /api/whatsapp/me?phone={{sender_phone}}`

Who the sender is, whether they can book, and their upcoming bookings (with the `bookingId` needed to cancel).

```json
{
  "ok": true,
  "email": "example@gmail.com",
  "canBook": true,
  "balance": { "packageType": "credits", "productName": "Pack 8 clases", "remainingCredits": 5, "expiresAt": null },
  "upcomingBookings": [
    { "bookingId": "bk1", "classSlotId": "abc123", "startsAt": "2026-07-15T08:00:00.000Z", "bookedAt": "2026-07-10T20:00:00.000Z" }
  ]
}
```

### 3. `POST /api/whatsapp/bookings`

Body: `{ "phone": "{{sender_phone}}", "classSlotId": "abc123" }`

```json
{ "ok": true, "bookingId": "bk1", "classSlotId": "abc123", "startsAt": "2026-07-15T08:00:00.000Z", "email": "example@gmail.com" }
```

### 4. `DELETE /api/whatsapp/bookings/{bookingId}?phone={{sender_phone}}`

```json
{ "ok": true, "bookingId": "bk1" }
```

## Error codes

| Code | HTTP | Meaning / suggested bot reply |
| --- | --- | --- |
| `INVALID_API_KEY` | 401 | Wrong/missing `x-api-key` (workflow misconfigured). |
| `PHONE_NOT_REGISTERED` | 404 | Sender's phone is not in the contact list → "No encontramos tu número, escríbenos para registrarte." |
| `ACCOUNT_NOT_FOUND` | 404 | Phone is mapped, but the email has no account on the site. |
| `NO_ACTIVE_PURCHASE` | 400 | No credits / active membership → offer packages. |
| `CLASS_SLOT_FULL` | 400 | Class is full → offer other slots. |
| `CLASS_SLOT_NOT_FOUND` / `CLASS_SLOT_INACTIVE` | 404 / 400 | Slot no longer available. |
| `BOOKING_NOT_FOUND` / `BOOKING_NOT_OWNED` | 404 / 403 | Cancel target invalid / belongs to another user. |
| `BOOKING_ALREADY_CANCELLED` | 400 | Already cancelled. |
| `CANCELLATION_WINDOW_PASSED` | 400 | Less than 12 h before class → cannot cancel. |
| `WHATSAPP_API_NOT_CONFIGURED` | 503 | `WHATSAPP_API_KEY` env var missing on the server. |

## Suggested Jelou workflow shape

1. **Intent: "reservar"** → HTTP node `GET /me?phone={{context.user.phone}}`.
   - `PHONE_NOT_REGISTERED` → registration message.
   - `canBook: false` → send packages link.
2. HTTP node `GET /class-slots` → render `items` as a list/buttons (`startsAt` formatted, keep `id` as payload).
3. User picks a slot → HTTP node `POST /bookings` with `{ phone, classSlotId }` → confirm with `startsAt`, or branch on `error`.
4. **Intent: "cancelar"** → `GET /me` → list `upcomingBookings` → `DELETE /bookings/{bookingId}?phone=...` → confirm.
