import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../store/slices/authSlice";
import { authLogin } from "../../services/loginService";
import { handleChange } from "../../utils/handlerForm";
import { Loading } from "../modals/loading";
import { InputClassic } from "../element/input/inputClassic";
import { ButtonClassic } from "../element/button/buttonClassic";
import { ModalInf } from "../element/modal/modalInf";

export const Login = () => {
  const { form, handleChangeText } = handleChange({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const [stateLoading, setStateLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [titleModal, setTitleModal] = useState("");
  const onsubmit = () => {
    const { email, password } = form;

    // Validar que los campos no estén vacíos
    if (!email.trim() || !password.trim()) {
      setOpenModal(true)
      setTitleModal("Por favor, completa todos los campos");
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setOpenModal(true)
      setTitleModal("Por favor, ingresa un correo electrónico válido");
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
          setOpenModal(true)
          setTitleModal("No se recibió el token");
        }
      })
      .catch((err) => {
        setStateLoading(false);
        setOpenModal(true)
        setTitleModal("Verifica tus credenciales");
        console.error("Error en login:", err);
      });
  };

  return (
    <>
      <div className="flex h-screen flex-col justify-center px-6 py-12 lg:px-8 ">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://png.pngtree.com/png-clipart/20230819/original/pngtree-credit-money-bank-icon-picture-image_8064496.png"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Iniciar session
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="space-y-6" action="#" method="POST">
            <InputClassic
              title={"Correo electrónico"}
              onChange={handleChangeText}
              value={form.email}
              placeholder="xxxx@emial.com"
              name="email"
            />
            <InputClassic
              title={"Correo electrónico"}
              onChange={handleChangeText}
              value={form.password}
              name="password"
              placeholder="Contraseña"
            />
            {stateLoading && <Loading />}
            {openModal && <ModalInf title={titleModal} setClose={setOpenModal} />}
            <div>
              <ButtonClassic onClick={onsubmit} title={"enviar"} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
