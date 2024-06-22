import React, { useState, useEffect } from "react";
import HeadersHome from "../common/HeadersHome";
import axios from "axios";

/**
 * Componente funcional para mostrar el perfil del usuario y los cursos creados por él.
 */
const MyProfile = () => {
  const [user, setUser] = useState(null); // Estado para almacenar los datos del usuario
  const [profilePicUrl, setProfilePicUrl] = useState(""); // Estado para la URL de la foto de perfil del usuario
  const [cursos, setCursos] = useState([]); // Estado para almacenar la lista de cursos creados por el usuario
  const [error, setError] = useState(""); // Estado para manejar errores

  /**
   * Efecto secundario para obtener los datos del perfil del usuario y los cursos creados por él.
   * Realiza las siguientes operaciones al montar el componente:
   * 1. Obtiene los datos del perfil del usuario mediante una solicitud GET a "http://localhost:5000/api/profile".
   * 2. Obtiene la foto de perfil del usuario mediante una solicitud GET a "http://localhost:5000/api/profile-pic".
   * 3. Obtiene la lista de cursos creados por el usuario mediante una solicitud GET a "http://localhost:5000/api/CursesInfo".
   * Maneja errores y actualiza el estado correspondiente en caso de éxito o fracaso.
   */
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Obtener datos del perfil del usuario
        const userProfileResponse = await axios.get(
          "http://localhost:5000/api/profile",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUser(userProfileResponse.data);

        // Obtener foto de perfil
        const profilePicResponse = await axios.get(
          "http://localhost:5000/api/profile-pic",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            responseType: "arraybuffer",
          }
        );
        const blob = new Blob([profilePicResponse.data], {
          type: "image/jpeg",
        });
        const imageUrl = URL.createObjectURL(blob);
        setProfilePicUrl(imageUrl);

        // Obtener lista de cursos creados por el usuario
        const cursosResponse = await axios.get(
          "http://localhost:5000/api/CursesInfo",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setCursos(cursosResponse.data);
        if (cursosResponse.data.length === 0) {
          setError("No hay cursos creados.");
        } else {
          setError("");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("No se pudieron cargar los datos del perfil y los cursos.");
      }
    };

    fetchProfileData();
  }, []); // La dependencia vacía [] asegura que este efecto se ejecute solo una vez al montar el componente.

  // Si los datos del usuario no se han cargado, muestra un mensaje de carga
  if (!user) return <div>Cargando datos...</div>;

  // Formatea la fecha de nacimiento del usuario
  const fechaNacimiento = new Date(user.Fecha_Nacimiento);
  const fechaFormateada = fechaNacimiento.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  // Renderiza el componente MyProfile con la estructura de la interfaz de usuario
  return (
    <div className="relative">
      <header className="z-50">
        <HeadersHome />
      </header>
      <div className="profile-content bg-gray-100 min-h-screen flex flex-col items-center py-10">
        <div className="bg-white shadow-lg rounded-lg max-w-4xl w-full p-8">
          <div className="flex items-center mb-8">
            {/* Muestra la foto de perfil del usuario */}
            <img
              src={profilePicUrl}
              alt="Profile"
              className="rounded-full border-4 border-white w-36 h-36"
            />
            <div className="ml-6">
              {/* Muestra el nombre completo y el rol del usuario */}
              <h2 className="text-4xl font-semibold text-gray-800">
                {user.Nombres} {user.Apellidos}
              </h2>
              <p className="text-gray-600 text-xl">
                {user.Nombre_Roll.toUpperCase()}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8">
            {/* Información personal del usuario */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Información Personal
              </h3>
              <div className="mb-4">
                <span className="text-gray-600 block">Correo Electrónico:</span>
                <span className="text-gray-800">{user.Correo_Electronico}</span>
              </div>
              <div className="mb-4">
                <span className="text-gray-600 block">
                  Fecha de Nacimiento:
                </span>
                <span className="text-gray-800">{fechaFormateada}</span>
              </div>
              <div className="mb-4">
                <span className="text-gray-600 block">Género:</span>
                <span className="text-gray-800">
                  {user.genero.toUpperCase()}
                </span>
              </div>
              <div className="mb-4">
                <span className="text-gray-600 block">Dirección:</span>
                <span className="text-gray-800">{user.Direccion}</span>
              </div>
              <div className="mb-4">
                <span className="text-gray-600 block">Nombre de Usuario:</span>
                <span className="text-gray-800">{user.Nombre_Usuario}</span>
              </div>
            </div>
            {/* Cursos creados por el usuario */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Cursos Creados por:{" "}
                <span className="text-gray-800">
                  {user.Nombre_Usuario.toLowerCase()}
                </span>
              </h3>
              {/* Muestra la lista de cursos o un mensaje de error si no hay cursos */}
              {error ? (
                <span className="text-red-500">{error}</span>
              ) : (
                <ul>
                  {cursos.map((curso) => (
                    <li key={curso.id} className="text-gray-800">
                      <span>✏️ {curso.Nombre_Curso}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
