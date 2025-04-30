const isLocalhost = window.location.hostname === "localhost";

export const BASE_URL = isLocalhost
  ? "http://localhost:3000" // backend local
  : "https://backendw-fls8.onrender.com"; // backend en render