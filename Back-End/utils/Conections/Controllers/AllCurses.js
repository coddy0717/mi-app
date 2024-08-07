const db = require("../Database/Db"); // Importa el módulo de conexión a la base de datos (Db.js)
const express = require("express"); // Importa el módulo Express para crear la aplicación web
const verifyToken = require("../Token/JWT"); // Importa el middleware para verificar tokens JWT
const router = express.Router(); // Crea un enrutador de Express para manejar rutas específicas

// Ruta GET "/AllCurse" para obtener información del curso
router.get("/AllCurse", verifyToken, async (req, res) => {
  try {
    const userId = req.userId; // Obtener el ID del usuario desde el token JWT

    // Consulta la información del curso junto con el nombre del usuario y la foto de perfil
    const [results] = await db.promise().query(`
      SELECT 
          curso.Id_Curso,
          curso.Nombre_Curso, 
          curso.Numero_Inscritos,
          curso.Fecha_Creacion, 
          curso.Duracion_Curso, 
          curso.Descripcion, 
          curso.Miniatura,
          facultad.Id_Facultad,
          facultad.Nombre_Facultad, 
          carrera.Id_Carrera,
          carrera.Nombre_Carrera, 
          asignatura.Id_Asignatura,
          asignatura.Nombre_Categoria, 
          usuario.Id_Usuario,
          usuario.Nombres AS Nombre_Usuario,
          usuario.Foto_Perfil,
          rol.ID_Roll,
          rol.Nombre_Roll AS Roll_Usuario
      FROM 
          curso
      JOIN 
          asignatura ON curso.Id_Asignatura = asignatura.Id_Asignatura
      JOIN 
          carrera ON asignatura.Id_Carrera = carrera.Id_Carrera
      JOIN 
          facultad ON carrera.Id_Facultad = facultad.Id_Facultad
      JOIN 
          usuario ON curso.Id_Usuario = usuario.Id_Usuario
      JOIN 
          rol ON usuario.Id_Roll = rol.ID_Roll
      WHERE 
          curso.Id_Usuario != ?
    `, [userId]);

    if (results.length === 0) {
      // Si no se encontraron cursos, responde con un estado 404 y un mensaje JSON
      return res.status(404).json({ message: "No se encontraron cursos" });
    }

    // Convertir la miniatura y la foto de perfil a base64 si existen
    const cursosConImagenesBase64 = results.map((curso) => ({
      ...curso,
      Miniatura: curso.Miniatura ? curso.Miniatura.toString("base64") : null,
      Foto_Perfil: curso.Foto_Perfil
        ? curso.Foto_Perfil.toString("base64")
        : null,
    }));

    // Responde con un estado 200 y la información de los cursos en formato JSON
    return res.status(200).json(cursosConImagenesBase64);
  } catch (error) {
    // Manejo de errores: registra el error en la consola y responde con un estado 500 y un mensaje JSON
    console.error("Error en la consulta:", error);
    return res.status(500).json({ message: "Error al procesar la solicitud" });
  }
});

module.exports = router; // Exporta el enrutador de Express para ser utilizado en otras partes de la aplicación

