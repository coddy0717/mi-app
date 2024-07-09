import React, { useState, useEffect } from "react";
import axios from "axios";

const TarjetaAll = ({
  imagen,
  titulo,
  descripcion,
  fechaCreacion,
  autor,
  rol,
  Foto_Perfil,
  carrera,
  facultad,
  asignatura,
  setSuccessMessage,
  Duracion_Curso,
  Numero_Inscritos,
  cursoId, // Asegurar que cursoId se recibe correctamente
}) => {
  const [yaInscrito, setYaInscrito] = useState(false);

  useEffect(() => {
    const verificarInscripcion = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/verificarInscripcion/${cursoId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.inscrito) {
          setYaInscrito(true);
          localStorage.setItem(`inscrito_${cursoId}`, "true"); // Almacena la inscripción en localStorage
        }
      } catch (error) {
        console.error("Error al verificar la inscripción:", error);
      }
    };

    // Verificar si hay datos de inscripción en localStorage
    const inscrito = localStorage.getItem(`inscrito_${cursoId}`);
    if (inscrito) {
      setYaInscrito(true);
    } else {
      verificarInscripcion();
    }
  }, [cursoId]);

  const handleInscripcion = async () => {
    try {
      // Verificar si ya está inscrito
      if (yaInscrito) {
        setSuccessMessage("Ya estás inscrito en este curso.");
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
        return;
      }

      // Realizar la solicitud de inscripción
      const response = await axios.post(
        "http://localhost:5000/api/inscripcion",
        { cursoId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSuccessMessage(response.data.message);
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

      // Marcar como inscrito y almacenar en localStorage
      setYaInscrito(true);
      localStorage.setItem(`inscrito_${cursoId}`, "true");
    } catch (error) {
      console.error("Error en la inscripción:", error);
      setSuccessMessage("Error al inscribirse. Inténtelo de nuevo más tarde.");
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    }
  };

  const handleVerCurso = () => {
    // Lógica para redirigir o mostrar el curso
    console.log("Ver curso", cursoId);
  };

  return (
    <div>
      <div className="max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <img className="w-full h-48 object-cover" src={imagen} alt={titulo} />
        <div className="p-4">
          <h2 className="text-xl font-bold mb-2">{titulo}</h2>
          <p className="text-orange-700 mb-4">
            Duración del Curso:{" "}
            {Duracion_Curso.replace(/\b\w/g, (l) => l.toUpperCase())}
          </p>
          <p className="text-blue-700 mb-4">{descripcion}</p>
          <div className="flex items-center mb-4">
            <img
              className="w-10 h-10 object-cover rounded-full mr-4"
              src={Foto_Perfil}
              alt={autor}
            />
            <div>
              <p className="text-gray-800 font-semibold">Autor: {autor}</p>
              <p className="text-red-600 font-semibold">
                {rol.replace(/\b\w/g, (l) => l.toUpperCase())}
              </p>
              <p className="text-gray-600 text-sm">
                Fecha de Creación: {fechaCreacion}
              </p>
              <p className="text-gray-600 text-sm">
                Número de Inscriptos: {Numero_Inscritos}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
              {carrera}
            </span>

            <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
              {facultad}
            </span>
            <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded">
              {asignatura}
            </span>
          </div>
        </div>
        <div className="flex justify-center mb-4">
          {yaInscrito ? (
            <button
              type="button"
              className="text-white flex flex-col items-center bg-blue-400 hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 mx-2 mb-2 dark:focus:ring-blue-900"
              onClick={handleVerCurso}
            >
              Ver Curso
            </button>
          ) : (
            <button
              type="button"
              className="text-white flex flex-col items-center bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 font-medium rounded-full text-sm px-5 py-2.5 mx-2 mb-2 dark:focus:ring-yellow-900"
              onClick={handleInscripcion}
            >
              Inscribirse
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TarjetaAll;
