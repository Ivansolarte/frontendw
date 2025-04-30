import React from "react";
import { Modal } from "../element/modal";
import { handleChange } from "../../utils/handlerForm";
import { createTransaction } from "../../services/transactionService";

export const TransactionHome = ({ closeModal, dataRow }) => {
  const { form, handleChangeText, setForm } = handleChange({
    customerName: "", //formulario
    customerAddress: "", //formulario
    productId: dataRow.id,
    quantity: dataRow.stock,
    status: "PENDING",

    cardNumber: "4242424242424242", //formulario
    expirationDate: "", //formulario
    cvv: "", //formulario
    email: "", //formulario
    phone_number: "", //formulario

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
    const privateKey = "stagtest_integrity_nAIBuqayW70XpUqJS4qf4STYiISd89Fp";
    // const stringToHash = `${data.reference}${data.amount_in_cents}${data.currency}${data.expires_at}${privateKey}`;
    const cleanReference = data.reference.replace(/[^a-zA-Z0-9]/g, "");
    const amount_in_cents = Math.round(data.amount_in_cents * 100);
    const stringToHash = `${cleanReference}${amount_in_cents}${data.currency}${privateKey}`;

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
    // 1. Verificación de campos obligatorios (los campos con //formulario)
    const requiredFields = [
      { name: "customerName", label: "Nombre del Cliente" },
      { name: "customerAddress", label: "Dirección del Cliente" },
      { name: "cardNumber", label: "Número de tarjeta" },
      { name: "expirationDate", label: "Fecha de expiración" },
      { name: "cvv", label: "CVV" },
      { name: "email", label: "Correo electrónico" },
      { name: "phone_number", label: "Número de teléfono" },
    ];

    // Recorremos los campos obligatorios
    for (let field of requiredFields) {
      const value = form[field.name];
      if (!value || value.trim() === "") {
        alert(`El campo ${field.label} es obligatorio.`);
        return; // Detenemos el envío si algún campo está vacío
      }
    }

    // 2. Validación de los campos con restricciones (como el formato del email, CVV, etc.)
    // Validación de Email
    const email = form.email;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      alert("El formato del correo electrónico es incorrecto.");
      return; // Detener el envío del formulario
    }

    // Validación de CVV (3 dígitos numéricos)
    const cvv = form.cvv;
    if (!/^\d{3}$/.test(cvv)) {
      alert("El CVV debe ser un número de 3 dígitos.");
      return; // Detener el envío del formulario
    }

    // Validación de número de tarjeta (solo dígitos, longitud 16)
    const cardNumber = form.cardNumber;
    if (!/^\d{16}$/.test(cardNumber)) {
      alert("El número de tarjeta debe contener 16 dígitos.");
      return; // Detener el envío del formulario
    }

    const signature = await generateSignature(form);

    getAcceptanceToken().then((resp) => {
      form.acceptance_token = resp.data.presigned_acceptance.acceptance_token;
      form.signature = signature;
      console.log(form);
      createTransaction(form).then((resp) => {
        console.log(resp);
        if (resp.data) {
          alert('transferencia exitosa')
          closeModal(false)          
        }
        if (resp.error.messages.payment_method) {
         return alert("ocurrio un erro con el token de wompi")
        }
        if (resp.error.messages.reference) {
         return alert("La referencia ya ha sido usada debe de crear otro producto")
        }
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

            <div className="space-y-4">
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
                  placeholder="1234567890123456"
                  maxLength={'16'}

                />
              </div>

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
                  maxLength={"3"}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Correo Electrónico
                </label>
                <input
                  value={form.email}
                  name="email"
                  onChange={handleChangeText}
                  type="text"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm"
                  placeholder="correo@ejemplo.com"
                />
              </div>

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
                  maxLength={"10"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

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
