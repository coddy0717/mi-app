import React from "react";
import { useNavigate } from "react-router-dom";
import "../Style/Style.css";

const Header = () => {
  // Usar useNavigate para navegar entre rutas
  let navigate = useNavigate();

  // Función para redirigir a la página de inicio de sesión
  function Login() {
    navigate("/Login");
  }

  // Función para redirigir a la página de registro
  function Register() {
    navigate("/Register");
  }

  return (
    <header className="bg-blue-900 text-white text-right">
      {/* Contenedor del encabezado */}
      <div className="mx-auto flex justify-between items-center p-4">
        {/* Logo de la aplicación */}
        <div className="flex items-center">
          <h1 className="text-2xl font-bold flex">ECUNEMI</h1>
        </div>
        {/* Navegación y botones */}
        <nav className="flex items-center space-x-4">
          {/* Botón para iniciar sesión */}
          <button
            onClick={Login}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          >
            Iniciar Sesión
          </button>

          {/* Botón para registrarse */}
          <button
            onClick={Register}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-full"
          >
            Registrate
          </button>
        </nav>
      </div>
      {/* Animación de cubos */}
      <div className="cube-container">
        {/* Crear 10 cubos */}
        {[...Array(10)].map((_, index) => (
          <div key={index} className="cube"></div>
        ))}
      </div>
    </header>
  );
};

export default Header;
