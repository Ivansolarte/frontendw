import { useDispatch } from "react-redux";
import { login } from "../../store/slices/authSlice";
import { authLogin } from "../../services/loginService";
import { handleChange } from "../../utils/handlerForm";

export const Login = () => {
  const { form, handleChangeText } = handleChange({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();

const onsubmit = () => {
  authLogin(form).then((resp) => {
    console.log(resp.token);
    console.log( resp.token.access_token);
    if (resp.token.access_token) {
      sessionStorage.setItem("token", JSON.stringify( `Bearer ${resp.token.access_token}`));
      dispatch(login());
    } else {
      console.error("Login fallido: no se recibió el token.");
    }
  }).catch((err) => {
    console.error("Error en login:", err);
  });
};

  return (
    <>
      <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            class="mx-auto h-10 w-auto"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div class="space-y-6" action="#" method="POST">
            <div>
              <label
                for="email"
                class="block text-sm/6 font-medium text-gray-900"
              >
                Email address
              </label>
              <div class="mt-2">
                <input
                  onChange={handleChangeText}
                  value={form.email}
                  type="text"
                  name="email"
                  id="email"
                  autocomplete="off"
                  class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between">
                <label
                  for="password"
                  class="block text-sm/6 font-medium text-gray-900"
                >
                  Password
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
                  class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <button
                onClick={onsubmit}
                type="button"
                class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
