const express = require("express");
const router = express.Router();
const db = require("../Database/Db"); // Módulo de conexión a la base de datos
const verifyToken = require("../Token/JWT"); // Middleware para verificar tokens JWT

// Ruta POST "/inscripcion" para realizar la inscripción en un curso
router.post("/inscripcion", verifyToken, async (req, res) => {
  const { cursoId } = req.body; // Obtener cursoId del cuerpo de la solicitud
  const userId = req.userId; // Obtener el ID del usuario desde el token JWT

  try {
    // Validar que cursoId esté presente y sea un número entero positivo
    if (!cursoId || isNaN(cursoId) || cursoId <= 0) {
      return res.status(400).json({ message: "ID de curso inválido" });
    }

    // Verificar si el usuario ya está inscrito en el curso
    const [existingEnrollment] = await db.promise().query(
      "SELECT * FROM curso_usuario WHERE Id_Usuario = ? AND Id_Curso = ?",
      [userId, cursoId]
    );

    if (existingEnrollment.length > 0) {
      return res.status(409).json({ message: "Ya estás inscrito en este curso" });
    }

    // Insertar la inscripción en la tabla curso_usuario con la fecha actual
    await db.promise().query(
      "INSERT INTO curso_usuario (Id_Usuario, Id_Curso, Fecha_Inscripcion) VALUES (?, ?, NOW())",
      [userId, cursoId]
    );

    // Responder con un estado 200 y un mensaje de éxito
    return res.status(200).json({ message: "Inscripción exitosa" });
  } catch (error) {
    // Manejo de errores: registrar el error en la consola y responder con un estado 500 y un mensaje JSON
    console.error("Error al inscribirse:", error);
    return res.status(500).json({ message: "Error al procesar la inscripción" });
  }
});

// Ruta GET "/verificarInscripcion/:cursoId" para verificar la inscripción en un curso
router.get("/verificarInscripcion/:cursoId", verifyToken, async (req, res) => {
  const cursoId = req.params.cursoId;
  const userId = req.userId;

  try {
    // Validar que cursoId esté presente y sea un número entero positivo
    if (!cursoId || isNaN(cursoId) || cursoId <= 0) {
      return res.status(400).json({ message: "ID de curso inválido" });
    }

    // Verificar si el usuario ya está inscrito en el curso
    const [existingEnrollment] = await db.promise().query(
      "SELECT * FROM curso_usuario WHERE Id_Usuario = ? AND Id_Curso = ?",
      [userId, cursoId]
    );

    if (existingEnrollment.length > 0) {
      return res.status(200).json({ inscrito: true });
    } else {
      return res.status(200).json({ inscrito: false });
    }
  } catch (error) {
    // Manejo de errores: registrar el error en la consola y responder con un estado 500 y un mensaje JSON
    console.error("Error al verificar la inscripción:", error);
    return res.status(500).json({ message: "Error al verificar la inscripción" });
  }
});

module.exports = router;
