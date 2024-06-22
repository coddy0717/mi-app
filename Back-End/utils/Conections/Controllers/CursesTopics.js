// const express = require("express");
// const router = express.Router();
// const db = require("../Database/Db"); // configuración de conexión a la base de datos MySQL
// const verifyToken = require("../Token/JWT"); // Middleware para verificar el token JWT

// /**
//  * @route POST /api/curses/CursesTopic/:cursoId
//  * @description Obtener los temas, clases y recursos de un curso específico por Id de curso.
//  * @access Private (requiere token de autenticación)
//  */
// router.post("/CursesTopic", verifyToken, async (req, res) => {
//   const { cursoId } = req.body; // Asegúrate de pasar el cursoId en el cuerpo de la solicitud

//   try {
//     // Consulta SQL para obtener los datos del curso, temas, clases y recursos asociados
//     const [results] = await db.promise().query(
//       `SELECT 
//           curso.Id_Curso,
//           tema.Id_Tema,
//           tema.Nombre_Tema,
//           tema.Duracion_Tema,
//           clase.Id_Clase,
//           clase.Nombre_Clase,
//           clase.Video,
//           clase.Duracion_Clase,
//           recurso.Id_Recurso,
//           recurso.Nombre_Recurso,
//           recurso.Descripcion_Recurso,
//           recurso.Archivo_Recurso
//       FROM 
//           Curso curso
//       LEFT JOIN 
//           Tema tema ON curso.Id_Curso = tema.Id_Curso
//       LEFT JOIN 
//           Clase clase ON tema.Id_Tema = clase.Id_Tema
//       LEFT JOIN 
//           Recurso recurso ON clase.Id_Clase = recurso.Id_Clase
//       WHERE
//           curso.Id_Curso = ?;`,
//       [cursoId]
//     );

//     // Verificar si se encontraron resultados
//     if (results.length === 0) {
//       return res.status(404).json({
//         message: "No se encontró el curso para este usuario o no existe",
//       });
//     }

//     // Estructurar la respuesta
//     const curso = {
//       Id_Curso: results[0].Id_Curso,
//       Nombre_Curso: results[0].Nombre_Curso,
//       Descripcion_Curso: results[0].Descripcion_Curso,
//       Fecha_Creacion: results[0].Fecha_Creacion,
//       Duracion_Curso: results[0].Duracion_Curso,
//       Numero_Inscritos: results[0].Numero_Inscritos,
//       temas: [],
//     };

//     const temasMap = new Map();
//     const clasesMap = new Map();

//     results.forEach((row) => {
//       if (!temasMap.has(row.Id_Tema)) {
//         const tema = {
//           Id_Tema: row.Id_Tema,
//           Nombre_Tema: row.Nombre_Tema,
//           Duracion_Tema: row.Duracion_Tema,
//           clases: [],
//         };
//         temasMap.set(row.Id_Tema, tema);
//         curso.temas.push(tema);
//       }

//       if (!clasesMap.has(row.Id_Clase)) {
//         const clase = {
//           Id_Clase: row.Id_Clase,
//           Nombre_Clase: row.Nombre_Clase,
//           Duracion_Clase: row.Duracion_Clase,
//           recursos: [],
//         };
//         clasesMap.set(row.Id_Clase, clase);
//         temasMap.get(row.Id_Tema).clases.push(clase);
//       }

//       if (row.Id_Recurso) {
//         clasesMap.get(row.Id_Clase).recursos.push({
//           Id_Recurso: row.Id_Recurso,
//           Nombre_Recurso: row.Nombre_Recurso,
//           Descripcion_Recurso: row.Descripcion_Recurso,
//         });
//       }
//     });

//     // Enviar la respuesta
//     res.status(200).json({
//       curso: curso,
//     });
//   } catch (error) {
//     console.error("Error al consultar los temas del curso:", error);
//     res.status(500).json({
//       message: "Error interno del servidor al obtener los temas del curso",
//     });
//   }
// });

// module.exports = router;
