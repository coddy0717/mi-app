const express = require("express");
const bcrypt = require("bcrypt");
const db = require("./conectiondb");

const router = express.Router();

/**
 * @description Ruta para iniciar sesión.
 * @param {string} req.body.Correo_Electronico - El correo electrónico del usuario.
 * @param {string} req.body.Contrasena - La contraseña del usuario.
 */
router.post("/Login", async (req, res) => {
  const { Correo_Electronico, Contrasena } = req.body;

  // Consulta SQL para buscar el usuario por correo electrónico.
  const q = "SELECT * FROM usuario WHERE Correo_Electronico = ?";
  db.query(q, [Correo_Electronico], async (err, data) => {
    if (err) {
      console.error("Error al iniciar sesión:", err);
      return res.status(500).json(err);
    }

    // Verificar si el usuario existe.
    if (data.length === 0) {
      return res
        .status(401)
        .json({ message: "Correo electrónico no encontrado" });
    }

    const user = data[0];

    // Comparar la contraseña proporcionada con la almacenada en la base de datos.
    const passwordMatch = await bcrypt.compare(Contrasena, user.Contrasena);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Si todo es correcto, devolver un mensaje de éxito.
    return res.json({ message: "Sesión iniciada correctamente" });
  });
});

module.exports = router;
