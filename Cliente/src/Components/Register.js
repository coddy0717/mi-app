import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Register = () => {
  // Estados para almacenar los datos del formulario y los mensajes de error
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nameError, setNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");

  // Validación del nombre y apellido
  useEffect(() => {
    const regex = /^[A-Za-záéíóúÁÉÍÓÚñÑ ]*$/;
    setNameError(regex.test(name) ? "" : "Por favor, ingresa solo letras.");
    setLastNameError(
      regex.test(lastName) ? "" : "Por favor, ingresa solo letras."
    );
  }, [name, lastName]);

  // Validación del correo electrónico y contraseña
  useEffect(() => {
    const errores = [];
    setEmailError(
      email.endsWith("@unemi.edu.ec")
        ? ""
        : "El correo debe terminar con @unemi.edu.ec."
    );
    setPasswordError(
      password === confirmPassword ? "" : "Las contraseñas no son iguales."
    );
    if (!email.endsWith("@unemi.edu.ec")) errores.push("correo");
    if (password !== confirmPassword) errores.push("contraseña");
    setIsFormValid(errores.length === 0);
  }, [email, password, confirmPassword]);

  // Maneja el envío del formulario
  const manejarEnvio = async (evento) => {
    evento.preventDefault();
    if (isFormValid) {
      const datos = {
        Nombres: name.toUpperCase(),
        Apellidos: lastName.toUpperCase(),
        Correo_Electronico: email,
        Contrasena: password,
      };

      try {
        const respuesta = await axios.post(
          "http://localhost:5000/api/Register",
          datos
        );
        console.log("Formulario enviado con éxito", respuesta.data);
      } catch (error) {
        console.error("Error al enviar el formulario:", error);
      }
    }
  };

  // Evita la entrada de espacios en los campos de texto
  const handleKeyDown = (e) => {
    if (e.key === " ") {
      e.preventDefault();
    }
  };
  return (
    <div className="flex items-start justify-center min-h-screen bg-gray-100 pt-25">
      <div className="bg-white p-10 rounded shadow-md w-full max-w-lg">
        <h2 className="text-3xl font-bold mb-8 text-orange-600 text-center">
          Registrarse
        </h2>
        <form className="w-full max-w-lg" onSubmit={manejarEnvio}>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="name"
              >
                Escriba sus Nombres
              </label>
              <input
                className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
                  nameError ? "border-red-500" : "border-gray-200"
                } rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                id="name"
                type="text"
                placeholder="Nombres"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {nameError && (
                <p className="text-red-500 text-xs italic">{nameError}</p>
              )}
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="lastName"
              >
                Escriba sus Apellidos
              </label>
              <input
                className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
                  lastNameError ? "border-red-500" : "border-gray-200"
                } rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white`}
                id="lastName"
                type="text"
                placeholder="Apellidos"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              {lastNameError && (
                <p className="text-red-500 text-xs italic">{lastNameError}</p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="email"
              >
                Ingrese su Correo Institucional
              </label>
              <input
                className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
                  emailError ? "border-red-500" : "border-gray-200"
                } rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                id="email"
                type="email"
                placeholder="Correo Institucional"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && (
                <p className="text-red-500 text-xs italic">{emailError}</p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="password"
              >
                Ingrese su Contraseña
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="password"
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="confirmPassword"
              >
                Repita su Contraseña
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="confirmPassword"
                type="password"
                placeholder="Repita su Contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              {passwordError && (
                <p className="text-red-500 text-xs italic">{passwordError}</p>
              )}
            </div>
          </div>
          <div className="flex justify-center mb-4">
            <button
              type="submit"
              disabled={!isFormValid}
              className={`bg-orange-600 ${
                !isFormValid
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-orange-700"
              } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
            >
              Registrarse
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <Link to="/Login" className="text-blue-600 hover:text-blue-800">
            ¿Ya tienes cuenta? Iniciar Sesión
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Register;
