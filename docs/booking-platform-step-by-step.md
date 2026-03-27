# SP Surf Booking - Step-by-step setup

This guide is the practical checklist to run the booking MVP locally with Firebase + MercadoPago (Peru).

---

## 1) Install dependencies

From project root:

```bash
npm install
```

Already required in this project:

- `firebase`
- `firebase-admin`
- `mercadopago`
- `class-variance-authority`, `clsx`, `tailwind-merge`, `@radix-ui/react-slot`, `lucide-react`

---

## 2) Create Firebase project

1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Create a new project (or use an existing one).
3. Add a Web App inside Firebase project.
4. Copy Firebase web config values (apiKey, authDomain, etc.).

---

## 3) Enable Firebase Auth

In Firebase Console -> **Authentication** -> **Sign-in method**:

- Enable **Google**
- Enable **Email/Password**

Optional:
- Add authorized domains for your environment (localhost, production domain).

---

## 4) Create Firestore database

In Firebase Console -> **Firestore Database**:

1. Create database (Production mode recommended for real environments).
2. Choose region near your users.

Collections used by this app:

- `packages`
- `classSlots`
- `purchases`
- `bookings`

---

## 5) Add initial Firestore data

Create at least one package and one class slot manually in Firestore UI:

### `packages` example (credits)

```json
{
  "name": "4 Classes",
  "type": "credits",
  "classCount": 4,
  "price": 320,
  "currency": "PEN",
  "isActive": true,
  "createdAt": "2026-03-15T00:00:00.000Z",
  "updatedAt": "2026-03-15T00:00:00.000Z"
}
```

### `packages` example (unlimited)

```json
{
  "name": "Unlimited Month",
  "type": "unlimited",
  "durationDays": 30,
  "price": 560,
  "currency": "PEN",
  "isActive": true,
  "createdAt": "2026-03-15T00:00:00.000Z",
  "updatedAt": "2026-03-15T00:00:00.000Z"
}
```

### `classSlots` example

```json
{
  "startsAt": "2026-03-25T07:00:00.000Z",
  "capacity": 8,
  "enrolledCount": 0,
  "isActive": true,
  "coachNotes": "Nivel intermedio",
  "createdAt": "2026-03-15T00:00:00.000Z",
  "updatedAt": "2026-03-15T00:00:00.000Z"
}
```

`purchases` and `bookings` are created by the backend flow.

---

## 6) Create Firebase service account for server API

In Firebase Console:

1. **Project settings** -> **Service accounts**
2. Generate private key JSON
3. Use values in `.env`:
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY`

Important:
- Keep `FIREBASE_PRIVATE_KEY` with escaped newlines (`\\n`) in `.env`.
- Never expose these values in client-side code.

---

## 7) Configure MercadoPago (Peru)

1. Create app in MercadoPago developers panel for **Peru** account (`mercadopago.com.pe`).
2. Get credentials:
   - Access token (server)
   - Public key (client)
3. Configure webhook URL in MercadoPago:
   - `https://your-domain.com/api/webhooks/mercadopago`
   - For local, use tunnel (ngrok/cloudflared) and point webhook there.

---

## 8) Configure environment variables

Copy `.env.example` to `.env` and fill all values:

Required keys:

- Firebase client:
  - `NEXT_PUBLIC_FIREBASE_API_KEY`
  - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
  - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
  - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
  - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
  - `NEXT_PUBLIC_FIREBASE_APP_ID`
- Firebase server:
  - `FIREBASE_PROJECT_ID`
  - `FIREBASE_CLIENT_EMAIL`
  - `FIREBASE_PRIVATE_KEY`
- MercadoPago:
  - `MP_ACCESS_TOKEN`
  - `MP_PUBLIC_KEY`
  - `NEXT_PUBLIC_MP_PUBLIC_KEY`
  - `MP_WEBHOOK_SECRET` (optional but recommended)
  - `MP_SUCCESS_URL`
  - `MP_FAILURE_URL`
  - `MP_PENDING_URL`
- Admin:
  - `ADMIN_EMAILS` (comma-separated admin emails)

---

## 9) Apply Firestore security rules

Use:

- `docs/firestore-security.rules`

Deploy rules via Firebase CLI:

```bash
firebase login
firebase init firestore
firebase deploy --only firestore:rules
```

If you already have Firebase config files in project, just run deploy.

---

## 10) Run the app

```bash
npm run dev
```

Main pages:

- Student: `http://localhost:3000/clases`
- Admin: `http://localhost:3000/admin`

---

## 11) End-to-end test checklist

1. Login as student (Google or email/password).
2. Open `/clases`.
3. Choose package -> redirected to MercadoPago checkout.
4. Complete payment in MercadoPago.
5. Confirm webhook received at `/api/webhooks/mercadopago`.
6. Verify purchase created in `purchases`.
7. Reserve a class slot.
8. Verify:
   - `bookings` has new booking
   - `classSlots.enrolledCount` increased
   - `remainingCredits` decreased for credit package
9. Repeat booking until slot reaches capacity and confirm rejection.

---

## 12) Admin checklist

1. Login with an email listed in `ADMIN_EMAILS` (or custom claim role=admin).
2. Open `/admin`.
3. Create/Edit/Deactivate package.
4. Create/Edit/Deactivate class slot.
5. Open slot bookings list and confirm reservations are visible.

---

## 13) Common issues

- `Unauthorized` from API:
  - User not signed in or missing Firebase ID token.
- `Forbidden` in admin endpoints:
  - Email not in `ADMIN_EMAILS` and no `role=admin` claim.
- No packages or slots shown:
  - Collections are empty or docs have `isActive: false`.
- Checkout fails:
  - `MP_ACCESS_TOKEN` invalid or wrong country account.
- Webhook not creating purchases:
  - Wrong webhook URL, metadata missing, or payment status not `approved`.

