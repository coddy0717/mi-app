const db = require("../Database/Db"); // Importa el módulo de conexión a la base de datos
const express = require("express"); // Importa Express para crear la aplicación web
const multer = require("multer"); // Importa Multer para manejar la subida de archivos
const verifyToken = require("../Token/JWT"); // Importa el middleware para verificar tokens JWT

const router = express.Router(); // Crea un enrutador de Express
const upload = multer(); // Configuración de Multer para almacenar archivos en memoria

// Ruta para crear un curso con sus temas, clases y recursos
router.post(
  "/CursesUpload", // Ruta POST para subir información de cursos
  verifyToken, // Middleware para verificar el token JWT
  upload.single("Miniatura"), // Middleware de Multer para manejar la subida de una miniatura
  async (req, res) => {
    // Extraer los datos del cuerpo de la solicitud
    const {
      Nombre_Curso,
      Fecha_Creacion,
      Descripcion,
      Duracion_Curso,
      Nombre_Categoria,
      Nombre_Carrera,
      Nombre_Facultad,
      Temas, // Lista de temas
    } = req.body; // Datos del formulario enviado

    const { userId } = req; // Obtener el userId del token verificado

    try {
      // Insertar o actualizar facultad y obtener su ID
      const [facultadResults] = await db
        .promise()
        .query(
          `INSERT INTO facultad (Nombre_Facultad) VALUES (?) ON DUPLICATE KEY UPDATE Nombre_Facultad = VALUES(Nombre_Facultad)`,
          [Nombre_Facultad]
        );
      const Id_Facultad =
        facultadResults.insertId ||
        (
          await db
            .promise()
            .query(
              `SELECT Id_Facultad FROM facultad WHERE Nombre_Facultad = ?`,
              [Nombre_Facultad]
            )
        )[0][0].Id_Facultad; // ID de la facultad insertada o actualizada

      // Insertar o actualizar carrera y obtener su ID
      const [carreraResults] = await db
        .promise()
        .query(
          `INSERT INTO carrera (Nombre_Carrera, ID_FACULTAD) VALUES (?, ?) ON DUPLICATE KEY UPDATE Nombre_Carrera = VALUES(Nombre_Carrera), ID_FACULTAD = VALUES(ID_FACULTAD)`,
          [Nombre_Carrera, Id_Facultad]
        );
      const Id_Carrera =
        carreraResults.insertId ||
        (
          await db
            .promise()
            .query(
              `SELECT Id_Carrera FROM carrera WHERE Nombre_Carrera = ? AND ID_FACULTAD = ?`,
              [Nombre_Carrera, Id_Facultad]
            )
        )[0][0].Id_Carrera; // ID de la carrera insertada o actualizada

      // Insertar o actualizar asignatura y obtener su ID
      const [asignaturaResults] = await db
        .promise()
        .query(
          `INSERT INTO asignatura (Nombre_Categoria, ID_CARRERA) VALUES (?, ?) ON DUPLICATE KEY UPDATE Nombre_Categoria = VALUES(Nombre_Categoria), ID_CARRERA = VALUES(ID_CARRERA)`,
          [Nombre_Categoria, Id_Carrera]
        );
      const Id_Asignatura =
        asignaturaResults.insertId ||
        (
          await db
            .promise()
            .query(
              `SELECT Id_Asignatura FROM asignatura WHERE Nombre_Categoria = ? AND ID_CARRERA = ?`,
              [Nombre_Categoria, Id_Carrera]
            )
        )[0][0].Id_Asignatura; // ID de la asignatura insertada o actualizada

      // Insertar curso con miniatura y userId asociado
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
        req.file.buffer, // Guarda el buffer del archivo de la miniatura en la base de datos
        userId, // ID de usuario obtenido del token JWT
      ];

      const [cursoResults] = await db.promise().query(insertCursoQuery, values);
      const Id_Curso = cursoResults.insertId; // ID del curso insertado

      // Insertar temas, clases y recursos
      for (const tema of JSON.parse(Temas)) {
        const [temaResults] = await db
          .promise()
          .query(
            `INSERT INTO tema (Nombre_Tema, Duracion_Tema, Id_Curso) VALUES (?, ?, ?)`,
            [tema.Nombre_Tema, tema.Duracion_Tema, Id_Curso]
          );
        const Id_Tema = temaResults.insertId;

        for (const clase of tema.Clases) {
          const [claseResults] = await db
            .promise()
            .query(
              `INSERT INTO clase (Nombre_Clase, Video, Duracion_Clase, Id_Tema) VALUES (?, ?, ?, ?)`,
              [clase.Nombre_Clase, clase.Video, clase.Duracion_Clase, Id_Tema]
            );
          const Id_Clase = claseResults.insertId;

          for (const recurso of clase.Recursos) {
            await db
              .promise()
              .query(
                `INSERT INTO recurso (Nombre_Recurso, Descripcion_Recurso, Archivo_Recurso, Id_Clase) VALUES (?, ?, ?, ?)`,
                [
                  recurso.Nombre_Recurso,
                  recurso.Descripcion_Recurso,
                  recurso.Archivo_Recurso,
                  Id_Clase,
                ]
              );
          }
        }
      }

      // Respuesta de éxito
      return res
        .status(201)
        .json({ message: "Curso creado correctamente", Id_Curso });
    } catch (error) {
      // Manejo de errores
      console.error("Error en el registro:", error);
      return res
        .status(500)
        .json({ message: "Error al procesar la solicitud" });
    }
  }
);

