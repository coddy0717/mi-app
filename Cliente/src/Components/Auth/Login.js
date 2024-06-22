import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../common/Header";
import Title from "../common/Title";

const Login = () => {
  // Estado para almacenar el correo electrónico y la contraseña del usuario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Estado para manejar los errores de inicio de sesión
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Función para manejar el envío del formulario de inicio de sesión
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post("http://localhost:5000/api/Login", {
        Correo_Electronico: email,
        Contrasena: password,
      });

      if (response.data.message === "Sesión iniciada correctamente") {
        localStorage.setItem("token", response.data.token);
        navigate("/Home", {
          replace: true,
          state: {
            logged: true,
          },
        });
        console.log(response.data.user); // Log the user's name if it's available in the response
      }
    } catch (error) {
      // Manejar errores de respuesta de la solicitud
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        setError("Error al iniciar sesión. Por favor, inténtalo de nuevo.");
      }
    }
  };

  return (
    <div>
      <Header />
      <Title />
      <div className="flex items-start justify-center min-h-screen bg-gray-100 pt-25">
        <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-6 text-blue-600">
            Iniciar Sesión
          </h2>
          {/* Mostrar mensaje de error si existe */}
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit}>
            {/* Campo para el correo electrónico */}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {/* Campo para la contraseña */}
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {/* Botón para iniciar sesión */}
            <div className="flex justify-center mb-4">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Iniciar Sesión
              </button>
            </div>
          </form>
          {/* Enlace para registrarse si no tiene una cuenta */}
          <div className="flex justify-center mb-4">
            <Link
              to="/Register"
              className="text-orange-600 hover:text-orange-800"
            >
              ¿No tienes cuenta? Registrarse
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
