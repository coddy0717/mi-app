// Importar dependencias necesarias
const db = require("../Database/Db");
const express = require("express");
const multer = require("multer");
const verifyToken = require("../Token/JWT");

// Crear una instancia del enrutador de Express
const router = express.Router();

// Configurar multer para almacenar archivos en memoria con un límite de tamaño de archivo de 100MB
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024 * 1024 }, // 4GB
});

// Definir una ruta POST para cargar cursos
router.post(
  "/CursesUpload",
  verifyToken, // Middleware para verificar el token JWT
  upload.fields([
    { name: "Miniatura", maxCount: 1 },
    { name: "Video", maxCount: 1 },
    { name: "Archivo_Recurso", maxCount: 1 },
  ]),
  async (req, res) => {
    // Extraer datos del cuerpo de la solicitud
    const {
      Nombre_Curso,
      Fecha_Creacion,
      Descripcion,
      Duracion_Curso,
      Nombre_Categoria,
      Nombre_Carrera,
      Nombre_Facultad,
      Nombre_Tema,
      Duracion_Tema,
      Nombre_Clase,
      Nombre_Recurso,
      Descripcion_Recurso,
    } = req.body;

    // Extraer ID de usuario del token
    const { userId } = req;

    // Verificar que todos los archivos requeridos están presentes
    if (
      !req.files ||
      !req.files["Miniatura"] ||
      !req.files["Video"] ||
      !req.files["Archivo_Recurso"]
    ) {
      return res
        .status(400)
        .json({ message: "Todos los archivos son requeridos" });
    }

    try {
      // Insertar o actualizar facultad
      const [facultadResults] = await db
        .promise()
        .query(
          `INSERT INTO facultad (Nombre_Facultad) VALUES (?) ON DUPLICATE KEY UPDATE Nombre_Facultad = VALUES(Nombre_Facultad)`,
          [Nombre_Facultad]
        );

      // Obtener ID de la facultad
      const Id_Facultad =
        facultadResults.insertId ||
        (
          await db
            .promise()
            .query(
              `SELECT Id_Facultad FROM facultad WHERE Nombre_Facultad = ?`,
              [Nombre_Facultad]
            )
        )[0][0].Id_Facultad;

      // Insertar o actualizar carrera
      const [carreraResults] = await db
        .promise()
        .query(
          `INSERT INTO carrera (Nombre_Carrera, ID_FACULTAD) VALUES (?, ?) ON DUPLICATE KEY UPDATE Nombre_Carrera = VALUES(Nombre_Carrera), ID_FACULTAD = VALUES(ID_FACULTAD)`,
          [Nombre_Carrera, Id_Facultad]
        );

      // Obtener ID de la carrera
      const Id_Carrera =
        carreraResults.insertId ||
        (
          await db
            .promise()
            .query(
              `SELECT Id_Carrera FROM carrera WHERE Nombre_Carrera = ? AND ID_FACULTAD = ?`,
              [Nombre_Carrera, Id_Facultad]
            )
        )[0][0].Id_Carrera;

      // Insertar o actualizar asignatura
      const [asignaturaResults] = await db
        .promise()
        .query(
          `INSERT INTO asignatura (Nombre_Categoria, ID_CARRERA) VALUES (?, ?) ON DUPLICATE KEY UPDATE Nombre_Categoria = VALUES(Nombre_Categoria), ID_CARRERA = VALUES(ID_CARRERA)`,
          [Nombre_Categoria, Id_Carrera]
        );

      // Obtener ID de la asignatura
      const Id_Asignatura =
        asignaturaResults.insertId ||
        (
          await db
            .promise()
            .query(
              `SELECT Id_Asignatura FROM asignatura WHERE Nombre_Categoria = ? AND ID_CARRERA = ?`,
              [Nombre_Categoria, Id_Carrera]
            )
        )[0][0].Id_Asignatura;

      // Insertar curso
      const insertCursoQuery = `
        INSERT INTO curso (Nombre_Curso, Fecha_Creacion, Duracion_Curso, Descripcion, Id_Asignatura, Miniatura, Id_Usuario)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [
        Nombre_Curso,
        Fecha_Creacion,
        Duracion_Curso,
        Descripcion,
        Id_Asignatura,
        req.files["Miniatura"][0].buffer,
        userId,
      ];

      const [cursoResults] = await db.promise().query(insertCursoQuery, values);
      const Id_Curso = cursoResults.insertId;

      // Insertar tema
      const [temaResults] = await db
        .promise()
        .query(
          `INSERT INTO tema (Id_Curso, Nombre_Tema, Duracion_Tema) VALUES (?, ?, ?)`,
          [Id_Curso, Nombre_Tema, Duracion_Tema]
        );
      const Id_Tema = temaResults.insertId;

      // Insertar clase
      const [claseResults] = await db
        .promise()
        .query(
          `INSERT INTO clase (Id_Tema, Nombre_Clase, Video) VALUES (?, ?, ?)`,
          [Id_Tema, Nombre_Clase, req.files["Video"][0].buffer]
        );
      const Id_Clase = claseResults.insertId;

      // Insertar recurso
      await db
        .promise()
        .query(
          `INSERT INTO recurso (Id_Clase, Nombre_Recurso, Descripcion_Recurso, Archivo_Recurso) VALUES (?, ?, ?, ?)`,
          [
            Id_Clase,
            Nombre_Recurso,
            Descripcion_Recurso,
            req.files["Archivo_Recurso"][0].buffer,
          ]
        );

      // Devolver respuesta exitosa
      return res.status(201).json({
        message: "Curso, tema, clase y recurso creados correctamente",
        Id_Curso,
      });
    } catch (error) {
      // Manejo de errores: devolver un error 500 (Internal Server Error) si ocurre algún problema
      console.error("Error en el registro:", error);
      return res
        .status(500)
        .json({ message: "Error al procesar la solicitud" });
    }
  }
);

// Exportar el router para que pueda ser utilizado en otras partes de la aplicación
module.exports = router;
