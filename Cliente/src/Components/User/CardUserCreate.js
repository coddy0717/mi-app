import React, { useState, useEffect } from "react";
import axios from "axios";
import HeadersHome from "../common/HeadersHome";
import Tarjeta from "../common/Tarjeta";
import Notification from "../common/Notification";

/**
 * Componente funcional para mostrar la lista de cursos creados por el usuario.
 * Muestra tarjetas de curso y maneja errores y mensajes de éxito.
 */
const Cursos = () => {
  const [cursos, setCursos] = useState([]); // Estado para almacenar la lista de cursos
  const [profilePicUrl, setProfilePicUrl] = useState(""); // Estado para la URL de la foto de perfil del usuario
  const [error, setError] = useState(""); // Estado para manejar errores
  const [successMessage, setSuccessMessage] = useState(""); // Estado para el mensaje de éxito

  /**
   * Efecto secundario para cargar la lista de cursos y la foto de perfil del usuario al montar el componente.
   */
  useEffect(() => {
    /**
     * Función asincrónica para obtener la lista de cursos creados por el usuario.
     * Realiza una solicitud GET al endpoint "http://localhost:5000/api/CursesInfo" del servidor.
     * Actualiza el estado `cursos` con la respuesta del servidor.
     * Maneja errores y establece el mensaje de error si no hay cursos creados.
     */
    const fetchCursos = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/CursesInfo",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setCursos(response.data);
        if (response.data.length === 0) {
          setError("No hay cursos creados.");
        } else {
          setError("");
        }
      } catch (error) {
        console.error("Error al obtener cursos:", error);
        setError("Error al obtener cursos. Inténtelo de nuevo más tarde.");
      }
    };

    /**
     * Función asincrónica para obtener la foto de perfil del usuario.
     * Realiza una solicitud GET al endpoint "http://localhost:5000/api/profile-pic" del servidor.
     * La foto de perfil se carga como un objeto Blob y se convierte en una URL para ser mostrada en la interfaz.
     * Maneja errores y muestra un mensaje de error si no se puede cargar la foto de perfil.
     */
    const fetchProfilePic = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/profile-pic",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            responseType: "arraybuffer",
          }
        );
        const blob = new Blob([response.data], { type: "image/jpeg" });
        const imageUrl = URL.createObjectURL(blob);
        setProfilePicUrl(imageUrl);
      } catch (error) {
        console.error("Error al cargar la foto de perfil:", error);
        setError(
          "Error al cargar la foto de perfil. Inténtelo de nuevo más tarde."
        );
      }
    };

    // Llama a las funciones para obtener la lista de cursos y la foto de perfil al montar el componente.
    fetchCursos();
    fetchProfilePic();
  }, []); // La dependencia vacía [] asegura que este efecto se ejecute solo una vez al montar el componente.

  /**
   * Renderiza el componente Cursos con la estructura de la interfaz y las tarjetas de cursos.
   */
  return (
    <div className="bg-gray-100 min-h-screen">
      <HeadersHome />

      <div className="mx-auto p-6">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
          Cursos Creados
        </h1>
        {/* Componente de Notificación para informar sobre los cursos creados */}
        <Notification
          texto="Aquí se encuentran los cursos creados que aún no están
                publicados. La parte visual está configurada, pero falta el
                contenido educativo. Si deseas publicar tus cursos, haz clic en
                Editar Curso. Para eliminarlo, haz clic en Borrar Curso"
        />
        {/* Manejo de errores y mensajes de éxito */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {successMessage}
          </div>
        )}{" "}
        {/* Tarjetas de cursos */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Mapeo de la lista de cursos para renderizar cada tarjeta de curso */}
          {cursos.map((curso) => (
            <div key={curso.Id_Curso} className="mb-8">
              <Tarjeta
                // Propiedades de la tarjeta de curso
                imagen={`data:image/png;base64,${curso.Miniatura}`}
                titulo={curso.Nombre_Curso}
                descripcion={curso.Descripcion}
                Duracion_Curso={curso.Duracion_Curso}
                fechaCreacion={new Date(
                  curso.Fecha_Creacion
                ).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
                autor={curso.Nombre_Usuario}
                imagenAutor={profilePicUrl}
                carrera={curso.Nombre_Carrera}
                facultad={curso.Nombre_Facultad}
                asignatura={curso.Nombre_Categoria}
                cursoId={curso.Id_Curso}
                setCursos={setCursos} // Función para actualizar la lista de cursos
                setSuccessMessage={setSuccessMessage} // Función para mostrar mensajes de éxito
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cursos;
