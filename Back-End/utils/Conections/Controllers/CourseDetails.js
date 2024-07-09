const express = require("express");
const verifyToken = require("../Token/JWT");
const db = require("../Database/Db");
const router = express.Router();

router.get("/courseDetails/:cursoId", verifyToken, async (req, res) => {
  try {
    const cursoId = req.params.cursoId;
    const [results] = await db.promise().query(
      `
      SELECT 
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
        usuario.Foto_Perfil,
        rol.Nombre_Roll AS Roll_Usuario,
        tema.Nombre_Tema,
        tema.Duracion_Tema,
        clase.Nombre_Clase,
        clase.Video,
        recurso.Nombre_Recurso,
        recurso.Descripcion_Recurso,
        recurso.Archivo_Recurso
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
      JOIN 
        tema ON curso.Id_Curso = tema.Id_Curso
      JOIN 
        clase ON tema.Id_Tema = clase.Id_Tema
      JOIN 
        recurso ON clase.Id_Clase = recurso.Id_Clase
      WHERE
        curso.Id_Curso = ?
    `,
      [cursoId]
    );

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron detalles del curso" });
    }

    const cursoConImagenesBase64 = results.map((curso) => ({
      ...curso,
      Miniatura: curso.Miniatura ? curso.Miniatura.toString("base64") : null,
      Foto_Perfil: curso.Foto_Perfil
        ? curso.Foto_Perfil.toString("base64")
        : null,
      Video: curso.Video ? curso.Video.toString("base64") : null,
      Archivo_Recurso: curso.Archivo_Recurso
        ? curso.Archivo_Recurso.toString("base64")
        : null,
    }));

    return res.status(200).json(cursoConImagenesBase64);
  } catch (error) {
    console.error("Error en la consulta:", error);
    return res.status(500).json({ message: "Error al procesar la solicitud" });
  }
});

module.exports = router;
