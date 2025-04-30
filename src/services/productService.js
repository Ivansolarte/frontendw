// src/services/productService.js

import { BASE_URL } from "../config/config";

export async function getProducts() {
  try {
    const response = await fetch(`${BASE_URL}/product`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: JSON.parse(sessionStorage.getItem("token")),
      },
    });
    if (!response.ok) {
      throw new Error("Error al obtener los productos");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en fetchProducts:", error);
    throw error;
  }
}

export async function createProduct(payload) {
  try {
    const response = await fetch(`${BASE_URL}/product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: JSON.parse(sessionStorage.getItem("token")),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Error al crear el producto");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en createProduct:", error);
    throw error;
  }
}
