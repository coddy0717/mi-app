const express = require("express");
const router = express.Router();
const db = require("../Database/Db");
const verifyToken = require("../Token/JWT");

// Ruta GET "/cursosInscritos" para obtener los cursos inscritos por un usuario
router.get("/cursosInscritos", verifyToken, async (req, res) => {
  const userId = req.userId;

  try {
    // Consulta SQL para obtener los cursos inscritos por el usuario, ordenados por fecha de inscripción
    const [results] = await db
      .promise()
      .query(
        `SELECT
    curso.Id_Curso,
    curso.Nombre_Curso,
    curso.Fecha_Creacion,
    curso.Duracion_Curso,
    curso.Descripcion,
    curso.Miniatura,
    facultad.Nombre_Facultad,
    carrera.Nombre_Carrera,
    asignatura.Nombre_Categoria,
    usuario.Nombres AS Nombre_Usuario,
    curso_usuario.Fecha_Inscripcion,
    curso_usuario.Valoracion
FROM
    curso_usuario
JOIN
    curso ON curso_usuario.Id_Curso = curso.Id_Curso
JOIN
    asignatura ON curso.Id_Asignatura = asignatura.Id_Asignatura
JOIN
    carrera ON asignatura.Id_Carrera = carrera.Id_Carrera
JOIN
    facultad ON carrera.Id_Facultad = facultad.Id_Facultad
JOIN
    usuario ON curso_usuario.Id_Usuario = usuario.Id_Usuario
WHERE
    curso_usuario.Id_Usuario = ? -- Aquí colocas el ID del usuario para el que quieres obtener los cursos inscritos
ORDER BY
    curso_usuario.Fecha_Inscripcion DESC;`,
        [userId]
      );

    if (results.length === 0) {
      // Si no se encontraron cursos inscritos, responder con un mensaje adecuado
      return res.status(404).json({ message: "No has inscrito en ningún curso aún." });
    }

    // Convertir la miniatura a base64 si existe
    const cursosInscritos = results.map((curso) => ({
      ...curso,
      Miniatura: curso.Miniatura ? curso.Miniatura.toString("base64") : null,
    }));

    // Responder con los cursos inscritos en formato JSON
    return res.status(200).json(cursosInscritos);
  } catch (error) {
    // Manejo de errores: registrar el error y responder con un estado 500 y un mensaje JSON
    console.error("Error al obtener cursos inscritos:", error);
    return res.status(500).json({ message: "Error al procesar la solicitud" });
  }
});

module.exports = router;
