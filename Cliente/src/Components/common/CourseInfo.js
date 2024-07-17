import React from "react";

const CourseInfo = ({ curso, cursoId, miniaturaUrl }) => {
  // Formatea la fecha de creación del curso
  const FechaCreacion = new Date(curso.Fecha_Creacion);
  const FechaCreacionAc = FechaCreacion.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-2">Información del Curso</h2>
      <p><strong>Nombre:</strong> {curso.Nombre_Curso}</p>
      <p><strong>Descripción:</strong> {curso.Descripcion}</p>
      <p><strong>Duración:</strong> {curso.Duracion_Curso}</p>
      <p><strong>Fecha de Creación:</strong> {FechaCreacionAc}</p>
      {miniaturaUrl && <img src={miniaturaUrl} alt="Miniatura del curso" className="mt-4 rounded-lg shadow" />}
    
    </div>
  );
};

export default CourseInfo
