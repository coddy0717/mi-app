import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

/**
 * Componente funcional para mostrar una tarjeta de curso con opciones de eliminar y editar.
 * Utiliza un modal para confirmar la eliminación del curso.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {string} props.imagen - URL de la imagen del curso.
 * @param {string} props.titulo - Título del curso.
 * @param {string} props.descripcion - Descripción del curso.
 * @param {string} props.fechaCreacion - Fecha de creación del curso.
 * @param {string} props.autor - Nombre del autor del curso.
 * @param {string} props.imagenAutor - URL de la imagen del autor del curso.
 * @param {string} props.carrera - Nombre de la carrera del curso.
 * @param {string} props.facultad - Nombre de la facultad del curso.
 * @param {string} props.asignatura - Nombre de la asignatura del curso.
 * @param {string} props.Duracion_Curso - Duración del curso.
 * @param {number} props.cursoId - ID único del curso.
 * @param {function} props.setCursos - Función para actualizar la lista de cursos después de eliminar uno.
 * @param {function} props.setSuccessMessage - Función para establecer un mensaje de éxito.
 */
const Tarjeta = ({
  imagen,
  titulo,
  descripcion,
  fechaCreacion,
  autor,
  imagenAutor,
  carrera,
  facultad,
  asignatura,
  Duracion_Curso,
  setCursos,
  setSuccessMessage,
  cursoId, // Asegurar que cursoId se recibe correctamente
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar la visibilidad del modal
  const navigate = useNavigate(); // Hook de react-router para navegar entre rutas

  /**
   * Función para alternar la visibilidad del modal.
   */
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  /**
   * Función para eliminar el curso haciendo una solicitud DELETE al servidor.
   * Actualiza la lista de cursos y muestra un mensaje de éxito.
   */
  const deleteCurso = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/DeleteCurso/${cursoId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Actualiza la lista de cursos eliminando el curso actual
      setCursos((prevCursos) =>
        prevCursos.filter((curso) => curso.Id_Curso !== cursoId)
      );

      // Muestra un mensaje de éxito temporal
      setSuccessMessage("Curso eliminado exitosamente");
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000); // Oculta el mensaje de éxito después de 3 segundos
    } catch (error) {
      console.error("Error al eliminar el curso:", error);
      // Aquí podrías manejar el error mostrando un mensaje al usuario si es necesario
    }

    toggleModal(); // Cierra el modal después de eliminar el curso
  };

  /**
   * Función para navegar a la página de edición del curso.
   */
  const EditCurso = () => {
    navigate(`/EditCurse/${cursoId}`);
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
              src={imagenAutor}
              alt={autor}
            />
            <div>
              <p className="text-gray-800 font-semibold">Autor: {autor}</p>
              <p className="text-gray-600 text-sm">
                Fecha de Creación: {fechaCreacion}
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
          <button
            type="button"
            className="text-white text-center bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 mx-2 mb-2 dark:bg-red-900 dark:hover:bg-red-700 dark:focus:ring-red-800"
            onClick={toggleModal}
          >
            Borrar Curso
          </button>

          <button
            type="button"
            className="text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 font-medium rounded-full text-sm px-5 py-2.5 mx-2 mb-2 dark:focus:ring-yellow-900"
            onClick={EditCurso}
          >
            Editar Curso
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div
          id="popup-modal"
          tabIndex="-1"
          className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50"
        >
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-red-500">
              <button
                type="button"
                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={toggleModal}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 1 13 13M13 1 1 13"
                  />
                </svg>
                <span className="sr-only">Cerrar modal</span>
              </button>
              <div className="p-4 md:p-5 text-center">
                <svg
                  className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                <h3 className="mb-5 text-lg font-normal text-white">
                  ¿Estás seguro/a de eliminar este curso?
                </h3>
                <button
                  type="button"
                  className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-900 dark:hover:bg-red-700 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                  onClick={deleteCurso}
                >
                  Sí, estoy seguro/a
                </button>
                <button
                  type="button"
                  className="py-2.5 px-5 ml-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-gray-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-blue-700 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  onClick={toggleModal}
                >
                  No, cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tarjeta;
