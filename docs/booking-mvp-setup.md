# Booking MVP setup

## Environment variables

Copy `.env.example` to `.env` and set:

- Firebase client keys: `NEXT_PUBLIC_FIREBASE_*`
- Firebase admin keys: `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`
- MercadoPago keys: `MP_ACCESS_TOKEN`, `MP_PUBLIC_KEY`, `NEXT_PUBLIC_MP_PUBLIC_KEY`
- URLs: `MP_SUCCESS_URL`, `MP_FAILURE_URL`, `MP_PENDING_URL`
- Optional webhook verification: `MP_WEBHOOK_SECRET`
- Admin allowlist: `ADMIN_EMAILS` (comma-separated)

## Firestore collections

- `packages`
- `classSlots`
- `purchases`
- `bookings`

Use the same schema described in the plan and enforced by API route logic.

## Security rules

Use `docs/firestore-security.rules` as a baseline:

- public read for `packages` and `classSlots`
- user-owned read for `purchases` and `bookings`
- admin-only writes for coach-managed collections
- writes to purchases/bookings only via backend API routes

## Webhook setup

Set MercadoPago notification URL to:

- `/api/webhooks/mercadopago`

The webhook processes approved payments idempotently by `mercadopagoPaymentId`.
