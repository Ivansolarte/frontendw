// src/services/transactionService.js

import { BASE_URL } from "../config/config";

export async function createTransaction(payload) {
  const response = await fetch(`${BASE_URL}/transaction`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: JSON.parse(sessionStorage.getItem("token")),
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error("Error al crear transacción");
  }
  return await response.json();
}

export async function simulatePayment(transactionId) {
  const response = await fetch(`${BASE_URL}/simulate-payment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: JSON.parse(sessionStorage.getItem("token")),
    },
    body: JSON.stringify({ transactionId }),
  });
  if (!response.ok) {
    throw new Error("Error al simular pago");
  }
  return await response.json();
}
