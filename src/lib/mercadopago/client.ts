import { MercadoPagoConfig, Payment, Preference } from "mercadopago";

let _client: MercadoPagoConfig | null = null;

function getClient() {
  if (_client) return _client;

  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error("MP_ACCESS_TOKEN is not configured");
  }

  _client = new MercadoPagoConfig({
    accessToken,
    options: {
      timeout: 5000,
    },
  });
  return _client;
}

export function getPreferenceClient() {
  return new Preference(getClient());
}

export function getPaymentClient() {
  return new Payment(getClient());
}
