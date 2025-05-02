import { useState, useEffect,  } from "react";
import { getProducts } from "../../services/productService";
import { ProductSummary } from "./product.summary";
import { handleChange } from "../../utils/handlerForm";
import { Table } from "../element/table/table";
import { WompiButton } from "../wompi/WompiButton";
import { TransactionHome } from "../transactions/transaction.home";
import { Loading } from "../modals/loading";

export const ProductList = () => {
  const [arrayProducts, setArrayProducts] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openSummary, setOpenSummary] = useState(false);
  const [objectSelected, setObjectSelected] = useState({});
  const [stateLoading, setStateLoading] = useState(false)
  const [datasignature, setDatasignature] = useState("");
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");

  const { form, handleChangeText, setForm } = handleChange({
    fullName: "ivan solarte",
    cardNumber: "4242424242424242", // número de prueba válido en sandbox
    expirationDate: "12/29", // fecha de prueba válida
    cvv: "123",
    deliveryAddress: "Calle 123",
    city: "Bogotá",
    state: "Cundinamarca",
    zipCode: "110111",
    email: "test@example.com",
    phoneNumber: "3001234567",
  });

  const getInf = () => {
    setStateLoading(true)
    getProducts().then((resp) => {
      setArrayProducts(resp);
      setStateLoading(false)
    });
  };

  const pay = (payload) => {
    setObjectSelected(payload);
    setOpenModal(true);
  };

  // Función para obtener el acceptance_token
  const getAcceptanceToken = async () => {
    const response = await fetch(
      "https://api-sandbox.co.uat.wompi.dev/v1/merchants/pub_stagtest_g2u0HQd3ZMh05hsSgTS2lUV8t3s4mOt7"
    );
    const data = await response.json();
    return data;
  };
  // Crear método de pago (tarjeta tokenizada)
  const createCardToken = async () => {
    const expirationDate = form.expirationDate;
    const [expMonth, expYear] = expirationDate.split("/");
    const res = await fetch(
      "https://api-sandbox.co.uat.wompi.dev/v1/tokens/cards",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer pub_stagtest_g2u0HQd3ZMh05hsSgTS2lUV8t3s4mOt7",
        },
        body: JSON.stringify({
          number: form.cardNumber, // número de prueba válido
          cvc: form.cvv,
          exp_month: expMonth,
          exp_year: expYear, // solo dos dígitos
          card_holder: form.fullName, // al menos 5 caracteres
        }),
      }
    );
    const data = await res.json();
    return { token: data.data.id, expires_at: data.data.expires_at }; // ID del método de pago
  };
  // crear un signature
  const generateSignature = async (data) => {
    const privateKey = "stagtest_integrity_nAIBuqayW70XpUqJS4qf4STYiISd89Fp";
    // const stringToHash = `${data.reference}${data.amount_in_cents}${data.currency}${data.expires_at}${privateKey}`;
    const cleanReference = data.reference.replace(/[^a-zA-Z0-9]/g, "");
    const stringToHash = `${cleanReference}${data.amount_in_cents}${data.currency}${privateKey}`;
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

  //enviar a la transaccion
  const sendTransaction = async (acceptance, cardToken) => {
    console.log(cardToken);

    const acceptance_token =
      acceptance.data.presigned_acceptance.acceptance_token;
    const fechaHoraActual = new Date();
    const fechaHoraFormateada = `${fechaHoraActual.getFullYear()}-${String(
      fechaHoraActual.getMonth() + 1
    ).padStart(2, "0")}-${String(fechaHoraActual.getDate()).padStart(
      2,
      "0"
    )} ${String(fechaHoraActual.getHours()).padStart(2, "0")}:${String(
      fechaHoraActual.getMinutes()
    ).padStart(2, "0")}:${String(fechaHoraActual.getSeconds()).padStart(
      2,
      "0"
    )}`;

    const reference = String(objectSelected.id + "" + fechaHoraFormateada);

    const signature = await generateSignature({
      reference: reference, // referencia
      amount_in_cents: Math.round(objectSelected.price * 100), // monto en centavos
      currency: "COP",
      expires_at: cardToken.expires_at,
    });
    setDatasignature(signature);

    const res = await fetch(
      "https://api-sandbox.co.uat.wompi.dev/v1/transactions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer prv_stagtest_5i0ZGIGiFcDQifYsXxvsny7Y37tKqFWg", // PRIVATE key
        },
        body: JSON.stringify({
          acceptance_token,
          amount_in_cents: Math.round(objectSelected.price * 100),
          currency: "COP",
          customer_email: form.email,
          reference: reference.replace(/[^a-zA-Z0-9]/g, ""),
          customer_data: {
            phone_number: form.phoneNumber,
            full_name: form.fullName,
            legal_id: "1234567892",
            legal_id_type: "CC",
          },
          payment_method: {
            // type: "BANCOLOMBIA_TRANSFER",
            // payment_description: "Pago a Tienda Wompi",
            // user_type: "PERSON",
            type: "CARD",
            installments: 1, // Número de cuotas
            token: cardToken.token,
          },
          signature,
        }),
      }
    );

    const data = await res.json();
    return data;
  };

  const sendPayment = async () => {
    const acceptance = await getAcceptanceToken();
    const cardToken = await createCardToken();
    const stateTransaction = await sendTransaction(acceptance, cardToken);

    console.log(acceptance);
    console.log(cardToken);
    console.log(stateTransaction);

    setAmount(stateTransaction.data.amount_in_cents);
    setReference(stateTransaction.data.reference);

    // const resp = await fetch(
    //   `https://api-sandbox.co.uat.wompi.dev/v1/transactions/${stateTransaction.data.id}`,
    //   {
    //     method: "GET",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: "Bearer prv_stagtest_5i0ZGIGiFcDQifYsXxvsny7Y37tKqFWg", // PRIVATE key
    //     },
    //   }
    // );
    // const data = await resp.json();
    // console.log(data);
  };

  const formatExpiration = (input) => {
    let raw = input.replace(/\D/g, ""); // solo dígitos
    if (raw.length > 4) raw = raw.slice(0, 4);
    if (raw.length > 2) return raw.slice(0, 2) + "/" + raw.slice(2);
    return raw;
  };

  const mostrar = () => {
    setOpenModal(false);
    setOpenSummary(true);
    sendPayment();
  };

  useEffect(() => {
    getInf();

    return () => {
      // document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="md:mx-10 md:px-8">
      <Table arrayProducts={arrayProducts} pay={pay} />
      {stateLoading&<Loading/>}
      {openModal && (
        <TransactionHome
          closeModal={setOpenModal}
          setOpenModal={mostrar}        
          formatExpiration={formatExpiration}
          dataRow={objectSelected}
        />
        // <ProductModal
        //   closeModal={setOpenModal}
        //   setOpenModal={mostrar}
        //   form={form}
        //   handleChangeText={handleChangeText}
        //   formatExpiration={formatExpiration}
        //   setForm={setForm}
        // />
      )}
      {openSummary && (
        <>
          <ProductSummary form={form} sendPayment={sendPayment}>
            {amount && reference && datasignature && (
              <>
                <WompiButton
                  amount={amount}
                  reference={reference}
                  signature={datasignature}
                />
                <button className="flex items-center gap-2 bg-[#1043a8] text-white text-sm font-medium px-4 py-2 rounded">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 fill-white"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 1C7.59 1 4 4.59 4 9c0 5.25 7.37 12.25 7.68 12.55a1 1 0 0 0 1.43 0C12.63 21.25 20 14.25 20 9c0-4.41-3.59-8-8-8zm0 17.92C10.17 17.09 6 12.53 6 9a6 6 0 0 1 12 0c0 3.53-4.17 8.09-6 9.92zM11 11.59 8.91 9.5 8.5 9.91l2.5 2.5 4.5-4.5-.41-.41z" />
                  </svg>
                  Paga con Wompi
                </button>
              </>
            )}
          </ProductSummary>
        </>
      )}
    </div>
  );
};
