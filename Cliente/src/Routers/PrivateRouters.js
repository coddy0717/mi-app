import React from "react";
import { Navigate, useLocation } from "react-router-dom";

/**
 * Componente para manejar rutas privadas.
 * Redirige a la página de inicio de sesión si el usuario no está autenticado.
 * @param {Object} children - Componente hijo que se renderizará si el usuario está autenticado.
 * @returns {JSX.Element} Componente Navigate que redirige a la página de inicio de sesión si no está autenticado.
 */
export const PrivateRoute = ({ children }) => {
  const { state } = useLocation(); // Obtiene el estado de la ubicación actual

  // Verifica si el usuario está autenticado según el estado pasado por la ubicación
  return state?.logged ? children : <Navigate to="/Login" />; // Renderiza los hijos si está autenticado, o redirige a /Login si no lo está
};

export default PrivateRoute;
