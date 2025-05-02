// import React, { useMemo } from "react";

// const WompiButton = ({ amount, reference, signature }) => {
//   const cleanReference = (value) => value.replace(/[^a-zA-Z0-9]/g, "");

//   const cleanedRef = useMemo(() => cleanReference(reference), [reference]);

//   return (
//     <form>
//       <script
//         src="https://checkout.wompi.co/widget.js"
//         data-render="button"
//         data-public-key="pub_stagtest_g2u0HQd3ZMh05hsSgTS2lUV8t3s4mOt7"
//         data-currency="COP"
//         data-amount-in-cents={amount}
//         data-reference={cleanedRef}
//         data-signature:integrity={signature}
//       ></script>
//     </form>
//   );
// };

// export default WompiButton;




// import React, { useEffect, useRef } from "react";

// const WompiButton = ({ amount, reference, signature }) => {
//   console.log({ amount, reference, signature });
//   const cleanReference = (value) => {
//     return value.replace(/[^a-zA-Z0-9]/g, "");
//   };

//   const formRef = useRef(null);

//   useEffect(() => {
//     // Limpia el script anterior si existe
//     const existingScript = document.querySelector(
//       'script[src="https://checkout.wompi.co/widget.js"]'
//     );
//     if (existingScript) existingScript.remove();

//     const script = document.createElement("script");
//     script.src = "https://checkout.wompi.co/widget.js";
//     script.setAttribute("data-render", "button");
//     script.setAttribute(
//       "data-public-key",
//       "pub_stagtest_g2u0HQd3ZMh05hsSgTS2lUV8t3s4mOt7"
//     );
//     script.setAttribute("data-currency", "COP");
//     script.setAttribute("data-amount-in-cents", amount);
//     const cleanRef = cleanReference(reference);
//     script.setAttribute("data-reference", cleanRef);
//     script.setAttribute("data-signature:integrity", signature);
//     script.async = true;

//     console.log("Script atributos:");
//     console.log("amount:", script.getAttribute("data-amount-in-cents"));
//     console.log("reference:", script.getAttribute("data-reference"));
//     console.log("signature:", script.getAttribute("data-signature:integrity"));

//     if (formRef.current) {
//       formRef.current.innerHTML = ""; // Limpiar antes de insertar
//       formRef.current.appendChild(script);
//     }
//   }, [amount, reference, signature]);

//   return <form ref={formRef}></form>;
// };

// export default WompiButton;


import { useEffect, useRef } from 'react'

export const WompiButton = ({ amount, reference, signature }) => {
  const formRef = useRef(null);

  const cleanReference = (value) => value.replace(/[^a-zA-Z0-9]/g, "");
  const cleanedRef = cleanReference(reference);

  useEffect(() => {
    if (!formRef.current) return;  
    const script = document.createElement("script");
    script.src = "https://checkout.wompi.co/widget.js";
    script.setAttribute("data-render", "button");
    script.setAttribute("data-public-key", "pub_stagtest_g2u0HQd3ZMh05hsSgTS2lUV8t3s4mOt7");
    script.setAttribute("data-currency", "COP");
    script.setAttribute("data-amount-in-cents", amount);
    script.setAttribute("data-reference", cleanedRef);
    script.setAttribute("data-signature:integrity", signature);
    script.async = true;

    formRef.current.innerHTML = ""; 
    formRef.current.appendChild(script);
  }, [amount, cleanedRef, signature]);
  return (
    <form ref={formRef}></form>
  )
}
