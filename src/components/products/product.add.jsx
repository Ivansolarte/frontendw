import { useNavigate } from "react-router";
import { handleChange } from "../../utils/handlerForm";
import { createProduct } from "../../services/productService";

export const ProductAdd = () => {
  const navigate = useNavigate();
  const { form, handleChangeText, handleChangeParsedNum } = handleChange({
    name: "",
    description: "",
    price: 0,
    stock: 0,
  });

  const handleSubmit = () => {
    const { name, description, price, stock } = form;

    if (!name.trim() || !description.trim()) {
      alert("Por favor, completa todos los campos de texto.");
      return;
    }

    if (isNaN(price) || price <= 0) {
      alert("El precio debe ser un número mayor que 0.");
      return;
    }

    if (isNaN(stock) || stock < 0) {
      alert("Las existencias deben ser un número igual o mayor que 0.");
      return;
    }

    createProduct(form).then((resp) => {
      if (resp) {
        navigate("/");
      }
    });
  };
  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded p-6 space-y-4 border">
      <h2 className="text-2xl font-bold mb-4 text-center">Crear Producto</h2>

      <div>
        <label className="block text-gray-700 font-medium">Nombre</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChangeText}
          className="w-full px-4 py-2 border rounded"
          required
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
        <label className="block text-gray-700 font-medium">Precio</label>
        <input
          type="text"
          name="price"
          value={form.price}
          onChange={handleChangeParsedNum}
          className="w-full px-4 py-2 border rounded"
          required
          min="0"
          maxLength={'6'}
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium">Existencsias</label>
        <input
          type="text"
          name="stock"
          value={form.stock}
          onChange={handleChangeParsedNum}
          className="w-full px-4 py-2 border rounded"
          required
          min="0"
        />
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Guardar Producto
      </button>
    </div>
  );
};
