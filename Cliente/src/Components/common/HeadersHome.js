import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importa hook useNavigate para navegación
import axios from "axios"; // Importa axios para realizar solicitudes HTTP

/**
 * Componente funcional que representa el encabezado de la página principal.
 * Este componente incluye opciones de navegación, búsqueda, filtros y menú de perfil de usuario.
 */
const HeadersHome = () => {
  const [showFaculties, setShowFaculties] = useState(false); // Estado para mostrar/ocultar los filtros de facultades
  const [showProfileMenu, setShowProfileMenu] = useState(false); // Estado para mostrar/ocultar el menú de perfil de usuario
  const [user, setUser] = useState(null); // Estado para almacenar los datos del usuario
  const [profilePicUrl, setProfilePicUrl] = useState(""); // Estado para la URL de la foto de perfil
  const navigate = useNavigate(); // Hook useNavigate para la navegación dentro de la aplicación

  useEffect(() => {
    // Función para cargar los datos del usuario al cargar el componente
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, // Envía el token de autorización en el encabezado
        });
        setUser(response.data); // Almacena los datos del usuario en el estado
      } catch (error) {
        console.error("Error al cargar los datos del usuario:", error);
      }
    };

    // Función para cargar la foto de perfil del usuario
    const fetchProfilePic = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/profile-pic",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Envía el token de autorización en el encabezado
            },
            responseType: "arraybuffer", // Importante para recibir datos binarios
          }
        );
        const blob = new Blob([response.data], { type: "image/jpeg" });
        const imageUrl = URL.createObjectURL(blob);
        setProfilePicUrl(imageUrl); // Almacena la URL de la foto de perfil en el estado
      } catch (error) {
        console.error("Error al cargar la foto de perfil:", error);
      }
    };

    fetchUserData(); // Llama a la función para cargar los datos del usuario
    fetchProfilePic(); // Llama a la función para cargar la foto de perfil del usuario
  }, []);

  // Función para manejar el evento de cerrar sesión del usuario
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/Logout"); // Realiza una solicitud POST para cerrar sesión

      // Redirige al usuario a la página de inicio de sesión después de cerrar sesión
      navigate("/Login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  // Función para navegar a la página de perfil del usuario
  const navigateToMyProfile = () => {
    navigate("/ProfileCard");
  };

  // Función para navegar a la página de subida de cursos
  const navigateToUploadCourse = () => {
    navigate("/UploadCourse");
  };

  // Función para navegar a la página de cursos creados por el usuario
  const navigateToCursesCreated = () => {
    navigate("/CursesUserCreate");
  };

  // Función para alternar la visibilidad del menú de perfil de usuario
  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  // Función para cerrar el menú de perfil de usuario
  const closeProfileMenu = () => {
    setShowProfileMenu(false);
  };

  return (
    <nav className="bg-blue-950 p-4 flex items-center justify-between shadow-lg flex-wrap">
      <div className="text-white font-bold text-2xl">
        {/* Botón para navegar hacia atrás en la historia de navegación */}
        <button onClick={() => navigate(-1)}>ECUNEMI</button>
      </div>
      <div className="flex-1 mx-4 flex items-center w-full sm:w-auto mt-4 sm:mt-0">
        {/* Input de búsqueda y botón para mostrar/ocultar filtros de facultades */}
        <input
          type="text"
          placeholder="Buscar"
          className="p-2 rounded-lg border border-gray-300 w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="relative ml-4 mt-4 sm:mt-0">
          <button
            onClick={() => setShowFaculties(!showFaculties)}
            className="relative p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out"
          >
            Filtros
          </button>
          {/* Lista de filtros de facultades (mostrada si showFaculties es true) */}
          {showFaculties && (
            <div className="absolute mt-2 bg-white rounded-lg shadow-lg w-48">
              <div className="py-2">
                <div className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                  Ingeniería
                </div>
                <div className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                  Medicina
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center mt-4 sm:mt-0">
        {/* Botón para navegar a la página de subida de curso */}
        <button
          className="mr-4 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out"
          onClick={navigateToUploadCourse}
        >
          📤 Subir Curso
        </button>
        <div className="relative">
          {/* Botón para mostrar/ocultar el menú de perfil de usuario */}
          <button onClick={toggleProfileMenu}>
            {/* Imagen de perfil del usuario */}
            <img
              src={profilePicUrl}
              alt="Perfil"
              className="rounded-full w-10 h-10 border-2 border-white"
            />
          </button>
          {/* Menú de perfil de usuario (mostrado si showProfileMenu es true) */}
          {showProfileMenu && (
            <div
              className="absolute right-0 mt-2 bg-blue-950 w-70 rounded-lg shadow-xl"
              onBlur={closeProfileMenu}
            >
              <div className="py-2 text-white">
                {/* Información del usuario */}
                <div className="px-4 py-2">
                  Usuario:{" "}
                  <span className="font-bold">
                    {user && user.Nombre_Usuario}
                  </span>
                </div>
                <div className="px-4 py-2">
                  Correo Electrónico:{" "}
                  <span className="font-bold">
                    {user && user.Correo_Electronico}
                  </span>
                </div>
                {/* Opciones del menú de perfil */}
                <button
                  onClick={navigateToMyProfile}
                  className="block w-full text-left py-2 px-4 text-sm text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-orange-500"
                  role="menuitem"
                >
                  Mi perfil
                </button>
                <button
                  onClick={navigateToCursesCreated}
                  className="block w-full text-left py-2 px-4 text-sm text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-orange-500"
                  role="menuitem"
                >
                  Cursos Creados
                </button>
                <button
                  onClick={navigateToCursesCreated}
                  className="block w-full text-left py-2 px-4 text-sm text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-orange-500"
                  role="menuitem"
                >
                  Cursos Inscritos
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-2 px-4 text-sm text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-orange-500"
                  role="menuitem"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default HeadersHome;