// Ruta para obtener los temas, clases y recursos de un curso específico por Id de curso.
router.post("/CursesTopic", verifyToken, async (req, res) => {
  const { cursoId } = req.body; // Asegúrate de pasar el cursoId en el cuerpo de la solicitud

  try {
    // Consulta SQL para obtener los datos del curso, temas, clases y recursos asociados
    const [results] = await db.promise().query(
      `SELECT 
          curso.Id_Curso,
          curso.Nombre_Curso,
          curso.Descripcion AS Descripcion_Curso,
          curso.Fecha_Creacion,
          curso.Duracion_Curso,
          curso.Numero_Inscritos,
          tema.Id_Tema,
          tema.Nombre_Tema,
          tema.Duracion_Tema,
          clase.Id_Clase,
          clase.Nombre_Clase,
          clase.Video,
          clase.Duracion_Clase,
          recurso.Id_Recurso,
          recurso.Nombre_Recurso,
          recurso.Descripcion_Recurso,
          recurso.Archivo_Recurso
      FROM 
          Curso curso
      LEFT JOIN 
          Tema tema ON curso.Id_Curso = tema.Id_Curso
      LEFT JOIN 
          Clase clase ON tema.Id_Tema = clase.Id_Tema
      LEFT JOIN 
          Recurso recurso ON clase.Id_Clase = recurso.Id_Clase
      WHERE
          curso.Id_Curso = ?;`,
      [cursoId]
    );

    // Verificar si se encontraron resultados
    if (results.length === 0) {
      return res.status(404).json({
        message: "No se encontró el curso para este usuario o no existe",
      });
    }

    // Estructurar la respuesta
    const curso = {
      Id_Curso: results[0].Id_Curso,
      Nombre_Curso: results[0].Nombre_Curso,
      Descripcion_Curso: results[0].Descripcion_Curso,
      Fecha_Creacion: results[0].Fecha_Creacion,
      Duracion_Curso: results[0].Duracion_Curso,
      Numero_Inscritos: results[0].Numero_Inscritos,
      temas: [],
    };

    const temasMap = new Map();
    const clasesMap = new Map();

    results.forEach((row) => {
      if (!temasMap.has(row.Id_Tema)) {
        const tema = {
          Id_Tema: row.Id_Tema,
          Nombre_Tema: row.Nombre_Tema,
          Duracion_Tema: row.Duracion_Tema,
          clases: [],
        };
        temasMap.set(row.Id_Tema, tema);
        curso.temas.push(tema);
      }

      if (!clasesMap.has(row.Id_Clase)) {
        const clase = {
          Id_Clase: row.Id_Clase,
          Nombre_Clase: row.Nombre_Clase,
          Duracion_Clase: row.Duracion_Clase,
          Video: row.Video,
          recursos: [],
        };
        clasesMap.set(row.Id_Clase, clase);
        temasMap.get(row.Id_Tema).clases.push(clase);
      }

      if (row.Id_Recurso) {
        clasesMap.get(row.Id_Clase).recursos.push({
          Id_Recurso: row.Id_Recurso,
          Nombre_Recurso: row.Nombre_Recurso,
          Descripcion_Recurso: row.Descripcion_Recurso,
          Archivo_Recurso: row.Archivo_Recurso,
        });
      }
    });

    // Enviar la respuesta
    res.status(200).json({
      curso: curso,
    });
  } catch (error) {
    console.error("Error al consultar los temas del curso:", error);
    res.status(500).json({
      message: "Error interno del servidor al obtener los temas del curso",
    });
  }
});

module.exports = router; // Exporta el enrutador de Express para ser utilizado en la aplicación
