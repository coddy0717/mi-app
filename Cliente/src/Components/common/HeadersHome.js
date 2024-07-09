import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const HeadersHome = ({ courseNames, facultyNames, setSearch, setFaculty }) => {
  const [showFaculties, setShowFaculties] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [user, setUser] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error al cargar los datos del usuario:", error);
      }
    };

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
      }
    };

    fetchUserData();
    fetchProfilePic();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/Logout");
      navigate("/Login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const navigateToMyProfile = () => {
    navigate("/ProfileCard");
  };

  const navigateToUploadCourse = () => {
    navigate("/UploadCourse");
  };

  const navigateToCursesCreated = () => {
    navigate("/CursesUserCreate");
  };
  const navigateToDashboard = () => {
    navigate("/Dashboard");
  };
  const navigateToCurses = () => {
    navigate("/CursosInscriptos");
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const closeProfileMenu = () => {
    setShowProfileMenu(false);
  };

  const handleFacultyChange = (e) => {
    setSelectedFaculty(e.target.value);
    setFaculty(e.target.value);
  };

  const isHomePage = location.pathname === "/Home";

  return (
    <nav
      className={`bg-blue-950 p-4 flex items-center justify-between ${
        isHomePage ? "shadow-lg" : ""
      } flex-wrap space-y-4 sm:space-y-0`}
    >
      <div className="text-white font-bold text-2xl">
        <button onClick={() => navigate(-1)}>ECUNEMI</button>
      </div>
      <div className="flex-1 flex items-center justify-center w-full sm:w-auto mt-4 sm:mt-0">
        {isHomePage && (
          <>
            <input
              type="text"
              list="courseNames"
              placeholder="Buscar"
              className="p-2 rounded-lg border border-gray-300 w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setSearch(e.target.value)}
            />
            <datalist id="courseNames">
              {courseNames &&
                courseNames.map((courseName) => (
                  <option key={courseName} value={courseName} />
                ))}
            </datalist>
          </>
        )}
      </div>
      {isHomePage && (
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <button
            onClick={() => setShowFaculties(!showFaculties)}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out"
          >
            Filtros
          </button>
          {showFaculties && (
            <select
              className="p-2 rounded-lg border border-gray-300"
              value={selectedFaculty}
              onChange={handleFacultyChange}
            >
              <option value="">Todas las Facultades</option>
              {facultyNames &&
                facultyNames.map((facultyName) => (
                  <option key={facultyName} value={facultyName}>
                    {facultyName}
                  </option>
                ))}
            </select>
          )}
        </div>
      )}
      <div className="flex items-center mt-4 sm:mt-0 sm:ml-4">
        <button
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out"
          onClick={navigateToUploadCourse}
        >
          📤 Subir Curso
        </button>
      </div>
      <div className="relative mt-4 sm:mt-0 sm:ml-4">
        <button onClick={toggleProfileMenu}>
          <img
            src={profilePicUrl}
            alt="Perfil"
            className="rounded-full w-10 h-10 border-2 border-white"
          />
        </button>
        {showProfileMenu && (
          <div
            className="absolute right-0 mt-2 bg-blue-950 w-56 rounded-lg shadow-xl"
            onBlur={closeProfileMenu}
          >
            <div className="py-2 text-white">
              <div className="px-4 py-2">
                Usuario:{" "}
                <span className="font-bold">{user && user.Nombre_Usuario}</span>
              </div>
              <div className="px-4 py-2">
                Correo Electrónico:{" "}
                <span className="font-bold">
                  {user && user.Correo_Electronico}
                </span>
              </div>
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
                onClick={navigateToCurses}
                className="block w-full text-left py-2 px-4 text-sm text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-orange-500"
                role="menuitem"
              >
                Cursos Inscritos
              </button>
              <button
                onClick={navigateToDashboard}
                className="block w-full text-left py-2 px-4 text-sm text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-orange-500"
                role="menuitem"
              >
                Dashboard
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
    </nav>
  );
};

export default HeadersHome;
