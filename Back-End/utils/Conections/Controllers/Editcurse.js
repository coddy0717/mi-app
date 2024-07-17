const express = require("express");
const db = require("../Database/Db");
const verifyToken = require("../Token/JWT");
const router = express.Router();
const multer = require("multer");

// Configurar multer para almacenar archivos en memoria con un límite de tamaño de archivo de 100MB
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024 * 1024 }, // 4GB
});
router.get("/CursoCompleto/:id", verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const [curso] = await db
      .promise()
      .query(`SELECT * FROM curso WHERE Id_Curso = ?`, [id]);

    if (curso.length === 0) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    const [temas] = await db
      .promise()
      .query(`SELECT * FROM tema WHERE Id_Curso = ?`, [id]);

    const [clases] = await db
      .promise()
      .query(`SELECT * FROM clase WHERE Id_Tema IN (?)`, [
        temas.map((tema) => tema.Id_Tema),
      ]);
    // Convertir el video a base64
    const clasesWithVideo = clases.map((clase) => {
      return {
        ...clase,
        Video: clase.Video ? Buffer.from(clase.Video).toString("base64") : null,
      };
    });
    const [recursos] = await db
      .promise()
      .query(`SELECT * FROM recurso WHERE Id_Clase IN (?)`, [
        clases.map((clase) => clase.Id_Clase),
      ]);

    const recursosWithFiles = recursos.map((recurso) => {
      return {
        ...recurso,
        Archivo_Recurso: recurso.Archivo_Recurso
          ? Buffer.from(recurso.Archivo_Recurso).toString("base64")
          : null,
      };
    });

    res.status(200).json({
      curso: curso[0],
      temas,
      clases: clasesWithVideo,
      recursos: recursosWithFiles,
    });
  } catch (error) {
    console.error("Error al obtener el curso:", error);
    res.status(500).json({ message: "Error al obtener el curso" });
  }
});

router.put(
  "/Curso/:id",
  verifyToken,
  upload.fields([
    { name: "Miniatura", maxCount: 1 },
    { name: "Video", maxCount: 1 },
    { name: "Archivo_Recurso", maxCount: 1 },
  ]),
  async (req, res) => {
    const { id } = req.params;
    const {
      Nombre_Curso,
      Descripcion,
      Duracion_Curso,
      Nombre_Tema,
      Duracion_Tema,
      Nombre_Clase,
      Nombre_Recurso,
      Descripcion_Recurso,
    } = req.body;
    const miniatura = req.files?.Miniatura
      ? req.files.Miniatura[0].buffer
      : null;
    const video = req.files?.Video ? req.files.Video[0].buffer : null;
    const archivorecurso = req.files?.Archivo_Recurso
      ? req.files.Archivo_Recurso[0].buffer
      : null;

    try {
      let query = `UPDATE curso SET Nombre_Curso = ?, Descripcion = ?, Duracion_Curso = ?`;
      const params = [Nombre_Curso, Descripcion, Duracion_Curso];

      if (miniatura) {
        query += `, Miniatura = ?`;
        params.push(miniatura);
      }

      query += ` WHERE Id_Curso = ?`;
      params.push(id);

      const [resultCurso] = await db.promise().query(query, params);

      if (resultCurso.affectedRows === 0) {
        return res.status(404).json({ message: "Curso no encontrado" });
      }

      query = `
        UPDATE tema t
        INNER JOIN curso c ON t.Id_Curso = c.Id_Curso
        SET t.Nombre_Tema = ?, t.Duracion_Tema = ?
        WHERE t.Id_Curso = ?
      `;
      const paramsTema = [Nombre_Tema, Duracion_Tema, id];

      await db.promise().query(query, paramsTema);

      query = `UPDATE clase c
               INNER JOIN tema t ON c.Id_Tema = t.Id_Tema
               SET c.Nombre_Clase = ?`;
      const paramsClase = [Nombre_Clase];

      if (video) {
        query += `, c.Video = ?`;
        paramsClase.push(video);
      }

      query += ` WHERE t.Id_Curso = ?`;
      paramsClase.push(id);

      await db.promise().query(query, paramsClase);

      query = `UPDATE recurso r
               INNER JOIN clase c ON r.Id_Clase = c.Id_Clase
               INNER JOIN tema t ON c.Id_Tema = t.Id_Tema
               SET r.Nombre_Recurso = ?, r.Descripcion_Recurso = ?`;
      const paramsRecurso = [Nombre_Recurso, Descripcion_Recurso];

      if (archivorecurso) {
        query += `, r.Archivo_Recurso = ?`;
        paramsRecurso.push(archivorecurso);
      }

      query += ` WHERE t.Id_Curso = ?`;
      paramsRecurso.push(id);

      await db.promise().query(query, paramsRecurso);

      res
        .status(200)
        .json({ message: "Curso y contenido actualizado correctamente" });
    } catch (error) {
      console.error("Error al actualizar el curso y el contenido:", error);
      res
        .status(500)
        .json({ message: "Error al actualizar el curso y el contenido" });
    }
  }
);

module.exports = router;
