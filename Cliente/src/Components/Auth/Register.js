import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Header from "../common/Header";
import Title from "../common/Title";

const Register = () => {
  // Estados para almacenar los datos del formulario y los mensajes de error
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nameError, setNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [userName, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [address, setAddress] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [role, setRole] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [formSubmitError, setFormSubmitError] = useState("");

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
    const errors = [];

    // Validación del correo electrónico
    setEmailError(
      email.endsWith("@unemi.edu.ec")
        ? ""
        : "El correo debe terminar con @unemi.edu.ec."
    );

    // Validación de la contraseña
    if (password !== confirmPassword) {
      errors.push("Las contraseñas no coinciden.");
    }

    if (password.length < 6) {
      errors.push("La contraseña debe tener al menos 6 caracteres.");
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("La contraseña debe contener al menos un caracter especial.");
    }

    // Actualización del estado de errores de contraseña
    setPasswordError(errors.join(", "));

    // Determinar si el formulario es válido
    setIsFormValid(errors.length === 0 && email.endsWith("@unemi.edu.ec"));
  }, [email, password, confirmPassword]);

  // Manejar el envío del formulario
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isFormValid) {
      const formData = new FormData();
      formData.append("Nombres", name.toUpperCase());
      formData.append("Apellidos", lastName.toUpperCase());
      formData.append("Correo_Electronico", email);
      formData.append("Contrasena", password);
      formData.append("Nombre_Usuario", userName.toUpperCase());
      formData.append("Direccion", address.toUpperCase());
      formData.append("Fecha_Nacimiento", birthDate);
      formData.append("genero", gender);
      formData.append("Foto_Perfil", profilePicture); // Añadir el archivo de imagen
      formData.append("Nombre_Roll", role); // Enviar el rol como Nombre_Roll

      try {
        const response = await axios.post(
          "http://localhost:5000/api/Register",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("Formulario enviado con éxito", response.data);
        setShowSuccessMessage(true);
        setFormSubmitError(""); // Resetear el error de envío del formulario en caso de éxito
      } catch (error) {
        console.error("Error al enviar el formulario:", error);
        if (error.response && error.response.data) {
          setFormSubmitError(
            error.response.data.message || "Error al enviar el formulario"
          );
          if (
            error.response.data.message ===
            "El correo electrónico ya está registrado"
          ) {
            setEmailError("El correo electrónico ya está registrado");
          } else if (
            error.response.data.message ===
            "El nombre de usuario ya está registrado"
          ) {
            setUsernameError("El nombre de usuario ya está registrado");
          }
        } else {
          setFormSubmitError("Error al enviar el formulario");
        }
      }
    }
  };

  // Función para evitar la entrada de espacios en los campos de texto
  const handleKeyDown = (event) => {
    if (event.key === " ") {
      event.preventDefault();
    }
  };

  return (
    <div>
      <Header />
      <Title />

      <div className="flex items-start justify-center min-h-screen bg-gray-100 pt-25">
        <div className="bg-white p-10 rounded shadow-md w-full max-w-lg">
          <h2 className="text-3xl font-bold mb-8 text-orange-600 text-center">
            Registrarse
          </h2>
          <form className="w-full max-w-lg" onSubmit={handleSubmit}>
            {/* Campos de nombre y apellidos */}
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

            {/* Campos de nombre de usuario y dirección */}
            <div className="grid grid-cols-2 flex-wrap -mx-3 mb-6">
              <div className="px-3">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="userName"
                >
                  Nombre de Usuario
                </label>
                <input
                  className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
                    usernameError ? "border-red-500" : "border-gray-200"
                  } rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                  id="userName"
                  type="text"
                  placeholder="Nombre de Usuario"
                  value={userName}
                  onChange={(e) => setUsername(e.target.value)}
                />
                {usernameError && (
                  <p className="text-red-500 text-xs italic">{usernameError}</p>
                )}
              </div>
              <div className="px-3">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="address"
                >
                  Dirección
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  id="address"
                  type="text"
                  placeholder="Dirección"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>

            {/* Campos de fecha de nacimiento y género */}
            <div className="grid grid-cols-2 flex-wrap -mx-3 mb-6">
              <div className="px-3">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="birthDate"
                >
                  Fecha de Nacimiento
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                />
              </div>
              <div className="px-3">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="gender"
                >
                  Selecione su Género
                </label>
                <select
                  className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option>Seleccione una opción</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
            </div>

            {/* Campo de correo electrónico */}
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

            {/* Campo de rol */}
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full px-3">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="role"
                >
                  Rol
                </label>
                <select
                  className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option>Seleccione una opción</option>
                  <option value="docente">Docente</option>
                  <option value="estudiante">Estudiante</option>
                </select>
              </div>
            </div>

            {/* Campos de contraseña y repetir contraseña */}
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

            {/* Campo de foto de perfil */}
            <div className="grid grid-cols-1 gap-4 mb-6">
              <div>
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="profilePicture"
                >
                  Foto de Perfil
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  id="profilePicture"
                  type="file"
                  onChange={(e) => setProfilePicture(e.target.files[0])}
                />
              </div>
            </div>

            {/* Mensaje de error del formulario */}
            {formSubmitError && (
              <div style={{ color: "red" }}>{formSubmitError}</div>
            )}

            {/* Botón de registro */}
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

          {/* Mensaje de éxito */}
          {showSuccessMessage && (
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6"
              role="alert"
            >
              <strong className="font-bold">
                Usuario creado con éxito ✔️ Inicie Sesión
              </strong>
            </div>
          )}
          {/* Enlace para iniciar sesión si ya tiene cuenta */}
          <div className="mt-4 text-center">
            <Link to="/Login" className="text-blue-600 hover:text-blue-800">
              ¿Ya tienes cuenta? Iniciar Sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
