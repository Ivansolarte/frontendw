import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../store/slices/authSlice";
import { authLogin } from "../../services/loginService";
import { handleChange } from "../../utils/handlerForm";
import { Loading } from "../modals/loading";

export const Login = () => {
  const { form, handleChangeText } = handleChange({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const [stateLoading, setStateLoading] = useState(false);
  const onsubmit = () => {
    const { email, password } = form;

    // Validar que los campos no estén vacíos
    if (!email.trim() || !password.trim()) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Por favor, ingresa un correo electrónico válido.");
      return;
    }

    // Si todo está bien, proceder con el login
    setStateLoading(true);
    authLogin(form)
      .then((resp) => {
        if (resp.token?.access_token) {
          sessionStorage.setItem(
            "token",
            JSON.stringify(`Bearer ${resp.token.access_token}`)
          );
          setStateLoading(false);
          dispatch(login());
        } else {
          setStateLoading(false);
          alert("Login fallido: no se recibió el token.");
        }
      })
      .catch((err) => {
        setStateLoading(false);
        alert("Error en login. Verifica tus credenciales.");
        console.error("Error en login:", err);
      });
  };

  return (
    <>
      <div class="flex h-screen flex-col justify-center px-6 py-12 lg:px-8 ">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            class="mx-auto h-10 w-auto"
            src="https://png.pngtree.com/png-clipart/20230819/original/pngtree-credit-money-bank-icon-picture-image_8064496.png"
            alt="Your Company"
          />
          <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Iniciar session
          </h2>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div class="space-y-6" action="#" method="POST">
            <div>
              <label
                for="email"
                class="block text-sm/6 font-medium text-gray-900"
              >
                Correo electrónico
              </label>
              <div class="mt-2">
                <input
                  onChange={handleChangeText}
                  value={form.email}
                  type="text"
                  name="email"
                  id="email"
                  autocomplete="off"
                  class="block w-full border rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between">
                <label
                  for="password"
                  class="block text-sm/6 font-medium text-gray-900"
                >
                  Contraseña
                </label>
              </div>
              <div class="mt-2">
                <input
                  onChange={handleChangeText}
                  value={form.password}
                  type="text"
                  name="password"
                  id="password"
                  autocomplete="off"
                  class="block w-full border rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
            {stateLoading && <Loading />}

            <div>
              <button
                onClick={onsubmit}
                type="button"
                class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                enviar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
