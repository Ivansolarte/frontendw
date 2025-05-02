import { BASE_URL } from "../config/config";

export async function authLogin(payload) {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error('Error al crear el producto');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en createProduct:', error);
      throw error;
    }
  }