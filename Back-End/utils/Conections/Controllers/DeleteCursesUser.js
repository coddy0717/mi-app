// Importación de módulos y configuración inicial
const db = require("../Database/Db"); // Importa la configuración de la base de datos
const express = require("express");
const verifyToken = require("../Token/JWT"); // Middleware para verificar el token JWT
const router = express.Router(); // Crea un enrutador de Express

// Ruta para Borrar información del curso
router.delete("/DeleteCurso/:cursoId", verifyToken, async (req, res) => {
  const { userId } = req; // Obtiene el userId del token verificado, que se almacena en el middleware verifyToken
  const { cursoId } = req.params; // Obtiene el cursoId de los parámetros de la URL

  try {
    // Verificar que el curso pertenece al usuario
    const [results] = await db.promise().query(
      `
      SELECT
        curso.Id_Curso
      FROM
        curso
      WHERE
        curso.Id_Curso = ? AND curso.Id_Usuario = ?`,
      [cursoId, userId]
    );

    // Si no se encuentra ningún curso para este usuario o no existe
    if (results.length === 0) {
      return res.status(404).json({
        message: "No se encontró el curso para este usuario o no existe",
      });
    }

    // Eliminar el curso de la base de datos
    await db.promise().query(
      `
      DELETE FROM curso
      WHERE Id_Curso = ? AND Id_Usuario = ?`,
      [cursoId, userId]
    );

    // Respuesta exitosa cuando se elimina el curso correctamente
    return res.status(200).json({ message: "Curso eliminado exitosamente" });
  } catch (error) {
    console.error("Error en la consulta:", error);
    // Si hay un error al procesar la solicitud, devuelve un mensaje de error
    return res.status(500).json({ message: "Error al procesar la solicitud" });
  }
});

module.exports = router; // Exporta el enrutador para usarlo en otras partes de la aplicación
