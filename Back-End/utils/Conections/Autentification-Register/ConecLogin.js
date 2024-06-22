const express = require("express");
const bcrypt = require("bcrypt"); //Librería para el hashing de contraseñas.
const jwt = require("jsonwebtoken"); //Librería para la generación y verificación de tokens JWT
const db = require("../Database/Db");

const router = express.Router();
const JWT_SECRET = "Co"; // Reemplaza esto con una clave secreta segura

/**
 * @description Ruta para iniciar sesión.
 * @param {string} req.body.Correo_Electronico - El correo electrónico del usuario.
 * @param {string} req.body.Contrasena - La contraseña del usuario.
 */
router.post("/Login", async (req, res) => {
  const { Correo_Electronico, Contrasena } = req.body;

  // Consulta SQL para buscar al usuario por correo electrónico
  const q = "SELECT * FROM usuario WHERE Correo_Electronico = ?";

  // Ejecución de la consulta en la base de datos
  db.query(q, [Correo_Electronico], async (err, data) => {
    if (err) {
      console.error("Error al iniciar sesión:", err);
      return res.status(500).json(err);
    }

    // Si no se encuentra ningún usuario con el correo electrónico proporcionado
    if (data.length === 0) {
      return res
        .status(401)
        .json({ message: "Correo electrónico no encontrado" });
    }

    // Se obtiene el primer usuario encontrado (debería ser único por la consulta)
    const user = data[0];

    // Comparación de la contraseña ingresada con la contraseña almacenada (hash)
    const passwordMatch = await bcrypt.compare(Contrasena, user.Contrasena);

    // Si las contraseñas no coinciden
    if (!passwordMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Generación de un token JWT para la autenticación del usuario
    const token = jwt.sign({ userId: user.Id_Usuario }, JWT_SECRET, {
      expiresIn: "1d", // El token expira en 1 día
    });

    // Respuesta exitosa con el token y los datos del usuario
    return res.json({
      message: "Sesión iniciada correctamente",
      token,
      user: {
        Id_Usuario: user.Id_Usuario,
        Id_Roll: user.Id_NombreRoll,
        Nombres: user.Nombres,
        Apellidos: user.Apellidos,
        Genero: user.Genero,
        Direccion: user.Direccion,
        Foto_Perfil: user.Foto_Perfil,
        Nombre_Usuario: user.Nombre_Usuario,
        Fecha_Nacimiento: user.Fecha_Nacimiento,
      },
    });
  });
});

module.exports = router;
