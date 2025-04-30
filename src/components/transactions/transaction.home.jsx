import React from "react";
import { Modal } from "../element/modal";
import { handleChange } from "../../utils/handlerForm";
import { createTransaction } from "../../services/transactionService";

export const TransactionHome = ({ closeModal, setOpenModal, dataRow }) => {
  const { form, handleChangeText, setForm } = handleChange({
    customerName: "ivan solarte",
    customerAddress: "Calle 123",
    productId: dataRow.id,
    quantity: dataRow.stock,
    status: "PENDING",

    cardNumber: "4242424242424242",
    expirationDate: "12/29",
    cvv: "123",
    email: "test@example.com",
    phone_number: "3001234567",

    amount_in_cents: dataRow.price,
    currency: "COP",
    customer_email: "",
    reference: `${dataRow.name}${dataRow.price}`,
    legal_id: "1234567892",
    legal_id_type: "CC",
    payment_method: {
      type: "CARD",
      installments: 1,
      token: "",
    },
    signature: "",
  });

  const formatExpiration = (input) => {
    let raw = input.replace(/\D/g, "");
    if (raw.length > 4) raw = raw.slice(0, 4);
    if (raw.length > 2) return raw.slice(0, 2) + "/" + raw.slice(2);
    return raw;
  };

  const getAcceptanceToken = async () => {
    const response = await fetch(
      "https://api-sandbox.co.uat.wompi.dev/v1/merchants/pub_stagtest_g2u0HQd3ZMh05hsSgTS2lUV8t3s4mOt7"
    );
    const data = await response.json();
    return data;
  };

  const generateSignature = async (data) => {
    console.log({data});
    
    const privateKey = "stagtest_integrity_nAIBuqayW70XpUqJS4qf4STYiISd89Fp";
    // const stringToHash = `${data.reference}${data.amount_in_cents}${data.currency}${data.expires_at}${privateKey}`;
    const cleanReference = data.reference.replace(/[^a-zA-Z0-9]/g, "");
    const amount_in_cents = Math.round(data.amount_in_cents * 100)
    const stringToHash = `${cleanReference}${amount_in_cents}${data.currency}${privateKey}`;
    console.log(stringToHash);
    
    const encodedText = new TextEncoder().encode(stringToHash);
    const hashBuffer = await window.crypto.subtle.digest(
      "SHA-256",
      encodedText
    );
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return hashHex;
  };

  const onsubmit = async () => {
    const signature = await generateSignature(form);
  console.log({signature});
  
    getAcceptanceToken().then((resp) => {
      console.log(resp.data.presigned_acceptance.acceptance_token);
      form.acceptance_token = resp.data.presigned_acceptance.acceptance_token;
      form.signature = signature;
      createTransaction(form).then((resp) => {
        console.log(resp);
      });
    });
  };

  return (
    <Modal>
      <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div className="sm:flex sm:items-start">
          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
              Datos para el pago
            </h3>

            {/* Formulario */}
            <div className="space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre del Cliente
                </label>
                <input
                  value={form.customerName}
                  name="customerName"
                  onChange={handleChangeText}
                  type="text"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm"
                  placeholder="Juan Pérez"
                />
              </div>

              {/* Dirección */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Dirección del Cliente
                </label>
                <input
                  value={form.customerAddress}
                  name="customerAddress"
                  onChange={handleChangeText}
                  type="text"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm"
                  placeholder="Calle 123 #45-67"
                />
              </div>

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
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm"
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
                    setForm((prev) => ({
                      ...prev,
                      expirationDate: formatted,
                    }));
                  }}
                  type="text"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm"
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
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm"
                  placeholder="123"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Correo Electrónico
                </label>
                <input
                  value={form.email}
                  name="email"
                  onChange={handleChangeText}
                  type="email"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm"
                  placeholder="correo@ejemplo.com"
                />
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Teléfono
                </label>
                <input
                  value={form.phone_number}
                  name="phone_number"
                  onChange={handleChangeText}
                  type="text"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm"
                  placeholder="3001234567"
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
          className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
        >
          Pagar
        </button>
        <button
          onClick={() => closeModal(false)}
          type="button"
          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
        >
          Cancelar
        </button>
      </div>
    </Modal>
  );
};
