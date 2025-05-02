import React from "react";
import { Route, Routes } from "react-router";
import { Header } from "../components/header/header";
import { ProductHome } from "../components/products/product.home";
import { ProductAdd } from "../components/products/product.add";

export const HomeRouters = () => {
  return (
    <>
      <Header />
      <div className=" md:my-10">
        <Routes>
          <Route path="/*" element={<ProductHome />} />
          <Route path="/addProduct" element={<ProductAdd />} />
        </Routes>
      </div>
    </>
  );
};
