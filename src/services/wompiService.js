// src/services/wompiService.js
const API_BASE = "https://api-sandbox.co.uat.wompi.dev/v1";
const PUBLIC_KEY = "pub_stagtest_g2u0HQd3ZMh05hsSgTS2lUV8t3s4mOt7";

// Genera token de tarjeta
export const generateCardToken = async (form) => {
  const [exp_month, exp_yearShort] = form.expirationDate.split("/");
  const exp_year = "20" + exp_yearShort;

  const response = await fetch(`${API_BASE}/tokens/cards`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      number: form.cardNumber.replace(/\s/g, ""),
      cvc: form.cvv,
      exp_month,
      exp_year,
      card_holder: form.fullName,
    }),
  });

  const data = await response.json();
  if (!data?.data?.id) throw new Error("Error generando token");
  return data.data.id;
};

// Crea la transacción en Wompi
export const createWompiTransaction = async (tokenCard, email, reference, amountInCents) => {
  const response = await fetch(`${API_BASE}/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${PUBLIC_KEY}`,
    },
    body: JSON.stringify({
      amount_in_cents: amountInCents,
      currency: "COP",
      customer_email: email,
      payment_method: {
        type: "CARD",
        token: tokenCard,
        installments: 1,
      },
      reference,
    }),
  });

  return await response.json();
};
