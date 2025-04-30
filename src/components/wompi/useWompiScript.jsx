// hooks/useWompiScript.js
import { useEffect } from "react";

const useWompiScript = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.wompi.co/widget.js";
    script.async = true;
    script.onload = () => console.log("Script de Wompi cargado");
    script.onerror = () => console.log("Error al cargar el script de Wompi");
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
};

export default useWompiScript;