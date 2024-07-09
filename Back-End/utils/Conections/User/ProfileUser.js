// Backend - router.js
const express = require("express");
const db = require("../Database/Db");
const verifyToken = require("../Token/JWT");

const router = express.Router();

/**
 * @description Ruta para obtener los datos del usuario logueado.
 */
router.get("/profile", verifyToken, (req, res) => {
  const userId = req.userId;

  const q = `
    SELECT 
      u.Id_Usuario, 
      u.ID_Roll,  
      u.Nombres, 
      u.genero,
      u.Apellidos, 
      u.Correo_Electronico, 
      u.Nombre_Usuario, 
      u.Fecha_Nacimiento, 
      u.Direccion, 
      r.Nombre_Roll
    FROM usuario u
    JOIN rol r ON u.ID_Roll = r.Id_Roll
    WHERE u.Id_Usuario = ?;
  `;

  db.query(q, [userId], (err, data) => {
    if (err) {
      console.error("Error al obtener los datos del usuario:", err);
      return res.status(500).json(err);
    }

    if (data.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const user = data[0];
    return res.json(user);
  });
});

/**
 * @description Ruta para obtener la foto de perfil del usuario logueado.
 */
router.get("/profile-pic", verifyToken, (req, res) => {
  const userId = req.userId;

  const q = "SELECT Foto_Perfil FROM usuario WHERE Id_Usuario = ?";

  db.query(q, [userId], (err, data) => {
    if (err) {
      console.error("Error al obtener la foto de perfil:", err);
      return res.status(500).json(err);
    }

    if (data.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const fotoPerfil = data[0].Foto_Perfil;
    res.writeHead(200, {
      "Content-Type": "image/jpeg",
      "Content-Length": fotoPerfil.length,
    });
    res.end(fotoPerfil); // Enviamos la imagen binaria como respuesta
  });
});

/**
 * @description Ruta para actualizar los datos del usuario logueado.
 */
router.put("/profile", verifyToken, (req, res) => {
  const userId = req.userId;
  const { Nombres, Apellidos, Direccion } = req.body;

  const q = `
    UPDATE usuario
    SET Nombres = ?, Apellidos = ?, Direccion = ?
    WHERE Id_Usuario = ?;
  `;

  db.query(q, [Nombres, Apellidos, Direccion, userId], (err, result) => {
    if (err) {
      console.error("Error al actualizar los datos del usuario:", err);
      return res.status(500).json(err);
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.json({ message: "Datos actualizados correctamente" });
  });
});

module.exports = router;
