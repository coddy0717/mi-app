const express = require("express"); // Importa el módulo Express para crear la aplicación web
const db = require("../Database/Db"); // Importa el módulo de conexión a la base de datos (Db.js)

const router = express.Router(); // Crea un enrutador de Express para manejar rutas específicas

// Ruta POST "/Logout" para cerrar sesión
router.post("/Logout", (req, res) => {
  // Función de manejo de la solicitud POST para cerrar sesión

  // Destruir la sesión del usuario
  req.session.destroy((err) => {
    // Callback ejecutado después de intentar destruir la sesión

    if (err) {
      // Si ocurre un error al destruir la sesión
      console.error("Error al cerrar sesión:", err);
      return res.status(500).json({ message: "Error al cerrar sesión" });
      // Responde con un estado 500 (error interno del servidor) y un mensaje de error JSON
    }

    // Si la sesión se destruye correctamente
    res.json({ message: "Sesión cerrada correctamente" });
    // Responde con un estado 200 (éxito) y un mensaje JSON indicando que la sesión se cerró correctamente
  });
});

module.exports = router; // Exporta el enrutador de Express para ser utilizado en otras partes de la aplicación
