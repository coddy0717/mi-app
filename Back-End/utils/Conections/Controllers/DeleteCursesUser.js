const db = require("../Database/Db");
const express = require("express");
const verifyToken = require("../Token/JWT");
const router = express.Router();

router.delete("/DeleteCurso/:cursoId", verifyToken, async (req, res) => {
  const { userId } = req;
  const { cursoId } = req.params;

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

    if (results.length === 0) {
      return res.status(404).json({
        message: "No se encontró el curso para este usuario o no existe",
      });
    }

    // Obtener los temas relacionados con el curso
    const [temas] = await db.promise().query(
      `
      SELECT Id_Tema
      FROM tema
      WHERE Id_Curso = ?`,
      [cursoId]
    );

    for (const tema of temas) {
      // Obtener las clases relacionadas con el tema
      const [clases] = await db.promise().query(
        `
        SELECT Id_Clase
        FROM clase
        WHERE Id_Tema = ?`,
        [tema.Id_Tema]
      );

      for (const clase of clases) {
        // Eliminar los recursos relacionados con la clase
        await db.promise().query(
          `
          DELETE FROM recurso
          WHERE Id_Clase = ?`,
          [clase.Id_Clase]
        );
      }

      // Eliminar las clases relacionadas con el tema
      await db.promise().query(
        `
        DELETE FROM clase
        WHERE Id_Tema = ?`,
        [tema.Id_Tema]
      );
    }

    // Eliminar los temas relacionados con el curso
    await db.promise().query(
      `
      DELETE FROM tema
      WHERE Id_Curso = ?`,
      [cursoId]
    );
    await db.promise().query(
      `
      DELETE FROM curso_usuario
      WHERE Id_Curso = ?`,
      [cursoId]
    );

    // Eliminar el curso de la base de datos
    await db.promise().query(
      `
      DELETE FROM curso
      WHERE Id_Curso = ? AND Id_Usuario = ?`,
      [cursoId, userId]
    );

    return res.status(200).json({ message: "Curso eliminado exitosamente" });
  } catch (error) {
    console.error("Error en la consulta:", error);
    return res.status(500).json({ message: "Error al procesar la solicitud" });
  }
});

module.exports = router;
