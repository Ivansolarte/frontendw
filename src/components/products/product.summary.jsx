import React from 'react'
import { Modal } from '../element/modal'

export const ProductSummary = ({form, sendPayment ,children}) => {

    const { fullName, cardNumber, deliveryAddress, city, state, zipCode, email, phoneNumber } = form;

    // Mostrar solo los últimos 4 dígitos de la tarjeta para seguridad
    const maskedCardNumber = cardNumber.slice(-4);


  return (
    <Modal>
         <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Resumen de Pago</h2>

        <div className="mb-4">
          <h3 className="font-semibold">Detalles del Cliente:</h3>
          <p><strong>Nombre:</strong> {fullName}</p>
          <p><strong>Email:</strong> {email}</p>
          <p><strong>Teléfono:</strong> {phoneNumber}</p>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold">Método de Pago:</h3>
          <p><strong>Tarjeta:</strong> **** **** **** {maskedCardNumber}</p>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold">Dirección de Entrega:</h3>
          <p><strong>Dirección:</strong> {deliveryAddress}</p>
          <p><strong>Ciudad:</strong> {city}</p>
          <p><strong>Estado:</strong> {state}</p>
          <p><strong>Código Postal:</strong> {zipCode}</p>
        </div>
{/* 
        <div className="mb-4">
          <h3 className="font-semibold">Resumen de Pago:</h3>
          <p><strong>Precio del Producto:</strong> ${productAmount}</p>
          <p><strong>Fee Base:</strong> ${baseFee}</p>
          <p><strong>Delivery Fee:</strong> ${deliveryFee}</p>
          <p className="font-bold">Total a Pagar: ${productAmount + baseFee + deliveryFee}</p>
        </div> */}

        <div className="flex justify-end mt-4 text-center">
          {children}
        </div>
      </div>
    </Modal>
  )
}
