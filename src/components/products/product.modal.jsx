import React from "react";
import { Modal } from "../element/modal";

export const ProductModal = ({ closeModal, setOpenModal, form, handleChangeText,formatExpiration, setForm }) => {

  
  const onsubmit = () => {
    setOpenModal()
  };

  return (
    <Modal>
      <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div className="sm:flex sm:items-start">
          <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
            <svg
              className="size-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
          </div>

          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
            <h3
              className="text-base font-semibold text-gray-900 mb-4"
              id="modal-title"
            >
              Datos para el pago
            </h3>

            {/* Formulario */}
            <div className="space-y-4">
              {/* Número de tarjeta */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Número de Tarjeta
                </label>
                <input
                  value={form.cardNumber}
                  name="cardNumber"
                  onChange={handleChangeText}
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="1234 5678 9012 3456"
                />
              </div>

              {/* Fecha de expiración */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fecha de Expiración (MM/YY)
                </label>
                <input
                  value={form.expirationDate}
                  name="expirationDate"
                  onChange={(e) => {
                    const formatted = formatExpiration(e.target.value);
                    setForm(prev => ({ ...prev, expirationDate: formatted }));
                  }}
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="MM/YY"
                />
              </div>

              {/* CVV */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  CVV
                </label>
                <input
                  value={form.cvv}
                  name="cvv"
                  onChange={handleChangeText}
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="123"
                />
              </div>

              {/* Nombre del titular */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre del Titular
                </label>
                <input
                  value={form.fullName}
                  name="fullName"
                  onChange={handleChangeText}
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Juan Pérez"
                />
              </div>

              {/* Nombre completo de entrega */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre completo (Entrega)
                </label>
                <input
                  value={form.fullName}
                  name="fullName"
                  onChange={handleChangeText}
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Nombre completo"
                />
              </div>

              {/* Dirección de entrega */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Dirección de entrega
                </label>
                <input
                  value={form.deliveryAddress}
                  name="deliveryAddress"
                  onChange={handleChangeText}
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Calle 123 #45-67"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
        <button
          onClick={onsubmit}
          type="button"
          className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto"
        >
          Pagar
        </button>
        <button
          onClick={() => closeModal(false)}
          type="button"
          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
        >
          Cancelar
        </button>
      </div>
    </Modal>
  );
};
