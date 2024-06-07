const express = require("express");
const bcrypt = require("bcrypt");
const db = require("./conectiondb");

const router = express.Router();

/**
 * @description Ruta para registrar un nuevo usuario.
 * @param {string} req.body.Nombres - Los nombres del usuario.
 * @param {string} req.body.Apellidos - Los apellidos del usuario.
 * @param {string} req.body.Correo_Electronico - El correo electrónico del usuario.
 * @param {string} req.body.Contrasena - La contraseña del usuario.
 */
router.post("/Register", async (req, res) => {
  try {
    // Definir el número de rondas para generar una sal.
    const saltRounds = 10;

    // Generar una sal para encriptar la contraseña.
    const salt = await bcrypt.genSalt(saltRounds);

    // Encriptar la contraseña proporcionada utilizando la sal generada.
    const hashContrasena = await bcrypt.hash(req.body.Contrasena, salt);

    // Definir la consulta SQL para insertar un nuevo usuario en la base de datos.
    const q =
      "INSERT INTO usuario (`Nombres`, `Apellidos`, `Correo_Electronico`, `Contrasena`) VALUES (?, ?, ?, ?)";

    // Definir los valores que se insertarán en la base de datos.
    const values = [
      req.body.Nombres,
      req.body.Apellidos,
      req.body.Correo_Electronico,
      hashContrasena,
    ];

    // Ejecutar la consulta SQL con los valores proporcionados.
    db.query(q, values, (err, data) => {
      if (err) {
        console.error("Error al insertar el usuario:", err);
        return res.status(500).json(err);
      }
      return res.json("Usuario Añadido");
    });
  } catch (error) {
    console.error("Error en el registro:", error);
    res.status(500).json({ message: "Error al procesar la solicitud" });
  }
});

module.exports = router;
