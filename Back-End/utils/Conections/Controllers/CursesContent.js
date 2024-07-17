const express = require("express");
const router = express.Router();
const db = require("../Database/Db"); // Módulo de conexión a la base de datos
const verifyToken = require("../Token/JWT"); // Middleware para verificar tokens JWT

// Ruta para obtener el contenido de un curso por Id_Curso
router.get("/courseContent/:idCurso", verifyToken, async (req, res) => {
  const { idCurso } = req.params; // Obtener el idCurso de los parámetros de la solicitud

  try {
    // Consulta para obtener el contenido del curso
    const [rows] = await db.promise().query(
      `SELECT 
        curso.Id_Curso,
        tema.Nombre_Tema,
        tema.Duracion_Tema,
        clase.Nombre_Clase,
        TO_BASE64(clase.Video) AS Video,
        recurso.Nombre_Recurso,
        recurso.Descripcion_Recurso,
        TO_BASE64(recurso.Archivo_Recurso) AS Archivo_Recurso
      FROM 
        curso
      JOIN 
        tema ON curso.Id_Curso = tema.Id_Curso
      JOIN 
        clase ON tema.Id_Tema = clase.Id_Tema
      JOIN 
        recurso ON clase.Id_Clase = recurso.Id_Clase
      WHERE
        curso.Id_Curso = ?`,
      [idCurso]
    );

    // Si no se encuentra ningún contenido para el curso, devolver un error 404
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Contenido del curso no encontrado" });
    }

    // Devolver el contenido del curso en la respuesta con código 200
    res.status(200).json(rows);
  } catch (error) {
    // Manejo de errores: devolver un error 500 si ocurre algún problema
    console.error("Error al obtener el contenido del curso:", error);
    res
      .status(500)
      .json({ message: "Error al obtener el contenido del curso" });
  }
});

module.exports = router;
