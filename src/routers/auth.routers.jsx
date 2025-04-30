import React from "react";
import { Route, Routes } from "react-router";
import { Login } from "../components/login/login";

export const AuthRouters = () => {
  return (
    <Routes>
      <Route path="/*" element={<Login />} />
    </Routes>
  );
};
