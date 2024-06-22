import React, { useState } from "react";

/**
 * Componente funcional para mostrar una notificación con un ícono y un mensaje.
 * Permite al usuario cerrar la notificación haciendo clic en un botón.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {string} props.texto - Texto que se muestra dentro de la notificación.
 */
const Notification = ({ texto }) => {
  const [showNotification, setShowNotification] = useState(true); // Estado para controlar la visibilidad de la notificación

  /**
   * Maneja el evento de clic en el botón para cerrar la notificación.
   */
  const handleCloseNotification = () => {
    setShowNotification(false); // Oculta la notificación al hacer clic en el botón de cerrar
  };

  return (
    <div>
      {showNotification && ( // Renderiza la notificación solo si showNotification es true
        <div className="px-8 py-6 bg-blue-900 text-white flex justify-between rounded">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 mr-6"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            <p>{texto}</p>{" "}
            {/* Muestra el texto de la notificación pasado como prop */}
          </div>
          <button
            className="text-blue-100 hover:text-white"
            onClick={handleCloseNotification} // Maneja el clic en el botón de cerrar notificación
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default Notification;
