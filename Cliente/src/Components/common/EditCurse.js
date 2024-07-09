import React from "react";
import HeadersHome from "./HeadersHome";

const EditCurse = ({ cursoId }) => {
  return (
    <div>
      <HeadersHome />

      <h1>Editar Curso</h1>
      <h2>El id del curso es: {cursoId}</h2>
    </div>
  );
};

export default EditCurse;
