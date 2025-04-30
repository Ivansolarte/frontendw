import { useState } from "react";

export const handleChange  = (initialState) => {

  const [form, setForm] = useState(initialState);

  const handleChangeText = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleChangeNum = (e) => {
    const { name, value } = e.target;  
    if (/^\d*$/.test(value)) {
      setForm((prevForm) => ({
        ...prevForm,
        [name]: value,
      }));
    }
  };

  const handleChangeParsedNum = (e) => {
    const { name, value } = e.target;
    if (/^\d*$/.test(value)) {
      setForm((prevForm) => ({
        ...prevForm,
        [name]: value === "" ? "" : Number(value),
      }));
    }
  };

  return { form, setForm, handleChangeText, handleChangeNum, handleChangeParsedNum };
};