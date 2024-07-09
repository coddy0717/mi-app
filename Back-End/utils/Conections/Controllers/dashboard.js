// routes/dashboard.js

const express = require("express");
const router = express.Router();
const verifyToken = require("../Token/JWT");
const db = require("../Database/Db");

// Endpoint para obtener los datos de inscripciones por curso
router.get("/enrollmentCounts", verifyToken, async (req, res) => {
  const userId = req.userId; // Obtener el ID del usuario del token

  const query = `
    SELECT 
      c.Id_Curso,
      c.Nombre_Curso, 
      COUNT(cu.Id_Usuario) as Numero_Inscritos
    FROM 
      curso c
    LEFT JOIN 
      curso_usuario cu ON c.Id_Curso = cu.Id_Curso
    WHERE 
      c.Id_Usuario = ?
    GROUP BY 
      c.Id_Curso
    HAVING 
      COUNT(cu.Id_Usuario) > 0;
  `;

  try {
    const [results] = await db.promise().query(query, [userId]);
    res.json(results);
  } catch (error) {
    console.error(
      "Error al obtener los datos de inscripciones por curso:",
      error
    );
    res.status(500).json({
      message: "Error al obtener los datos de inscripciones por curso",
    });
  }
});

// Endpoint para obtener la distribución por género de un curso específico
router.get("/genderDistribution/:cursoId", verifyToken, async (req, res) => {
  const userId = req.userId; // Obtener el ID del usuario del token
  const cursoId = req.params.cursoId; // Obtener el ID del curso seleccionado

  const query = `
    SELECT
      u.Genero as gender,
      COUNT(*) as count
    FROM 
      curso_usuario cu
    JOIN 
      usuario u ON cu.Id_Usuario = u.Id_Usuario
    WHERE 
      cu.Id_Curso = ?
    GROUP BY 
      u.Genero;
  `;

  try {
    const [results] = await db.promise().query(query, [cursoId]);
    res.json(results);
  } catch (error) {
    console.error("Error al obtener la distribución por género:", error);
    res
      .status(500)
      .json({ message: "Error al obtener la distribución por género" });
  }
});

module.exports = router;
