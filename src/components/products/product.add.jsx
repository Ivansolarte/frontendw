import { useState } from "react";
import { useNavigate } from "react-router";
import { handleChange } from "../../utils/handlerForm";
import { createProduct } from "../../services/productService";
import { Loading } from "../modals/loading";
import { ModalInf } from "../element/modal/modalInf";
import { InputClassic } from "../element/input/inputClassic";
import { ButtonClassic } from "../element/button/buttonClassic";

export const ProductAdd = () => {
  const navigate = useNavigate();
  const { form, handleChangeText, handleChangeParsedNum } = handleChange({
    name: "",
    description: "",
    price: 0,
    stock: 0,
  });
  const [stateLoading, setStateLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [titleModal, setTitleModal] = useState("");

  const handleSubmit = () => {
    const { name, description, price, stock } = form;

    if (!name.trim() || !description.trim()) {
      setOpenModal(true);
      setTitleModal("Por favor, completa todos los campos de texto");
      return;
    }

    if (isNaN(price) || price <= 0) {
      setOpenModal(true);
      setTitleModal("El precio debe ser un número mayor que 0");
      return;
    }

    if (isNaN(stock) || stock < 0) {
      setOpenModal(true);
      setTitleModal("Las existencias deben ser un número igual o mayor que 0");
      return;
    }
    setStateLoading(true);
    createProduct(form).then((resp) => {
      if (resp) {
        setStateLoading(false);
        navigate("/");
      }
    });
  };
  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded p-6 space-y-4 border">
      <h2 className="text-2xl font-bold mb-4 text-center">Crear Producto</h2>
      <div>
        <InputClassic
          title={"Nombre"}
          placeholder="nombre completo"
          name="name"
          value={form.name}
          onChange={handleChangeText}
        />
      </div>
      <div>
        <label className="block text-gray-700 font-medium">Descripción</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChangeText}
          className="w-full px-4 py-2 border rounded"
          required
        ></textarea>
      </div>
      <div>
        <InputClassic
          title={"Precio"}
          placeholder="00"
          name="price"
          value={form.price}
          onChange={handleChangeParsedNum}
          maxLength={"6"}
        />
      </div>
      <div>
        <InputClassic
          title={"Existencias"}
          placeholder="0"
          name="stock"
          value={form.stock}
          onChange={handleChangeParsedNum}
          maxLength={"6"}
        />
      </div>
      <ButtonClassic onClick={handleSubmit} title={"Guardar Producto"} />
     
      {stateLoading && <Loading />}
      {openModal && <ModalInf title={titleModal} setClose={setOpenModal} />}
    </div>
  );
};
